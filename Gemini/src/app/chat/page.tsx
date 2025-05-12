"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoIosSend } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { BsEraser } from "react-icons/bs";
import { FiSettings, FiUpload } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { freeModels } from "@/lib/models";

interface ChatMessage {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  createdAt: Date;
}

interface ModelConfig {
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
}

interface UploadedFile {
  uri: string;
  mimeType: string;
}

interface CacheInfo {
  name: string;
  model: string;
  expireTime: string;
}

function ChatContent() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionsRefreshTrigger, setSessionsRefreshTrigger] = useState(0);
  const [customSystemInstruction, setCustomSystemInstruction] = useState("You are a helpful AI assistant.");
  const [thinkingBudget, setThinkingBudget] = useState(1024);
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.7,
    maxOutputTokens: 2048,
    topP: 0.95,
    topK: 40,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [tokenCount, setTokenCount] = useState({ input: 0, history: 0 });
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedModelId = searchParams.get("model");
  const [currentModel, setCurrentModel] = useState(freeModels.find(model => model.id === selectedModelId) || freeModels[0]);
  const [caches, setCaches] = useState<CacheInfo[]>([]);
  const [currentCache, setCurrentCache] = useState<CacheInfo | null>(null);
  const [cacheTTL, setCacheTTL] = useState("3600");

  useEffect(() => {
    const modelFromUrl = freeModels.find(model => model.id === selectedModelId);
    if (modelFromUrl) {
      setCurrentModel(modelFromUrl);
    } else {
    }
  }, [selectedModelId]);

  useEffect(() => {
    if (currentSessionId) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/chat/sessions?sessionId=${currentSessionId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch messages");
          }
          const data = await res.json();
          const messagesWithDates = data.map((message: ChatMessage) => ({
            ...message,
            createdAt: new Date(message.createdAt),
          }));
          setResponse(messagesWithDates);
        } catch (error) {
          console.error("Error loading messages:", error);
          if (response.length > 0) {
            setResponse([
              {
                id: Date.now().toString(),
                type: "system",
                content: "Failed to load messages.",
                createdAt: new Date(),
              },
            ]);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessages();
    } else {
      setResponse([]);
    }
  }, [currentSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse([]);
    setIsLoading(false);
    setCurrentSessionId(null);
  };

  const handleSelectSession = (sessionId: string | null) => {
    setCurrentSessionId(sessionId);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploadedFile(data);
      setResponse(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "system" as const,
          content: `File uploaded: ${file.name}`,
          createdAt: new Date(),
        },
      ]);
    } catch {
      setResponse(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "system" as const,
          content: "Failed to upload file.",
          createdAt: new Date(),
        },
      ]);
    }
  };

  const getFullSystemInstruction = (customInstruction: string) => {
    return customInstruction.trim();
  };

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim()) {
      return;
    }
    setIsLoading(true);
    const userMessage = userInput;
    setUserInput("");
    const userMessageObj = {
      id: Date.now().toString(),
      type: "user" as const,
      content: userMessage,
      createdAt: new Date(),
    };
    setResponse(prevResponse => [...prevResponse, userMessageObj]);
    const botMessagePlaceholderId = Date.now().toString() + "-bot";
    setResponse(prevResponse => [
      ...prevResponse,
      {
        id: botMessagePlaceholderId,
        type: "bot" as const,
        content: "",
        createdAt: new Date(),
      },
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          sessionId: currentSessionId,
          model: currentModel.id,
          modelName: currentModel.name,
          systemInstruction: getFullSystemInstruction(customSystemInstruction),
          thinkingBudget,
          modelConfig,
          fileData: uploadedFile,
          cachedContent: currentCache?.name,
        }),
      });
      if (!res.body) {
        throw new Error("Response body is empty");
      }
      const newSessionId = res.headers.get("X-Chat-Session-Id");
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
      }
      const tokenCountHeader = res.headers.get("X-Token-Count");
      if (tokenCountHeader) {
        try {
          const tokenData = JSON.parse(tokenCountHeader);
          setTokenCount(prevCount => ({
            input: tokenData.total,
            history: prevCount.history + tokenData.total,
          }));
        } catch {}
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setResponse(prevResponse => prevResponse.map(msg => (msg.id === botMessagePlaceholderId ? { ...msg, content: accumulatedText } : msg)));
      }
      setSessionsRefreshTrigger(prev => prev + 1);
      setUploadedFile(null);
    } catch {
      setResponse(prevResponse => prevResponse.map(msg => (msg.id === botMessagePlaceholderId ? { ...msg, content: "Failed to generate response." } : msg)));
    } finally {
      setIsLoading(false);
    }
  }, [userInput, currentSessionId, currentModel, customSystemInstruction, thinkingBudget, modelConfig, uploadedFile, currentCache]);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModelId = event.target.value;
    const newModel = freeModels.find(model => model.id === newModelId);
    if (newModel) {
      setCurrentModel(newModel);
      router.replace(`/chat?model=${newModel.id}&modelName=${encodeURIComponent(newModel.name)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fetchCaches = async () => {
    try {
      const res = await fetch("/api/chat/cache");
      if (res.ok) {
        const data = await res.json();
        setCaches(data);
      }
    } catch {}
  };

  useEffect(() => {
    if (showSettings) {
      fetchCaches();
    }
  }, [showSettings]);

  const createCache = async () => {
    try {
      const res = await fetch("/api/chat/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: currentModel.id,
          contents: response.map(msg => ({
            role: msg.type === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
          systemInstruction: customSystemInstruction,
          ttl: `${cacheTTL}s`,
        }),
      });
      if (res.ok) {
        const newCache = await res.json();
        setCurrentCache(newCache);
        setCaches(prev => [...prev, newCache]);
      }
    } catch {}
  };

  const deleteCache = async (cacheName: string) => {
    try {
      await fetch("/api/chat/cache", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cacheName }),
      });
      setCaches(prev => prev.filter(cache => cache.name !== cacheName));
      if (currentCache?.name === cacheName) {
        setCurrentCache(null);
      }
    } catch {}
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black to-blue-950 text-gray-100 overflow-hidden">
      <Sidebar onSelectSession={handleSelectSession} currentSessionId={currentSessionId} sessionsRefreshTrigger={sessionsRefreshTrigger} />
      <div className="flex flex-col flex-1 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" passHref>
            <motion.button
              className="bg-gradient-to-r from-black to-blue-950 text-white px-4 py-2 rounded-xl hover:from-blue-950 hover:to-black text-sm shadow-md border border-blue-900/50"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}>
              Back to Home
            </motion.button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-gray-300 text-sm mr-2">Model:</span>
              <select
                value={currentModel.id}
                onChange={handleModelChange}
                className="bg-zinc-900/70 text-gray-100 text-sm rounded-xl p-2 border border-blue-900/30 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {freeModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl ${showSettings ? "bg-blue-800" : "bg-zinc-900/70"} text-white border border-blue-900/30`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <FiSettings size={20} />
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute right-6 top-20 w-80 bg-zinc-900/95 backdrop-blur-md p-4 rounded-xl border border-blue-900/30 shadow-xl z-50">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Model Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">System Instruction</label>
                  <textarea
                    value={customSystemInstruction}
                    onChange={e => setCustomSystemInstruction(e.target.value)}
                    className="w-full bg-black/50 text-gray-100 text-sm rounded-lg p-2 border border-blue-900/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Temperature ({modelConfig.temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={modelConfig.temperature}
                    onChange={e => setModelConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Max Output Tokens</label>
                  <input
                    type="number"
                    value={modelConfig.maxOutputTokens}
                    onChange={e => setModelConfig(prev => ({ ...prev, maxOutputTokens: parseInt(e.target.value) }))}
                    className="w-full bg-black/50 text-gray-100 text-sm rounded-lg p-2 border border-blue-900/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Top P ({modelConfig.topP})</label>
                  <input type="range" min="0" max="1" step="0.05" value={modelConfig.topP} onChange={e => setModelConfig(prev => ({ ...prev, topP: parseFloat(e.target.value) }))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Top K</label>
                  <input
                    type="number"
                    value={modelConfig.topK}
                    onChange={e => setModelConfig(prev => ({ ...prev, topK: parseInt(e.target.value) }))}
                    className="w-full bg-black/50 text-gray-100 text-sm rounded-lg p-2 border border-blue-900/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Thinking Mode</label>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setThinkingBudget(1024)} className={`px-3 py-1 rounded-lg text-sm ${thinkingBudget === 1024 ? "bg-blue-800 text-white" : "bg-black/50 text-gray-300"}`}>
                      On
                    </button>
                    <button onClick={() => setThinkingBudget(0)} className={`px-3 py-1 rounded-lg text-sm ${thinkingBudget === 0 ? "bg-blue-800 text-white" : "bg-black/50 text-gray-300"}`}>
                      Off
                    </button>
                  </div>
                </div>
                {tokenCount.input > 0 && (
                  <div className="text-sm text-gray-400">
                    <p>Input Tokens: {tokenCount.input}</p>
                    <p>History Tokens: {tokenCount.history}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-blue-900/30 mt-4 pt-4">
                <h4 className="text-md font-semibold mb-2 text-blue-400">Cache Management</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Cache TTL (seconds)</label>
                    <input
                      type="number"
                      value={cacheTTL}
                      onChange={e => setCacheTTL(e.target.value)}
                      className="w-full bg-black/50 text-gray-100 text-sm rounded-lg p-2 border border-blue-900/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="60"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={createCache}
                      className="flex-1 bg-blue-800 text-white px-3 py-1 rounded-lg text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={response.length === 0}>
                      Create Cache
                    </motion.button>
                  </div>
                  {caches.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-400">Available Caches:</p>
                      {caches.map(cache => (
                        <div key={cache.name} className="flex items-center justify-between bg-black/30 p-2 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 truncate">{cache.name}</p>
                            <p className="text-xs text-gray-500">Expires: {new Date(cache.expireTime).toLocaleString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => setCurrentCache(currentCache?.name === cache.name ? null : cache)}
                              className={`px-2 py-1 rounded text-xs ${currentCache?.name === cache.name ? "bg-blue-800 text-white" : "bg-gray-800 text-gray-300"}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              {currentCache?.name === cache.name ? "Active" : "Use"}
                            </motion.button>
                            <motion.button
                              onClick={() => deleteCache(cache.name)}
                              className="px-2 py-1 rounded bg-blue-900/50 text-blue-300 text-xs"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-full flex flex-col">
          {response.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center">
                <RiRobot2Fill className="text-8xl mx-auto mb-8 text-blue-600" />
                <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">Ask Gemini</h1>
                <p className="text-xl text-gray-300 max-w-md mx-auto">Your AI assistant is ready to help. Ask any question or request assistance.</p>
                <motion.div
                  className="w-24 h-1 bg-gradient-to-r from-blue-700 to-black mx-auto mt-6"
                  animate={{ width: ["0%", "24%", "12%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              <AnimatePresence initial={false}>
                {response.map(msg => (
                  <motion.div
                    key={msg.id}
                    className={`flex items-start ${msg.type === "user" ? "justify-end" : "justify-start"} mb-6`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}>
                    {msg.type !== "user" && (
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-black flex items-center justify-center shadow-lg border border-blue-600/50">
                          <RiRobot2Fill className="text-white text-lg" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-3xl p-4 rounded-3xl shadow-md ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-blue-800 to-blue-950 text-white border border-blue-700/30"
                          : "bg-gradient-to-r from-zinc-900 to-black text-gray-100 border border-blue-900/20"
                      }`}>
                      <div className="prose prose-invert max-w-none break-words">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    {msg.type === "user" && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-black flex items-center justify-center shadow-lg border border-blue-500/50">
                          <FaUser className="text-white text-sm" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex items-center text-gray-400 pb-4">
                  <div className="flex space-x-1 ml-12">
                    <motion.div
                      animate={{
                        scale: [0.5, 1, 0.5],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0,
                      }}
                      className="w-2 h-2 rounded-full bg-blue-500"
                    />
                    <motion.div
                      animate={{
                        scale: [0.5, 1, 0.5],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0.2,
                      }}
                      className="w-2 h-2 rounded-full bg-blue-600"
                    />
                    <motion.div
                      animate={{
                        scale: [0.5, 1, 0.5],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0.4,
                      }}
                      className="w-2 h-2 rounded-full bg-blue-700"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          <div className="mt-6">
            <div className="mb-4 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-blue-900/30">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Temperature</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modelConfig.temperature}
                      onChange={e => setModelConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8">{modelConfig.temperature}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Tokens</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="256"
                      max="8192"
                      step="256"
                      value={modelConfig.maxOutputTokens}
                      onChange={e => setModelConfig(prev => ({ ...prev, maxOutputTokens: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{modelConfig.maxOutputTokens}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Top P</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={modelConfig.topP}
                      onChange={e => setModelConfig(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8">{modelConfig.topP}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Top K</label>
                  <div className="flex items-center space-x-2">
                    <input type="range" min="1" max="100" step="1" value={modelConfig.topK} onChange={e => setModelConfig(prev => ({ ...prev, topK: parseInt(e.target.value) }))} className="flex-1" />
                    <span className="text-xs text-gray-400 w-8">{modelConfig.topK}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Thinking Budget</label>
                  <div className="flex items-center space-x-2">
                    <input type="range" min="0" max="2048" step="256" value={thinkingBudget} onChange={e => setThinkingBudget(parseInt(e.target.value))} className="flex-1" />
                    <span className="text-xs text-gray-400 w-12">{thinkingBudget}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Custom Instructions</label>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 bg-black/40 p-2 rounded-lg">
                      Note: Your custom instructions will be combined with the base system prompt that identifies Gemini and handles location/time information.
                    </div>
                    <input
                      type="text"
                      value={customSystemInstruction}
                      onChange={e => setCustomSystemInstruction(e.target.value)}
                      className="w-full bg-black/30 text-gray-100 text-xs rounded-lg p-1.5 border border-blue-900/30"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <span className="mr-4">Model: {currentModel.name}</span>
                {tokenCount.input > 0 && (
                  <>
                    <span className="mr-4">Input Tokens: {tokenCount.input}</span>
                    <span>History Tokens: {tokenCount.history}</span>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <motion.div
                className="flex items-center w-full p-4 bg-black/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-900/30"
                whileHover={{ boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)" }}
                whileFocus={{ borderColor: "rgba(59, 130, 246, 0.5)" }}>
                <label className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer">
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.csv,.md,.json" />
                  <FiUpload size={20} />
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={handleUserInput}
                  onKeyDown={handleKeyPress}
                  placeholder={uploadedFile ? "File uploaded. Type a message..." : "Ask Gemini..."}
                  className="flex-1 text-base outline-none bg-transparent text-gray-100 placeholder-gray-500"
                  disabled={isLoading}
                />
                {response.length > 0 && (
                  <motion.button onClick={handleClear} className="p-2 text-gray-400 hover:text-blue-500 mr-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Clear conversation">
                    <BsEraser size={20} />
                  </motion.button>
                )}
                <motion.button
                  onClick={handleSubmit}
                  className={`p-3 rounded-xl cursor-pointer ${
                    isLoading || !userInput.trim() ? "bg-gray-900 text-gray-600" : "bg-gradient-to-r from-blue-700 to-blue-900 text-white border border-blue-600/30"
                  }`}
                  whileHover={isLoading || !userInput.trim() ? {} : { scale: 1.05, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}
                  whileTap={isLoading || !userInput.trim() ? {} : { scale: 0.95 }}
                  disabled={isLoading || !userInput.trim() === true}>
                  <IoIosSend size={20} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black to-blue-950 text-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading chat...</p>
          </div>
        </div>
      }>
      <ChatContent />
    </Suspense>
  );
}
