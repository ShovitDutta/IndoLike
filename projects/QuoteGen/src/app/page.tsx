"use client";
import { flushSync } from "react-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaBrain, FaGithub, FaTwitter, FaRandom, FaHistory, FaTrash, FaMoon, FaSun, FaSearch, FaCopy, FaTimes, FaBars } from "react-icons/fa";
const topics = [
  "Life",
  "Love",
  "Happiness",
  "Success",
  "Motivation",
  "Inspiration",
  "Friendship",
  "Family",
  "Dreams",
  "Goals",
  "Change",
  "Growth",
  "Learning",
  "Knowledge",
  "Wisdom",
  "Truth",
  "Faith",
  "Hope",
  "Peace",
  "Kindness",
  "Gratitude",
  "Forgiveness",
  "Courage",
  "Strength",
  "Perseverance",
  "Resilience",
  "Attitude",
  "Mindset",
  "Action",
  "Opportunity",
  "Creativity",
  "Innovation",
  "Nature",
  "Beauty",
  "Art",
  "Music",
  "Reading",
  "Writing",
  "Travel",
  "Adventure",
  "Health",
  "Fitness",
  "Mindfulness",
  "Spirituality",
  "Time",
  "Future",
  "Past",
  "Present",
  "Possibility",
  "Potential",
];
type HistoryItem = { topic: string; quote: string; reasoning: string; timestamp: number };
export default function Home() {
  const quoteBuffer = useRef("");
  const reasoningBuffer = useRef("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [reasoning, setReasoning] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const quoteEndRef = useRef<HTMLDivElement>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder, controller: AbortController, currentTopic: string | null) => {
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        setLoading(false);
        controllerRef.current = null;
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      let eventBoundary = buffer.indexOf("\n\n");
      while (eventBoundary !== -1) {
        const event = buffer.substring(0, eventBoundary + 2);
        buffer = buffer.substring(eventBoundary + 2);
        const lines = event.trim().split("\n");
        let eventType = null;
        let data = null;
        for (const line of lines) {
          if (line.startsWith("event: ")) eventType = line.substring(7).trim();
          else if (line.startsWith("data: ")) data = (data === null ? "" : data + "\n") + line.substring(6);
          else if (line === "[DONE]") {
            eventType = "done";
            data = "[DONE]";
          }
        }
        if (eventType === "content" && data !== null) {
          try {
            const payload = JSON.parse(data);
            if (payload.value) quoteBuffer.current += payload.value;
          } catch (e) {
            console.error("Client parse content error", e);
          }
        } else if (eventType === "reasoning" && data !== null) {
          try {
            const payload = JSON.parse(data);
            if (payload.value) reasoningBuffer.current += payload.value;
          } catch (e) {
            console.error("Client parse reasoning error", e);
          }
        } else if (eventType === "done") {
          setLoading(false);
          controllerRef.current = null;
          reader.cancel();
          const finalQuote = quoteBuffer.current;
          const finalReasoning = reasoningBuffer.current;
          setQuote(finalQuote);
          setReasoning(finalReasoning);
          if (currentTopic) {
            setTopicCounts(prevCounts => ({ ...prevCounts, [currentTopic]: (prevCounts[currentTopic] || 0) + 1 }));
            setHistory(prev => [{ topic: currentTopic, quote: finalQuote, reasoning: finalReasoning, timestamp: Date.now() }, ...prev.slice(0, 19)]);
          }
          return;
        }
        eventBoundary = buffer.indexOf("\n\n");
      }
      setQuote(quoteBuffer.current);
      setReasoning(reasoningBuffer.current);
      if (quoteEndRef.current) quoteEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const generateQuote = async (topic: string) => {
    if (controllerRef.current) controllerRef.current.abort();
    setQuote("");
    setReasoning("");
    quoteBuffer.current = "";
    reasoningBuffer.current = "";
    setCurrentTopic(topic);
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await fetch("/api/static", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic }), signal: controller.signal });
      if (!response.ok || !response.body) {
        const errorData = await response.json();
        setError(`API error: ${errorData.error || response.statusText}`);
        setLoading(false);
        controllerRef.current = null;
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      await processStream(reader, decoder, controller, topic);
    } catch (error: any) {
      if (error.name === "AbortError") console.log("Fetch aborted");
      else {
        console.error("Error fetching streaming quote:", error);
        setError("Failed to connect to the server or process stream.");
      }
      setLoading(false);
      controllerRef.current = null;
      flushSync(() => {
        setQuote(quoteBuffer.current);
        setReasoning(reasoningBuffer.current);
      });
    }
  };
  const generateCustomQuote = async (topic: string) => {
    if (controllerRef.current) controllerRef.current.abort();
    setQuote("");
    setReasoning("");
    quoteBuffer.current = "";
    reasoningBuffer.current = "";
    setCurrentTopic(`Custom: ${topic}`);
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await fetch("/api/custom", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic }), signal: controller.signal });
      if (!response.ok || !response.body) {
        const errorData = await response.json();
        setError(`API error: ${errorData.error || response.statusText}`);
        setLoading(false);
        controllerRef.current = null;
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      await processStream(reader, decoder, controller, `Custom: ${topic}`);
    } catch (error: any) {
      if (error.name === "AbortError") console.log("Fetch aborted");
      else {
        console.error("Error fetching streaming custom quote:", error);
        setError("Failed to connect to the server or process stream.");
      }
      setLoading(false);
      controllerRef.current = null;
      flushSync(() => {
        setQuote(quoteBuffer.current);
        setReasoning(reasoningBuffer.current);
      });
    }
  };
  const generateRandomQuote = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    generateQuote(randomTopic);
  };
  const loadHistoryItem = (item: HistoryItem) => {
    setQuote(item.quote);
    setReasoning(item.reasoning);
    setCurrentTopic(item.topic);
    setShowHistory(false);
  };
  const clearHistory = () => {
    setHistory([]);
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const filteredTopics = topics.filter(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);
  const glassStyle = darkMode
    ? "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-red-500/10"
    : "backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-orange-500/20";
  const cardGlassStyle = darkMode
    ? "backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl shadow-red-500/20"
    : "backdrop-blur-lg bg-gradient-to-br from-white/40 to-white/20 border border-white/40 shadow-xl shadow-orange-500/30";
  const buttonGlassStyle = darkMode
    ? "backdrop-blur-md bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-white/20 hover:from-red-500/30 hover:to-pink-500/30 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
    : "backdrop-blur-md bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border border-white/30 hover:from-orange-500/30 hover:to-cyan-500/30 shadow-lg hover:shadow-orange-500/20 transition-all duration-300";
  const inputGlassStyle = darkMode
    ? "backdrop-blur-md bg-white/10 border border-white/20 placeholder:text-white/50 text-white focus:border-red-400/50 focus:ring-red-400/20"
    : "backdrop-blur-md bg-white/30 border border-white/40 placeholder:text-gray-600/70 text-gray-800 focus:border-orange-400/50 focus:ring-orange-400/20";
  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 via-red-900 to-slate-900" : "bg-gradient-to-br from-orange-50 via-white to-cyan-50"}`}>
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/20 blur-3xl rounded-full pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="sticky top-0 z-50">
        <nav className={`mx-4 mt-4 rounded-2xl ${glassStyle}`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`p-2 rounded-xl ${buttonGlassStyle} md:hidden`}>
                <FaBars className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${buttonGlassStyle}`}>
                  <FaQuoteLeft className={`w-6 h-6 ${darkMode ? "text-red-300" : "text-orange-600"}`} />
                </div>
                <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Quote Sculptor</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <button onClick={() => setShowHistory(!showHistory)} className={`px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2`}>
                <FaHistory className="w-4 h-4" />
                <span>History</span>
              </button>
              <button onClick={generateRandomQuote} className={`px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2`}>
                <FaRandom className="w-4 h-4" />
                <span>Random</span>
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-xl ${buttonGlassStyle}`}>
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`mx-4 mt-2 rounded-2xl ${glassStyle} md:hidden`}>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setShowHistory(!showHistory);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2`}>
                  <FaHistory className="w-4 h-4" />
                  <span>History</span>
                </button>
                <button
                  onClick={() => {
                    generateRandomQuote();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2`}>
                  <FaRandom className="w-4 h-4" />
                  <span>Random Quote</span>
                </button>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-full px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2`}>
                  {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <main className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div key="history" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className={`rounded-3xl ${cardGlassStyle} p-6 max-w-6xl mx-auto`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold flex items-center space-x-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  <FaHistory className={darkMode ? "text-red-300" : "text-orange-600"} />
                  <span>Quote History</span>
                </h2>
                <div className="flex space-x-2">
                  <button onClick={clearHistory} className={`px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2 text-red-400`}>
                    <FaTrash className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                  <button onClick={() => setShowHistory(false)} className={`px-4 py-2 rounded-xl ${buttonGlassStyle}`}>
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className={`text-center py-8 ${darkMode ? "text-white/60" : "text-gray-600"}`}>No quotes generated yet</p>
                ) : (
                  history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => loadHistoryItem(item)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        darkMode ? "bg-white/5 hover:bg-white/10 border border-white/10" : "bg-white/30 hover:bg-white/40 border border-white/30"
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className={`font-semibold ${darkMode ? "text-red-300" : "text-orange-600"}`}>{item.topic}</h3>
                        <span className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className={`text-sm italic ${darkMode ? "text-white/80" : "text-gray-700"}`}>"{item.quote.length > 150 ? item.quote.substring(0, 150) + "..." : item.quote}"</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {loading || error || quote ? (
                  <motion.div
                    key="quote-display"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className={`rounded-3xl ${cardGlassStyle} p-8 max-w-4xl mx-auto relative overflow-hidden min-h-64`}>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 rounded-3xl">
                        <div className="text-center">
                          <div className={`w-16 h-16 border-4 border-transparent border-t-current rounded-full animate-spin mb-4 ${darkMode ? "text-red-400" : "text-orange-500"}`}></div>
                          <p className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>Crafting your quote...</p>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className={`p-4 rounded-xl ${darkMode ? "bg-red-500/20 border border-red-400/30" : "bg-red-100/60 border border-red-300/40"} mb-6`}>
                        <p className={`text-center ${darkMode ? "text-red-300" : "text-red-700"}`}>{error}</p>
                      </div>
                    )}
                    {quote && !loading && (
                      <div className="relative">
                        <FaQuoteLeft className={`absolute -top-2 -left-2 text-6xl opacity-20 ${darkMode ? "text-red-300" : "text-orange-400"}`} />
                        <blockquote className={`text-2xl md:text-3xl font-light italic leading-relaxed mb-6 pl-12 ${darkMode ? "text-white" : "text-gray-800"}`}>{quote}</blockquote>
                        <div className="flex justify-between items-center">
                          {currentTopic && <p className={`text-lg ${darkMode ? "text-red-300" : "text-orange-600"}`}>— AI on {currentTopic}</p>}
                          <button onClick={() => copyToClipboard(quote)} className={`px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2`}>
                            <FaCopy className="w-4 h-4" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {reasoning && !loading && (
                      <div className="mt-8">
                        <button onClick={() => setShowReasoning(!showReasoning)} className={`px-4 py-2 rounded-xl ${buttonGlassStyle} flex items-center space-x-2 mb-4`}>
                          <FaBrain className="w-4 h-4" />
                          <span>{showReasoning ? "Hide" : "Show"} AI Reasoning</span>
                        </button>
                        <AnimatePresence>
                          {showReasoning && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`overflow-hidden rounded-xl p-4 ${darkMode ? "bg-white/5 border border-white/10" : "bg-white/30 border border-white/30"}`}>
                              <pre className={`text-sm whitespace-pre-wrap font-mono ${darkMode ? "text-white/80" : "text-gray-700"}`}>{reasoning}</pre>
                              <div ref={quoteEndRef}></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className={`rounded-3xl ${cardGlassStyle} p-12 max-w-4xl mx-auto text-center`}>
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${buttonGlassStyle} flex items-center justify-center`}>
                      <HiOutlineSparkles className={`w-10 h-10 ${darkMode ? "text-red-300" : "text-orange-600"}`} />
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>AI Quote Sculptor</h1>
                    <p className={`text-lg mb-8 ${darkMode ? "text-white/80" : "text-gray-600"}`}>Generate inspiring quotes on any topic with AI-powered creativity</p>
                    <button onClick={generateRandomQuote} className={`px-8 py-4 rounded-xl ${buttonGlassStyle} flex items-center space-x-3 mx-auto text-lg font-medium`}>
                      <FaRandom className="w-5 h-5" />
                      <span>Generate Random Quote</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`rounded-3xl ${cardGlassStyle} p-6 max-w-4xl mx-auto`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center space-x-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  <HiOutlineSparkles className={darkMode ? "text-red-300" : "text-orange-600"} />
                  <span>Custom Quote</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter any topic, theme, or idea..."
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && customTopic.trim()) {
                        generateCustomQuote(customTopic);
                      }
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl ${inputGlassStyle} focus:outline-none focus:ring-2 transition-all`}
                  />
                  <button
                    onClick={() => generateCustomQuote(customTopic)}
                    disabled={loading || !customTopic.trim()}
                    className={`px-6 py-3 rounded-xl ${buttonGlassStyle} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}>
                    Generate
                  </button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`rounded-3xl ${cardGlassStyle} p-6 max-w-6xl mx-auto`}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className={`text-xl font-bold flex items-center space-x-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    <FaSearch className={darkMode ? "text-red-300" : "text-orange-600"} />
                    <span>Explore Topics</span>
                  </h2>
                  <div className="relative">
                    <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? "text-white/50" : "text-gray-500"}`} />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 rounded-xl ${inputGlassStyle} focus:outline-none focus:ring-2 transition-all w-64`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic, index) => (
                      <motion.button
                        key={topic}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => generateQuote(topic)}
                        disabled={loading}
                        className={`p-3 rounded-xl ${buttonGlassStyle} text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 flex items-center justify-between`}>
                        <span>{topic}</span>
                        {topicCounts[topic] > 0 && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${darkMode ? "bg-red-500/30 text-red-200" : "bg-orange-500/30 text-orange-700"}`}>{topicCounts[topic]}</span>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <p className={`col-span-full text-center py-4 ${darkMode ? "text-white/60" : "text-gray-500"}`}>No topics match your search</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <motion.footer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className={`mt-12 mx-4 rounded-2xl ${glassStyle} p-6`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={darkMode ? "text-white/80" : "text-gray-600"}>© {new Date().getFullYear()} AI Quote Sculptor</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className={darkMode ? "text-red-300 hover:text-white" : "text-orange-600 hover:text-orange-800"}>
                <FaGithub size={20} />
              </a>
              <a href="#" className={darkMode ? "text-red-300 hover:text-white" : "text-orange-600 hover:text-orange-800"}>
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
