"use client";
import { flushSync } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaBrain, FaGithub, FaTwitter, FaRandom, FaHistory, FaTrash } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const LOCAL_STORAGE_KEY = "quoteGenTopicCounts";
const LOCAL_STORAGE_HISTORY_KEY = "quoteGenHistory";

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

type HistoryItem = {
  topic: string;
  quote: string;
  reasoning: string;
  timestamp: number;
};

export default function Home() {
  const quoteBuffer = useRef("");
  const reasoningBuffer = useRef("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const quoteEndRef = useRef<HTMLDivElement>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [showReasoning, setShowReasoning] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedCounts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCounts) {
      try {
        setTopicCounts(JSON.parse(savedCounts));
      } catch (e) {
        console.error("Failed to parse topic counts from local storage", e);
      }
    }

    const savedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history from local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topicCounts));
  }, [topicCounts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

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
            setTopicCounts(prevCounts => ({
              ...prevCounts,
              [currentTopic]: (prevCounts[currentTopic] || 0) + 1,
            }));

            // Add to history
            setHistory(prev => [
              {
                topic: currentTopic,
                quote: finalQuote,
                reasoning: finalReasoning,
                timestamp: Date.now(),
              },
              ...prev.slice(0, 19), // Keep only the 20 most recent items
            ]);
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
      const response = await fetch("/api/static", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
        signal: controller.signal,
      });

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
      const response = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
        signal: controller.signal,
      });

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

  return (
    <main className={`flex flex-col min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-950 to-neutral-950 text-white" : "bg-gradient-to-b from-orange-50 to-amber-100 text-gray-800"}`}>
      <header className="sticky top-0 w-full z-50">
        <div className={`navbar ${darkMode ? "bg-gray-950/80 border-orange-900/40" : "bg-amber-100/80 border-orange-300/40"} backdrop-blur shadow-sm border-b`}>
          <div className="flex-none">
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <ul tabIndex={0} className={`dropdown-content z-[1] menu p-2 shadow rounded-box w-52 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
                <li>
                  <button onClick={() => setShowHistory(!showHistory)}>
                    <FaHistory /> History
                  </button>
                </li>
                <li>
                  <button onClick={generateRandomQuote}>
                    <FaRandom /> Random Quote
                  </button>
                </li>
                <li>
                  <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <a className={`btn btn-ghost text-xl ${darkMode ? "text-white" : "text-gray-800"}`}>
              <FaQuoteLeft className={`mr-3 ${darkMode ? "text-orange-400" : "text-orange-600"} text-2xl`} />
              AI Quote Sculptor
            </a>
          </div>
          <div className="flex-none">
            <button className={`btn btn-ghost btn-circle ${darkMode ? "text-orange-400" : "text-orange-600"}`} onClick={generateRandomQuote}>
              <FaRandom className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="flex flex-col items-center flex-grow p-4 md:p-6 pt-8 md:pt-12">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-7xl w-full">
              <div className={`card w-full ${darkMode ? "bg-gray-900 shadow-orange-500/10" : "bg-white shadow-orange-200/50"} shadow-lg rounded-xl`}>
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h2 className={`card-title ${darkMode ? "text-orange-300" : "text-orange-600"}`}>Quote History</h2>
                    <div className="flex gap-2">
                      <button className={`btn btn-sm ${darkMode ? "btn-error" : "btn-error text-white"}`} onClick={clearHistory}>
                        <FaTrash /> Clear All
                      </button>
                      <button className={`btn btn-sm ${darkMode ? "btn-ghost" : "btn-ghost"}`} onClick={() => setShowHistory(false)}>
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-700 mt-4 max-h-[60vh] overflow-y-auto">
                    {history.length === 0 ? (
                      <p className="py-4 text-center text-gray-400">No history yet</p>
                    ) : (
                      history.map((item, index) => (
                        <div key={index} className={`py-4 ${darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-100/50"} px-2 rounded cursor-pointer`} onClick={() => loadHistoryItem(item)}>
                          <div className="flex justify-between items-center">
                            <h3 className={`font-medium ${darkMode ? "text-orange-300" : "text-orange-600"}`}>{item.topic}</h3>
                            <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                          <p className={`text-sm italic mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>"{item.quote.length > 100 ? item.quote.substring(0, 100) + "..." : item.quote}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : loading || error || quote || reasoning ? (
            <motion.div
              key="output-area"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-7xl w-full relative min-h-[200px]">
              {loading && (
                <motion.div
                  key="loading-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center ${darkMode ? "bg-gray-950 bg-opacity-60" : "bg-white bg-opacity-70"} z-20 text-xl font-semibold rounded-xl`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="loading loading-spinner loading-lg text-orange-400"></div>
                    <p className={darkMode ? "text-orange-300" : "text-orange-600"}>Crafting your quote...</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div key="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Error: {error}</span>
                </motion.div>
              )}

              {!loading && !error && (quote || reasoning) && (
                <div className={`card ${darkMode ? "bg-gray-900 shadow-orange-500/10" : "bg-white shadow-orange-200/50"} shadow-xl`}>
                  <div className="card-body">
                    {quote && (
                      <div className="relative p-4 md:p-8">
                        <FaQuoteLeft className={`absolute top-0 left-0 text-4xl opacity-20 ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
                        <p className={`text-2xl md:text-3xl italic font-light ${darkMode ? "text-yellow-100" : "text-orange-800"} leading-relaxed mb-6 pl-8 pr-4`}>{quote}</p>
                        <div className="flex justify-between items-center mt-6">
                          {currentTopic && <p className={`${darkMode ? "text-orange-300" : "text-orange-600"} text-lg`}>— AI on {currentTopic}</p>}
                          <button className={`btn btn-sm ${darkMode ? "btn-ghost text-orange-300" : "btn-ghost text-orange-600"}`} onClick={() => copyToClipboard(quote)}>
                            Copy
                          </button>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {reasoning && (
                        <>
                          <div className="divider mt-2 mb-0">
                            <button className={`btn btn-sm ${darkMode ? "btn-ghost text-orange-300" : "btn-ghost text-orange-600"}`} onClick={() => setShowReasoning(!showReasoning)}>
                              <FaBrain className="mr-2" />
                              {showReasoning ? "Hide AI Reasoning" : "Show AI Reasoning"}
                            </button>
                          </div>

                          {showReasoning && (
                            <motion.div
                              key="reasoning-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="overflow-hidden z-10">
                              <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-800/50" : "bg-orange-50"}`}>
                                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed whitespace-pre-wrap font-mono`}>{reasoning}</p>
                                <div ref={quoteEndRef}></div>
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="initial-state"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-7xl w-full">
              <div className={`hero min-h-[300px] rounded-xl ${darkMode ? "bg-gray-900/50" : "bg-white/80"}`}>
                <div className="hero-content text-center">
                  <div className="max-w-7xl">
                    <h1 className={`text-3xl font-bold ${darkMode ? "text-orange-300" : "text-orange-600"}`}>AI Quote Sculptor</h1>
                    <p className={`py-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Get AI-generated quotes on any topic. Select from our predefined topics or enter your own custom theme.</p>
                    <button
                      className={`btn ${
                        darkMode
                          ? "bg-orange-800 hover:bg-orange-900 text-white hover:text-orange-50 hover:font-bold"
                          : "bg-orange-800 hover:bg-orange-900 text-white hover:text-orange-50 hover:font-bold"
                      }`}
                      onClick={generateRandomQuote}>
                      <FaRandom className="mr-2" /> Generate Random Quote
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-7xl mx-auto mt-10">
          <div className={`card ${darkMode ? "bg-gray-900 shadow-orange-500/10" : "bg-white shadow-orange-200/50"} shadow-lg`}>
            <div className="card-body">
              <h2 className={`card-title ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
                <HiOutlineSparkles className="text-xl" /> Custom Quote
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    darkMode ? "bg-gray-800 text-white border-orange-900" : "bg-orange-50 text-gray-800 border-orange-200"
                  } focus:outline-none focus:ring focus:ring-orange-400 focus:ring-opacity-50`}
                  placeholder="Enter a topic, theme, or idea..."
                  value={customTopic}
                  onChange={e => setCustomTopic(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && customTopic.trim()) {
                      generateCustomQuote(customTopic);
                    }
                  }}
                />
                <button
                  className={`btn ${
                    darkMode ? "bg-orange-800 hover:bg-orange-900 text-white hover:text-orange-50 hover:font-bold" : "bg-orange-800 hover:bg-orange-900 text-white hover:text-orange-50 hover:font-bold"
                  } ${!customTopic.trim() || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => generateCustomQuote(customTopic)}
                  disabled={loading || !customTopic.trim()}>
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto mt-10 mb-10">
          <div className={`card ${darkMode ? "bg-gray-900 shadow-orange-500/10" : "bg-white shadow-orange-200/50"} shadow-lg`}>
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className={`card-title ${darkMode ? "text-orange-300" : "text-orange-600"}`}>Explore Topics</h2>
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    className={`input input-bordered input-sm w-60 ${darkMode ? "bg-gray-800 text-white border-orange-900" : "bg-orange-50 text-gray-800 border-orange-200"}`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map(topic => (
                    <button
                      key={topic}
                      className={`btn ${
                        darkMode
                          ? "bg-orange-800 hover:bg-orange-900 text-white hover:text-orange-50 hover:font-bold"
                          : "bg-orange-800 hover:bg-orange-900 text-white hover:text-orange-50 hover:font-bold"
                      } 
                      border-none shadow-md hover:shadow-lg transition-all`}
                      onClick={() => generateQuote(topic)}
                      disabled={loading}>
                      <div className="flex justify-between items-center w-full">
                        <span>{topic}</span>
                        {topicCounts[topic] > 0 && <span className={`badge badge-sm ${darkMode ? "bg-white text-orange-600" : "bg-white text-orange-600"}`}>{topicCounts[topic]}</span>}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className={`col-span-full text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No topics match your search</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={`w-full py-6 px-4 ${darkMode ? "bg-gray-950" : "bg-amber-100/80"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <p className={darkMode ? "text-orange-200" : "text-orange-800"}>© {new Date().getFullYear()} AI Quote Sculptor</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className={`${darkMode ? "text-orange-300 hover:text-white" : "text-orange-600 hover:text-orange-800"} transition-colors`}>
              <FaGithub size={20} />
            </a>
            <a href="#" className={`${darkMode ? "text-orange-300 hover:text-white" : "text-orange-600 hover:text-orange-800"} transition-colors`}>
              <FaTwitter size={20} />
            </a>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}
