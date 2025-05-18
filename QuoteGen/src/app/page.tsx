"use client";
import { flushSync } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaBrain, FaGithub, FaTwitter } from "react-icons/fa";
const LOCAL_STORAGE_KEY = "quoteGenTopicCounts";
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
  useEffect(() => {
    const savedCounts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCounts) {
      try {
        setTopicCounts(JSON.parse(savedCounts));
      } catch (e) {
        console.error("Failed to parse topic counts from local storage", e);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topicCounts));
  }, [topicCounts]);
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
          setQuote(quoteBuffer.current);
          setReasoning(reasoningBuffer.current);
          if (currentTopic) {
            setTopicCounts(prevCounts => ({ ...prevCounts, [currentTopic]: (prevCounts[currentTopic] || 0) + 1 }));
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
  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-neutral-950 text-white">
      <header className="sticky top-0 w-full z-50">
        <div className="navbar bg-gray-950/80 backdrop-blur shadow-sm border-b border-orange-900/40">
          <div className="flex-none"></div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">
              <FaQuoteLeft className="mr-3 text-orange-400 text-2xl" /> AI Quote Sculptor
            </a>
          </div>
          <div className="flex-none"></div>
        </div>
      </header>
      <section className="flex flex-col items-center flex-grow p-6 pt-12">
        <AnimatePresence mode="wait">
          {loading || error || quote || reasoning ? (
            <motion.div
              key="output-area"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-5xl w-full relative min-h-[200px]">
              {loading && (
                <motion.div
                  key="loading-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 bg-opacity-60 z-20 text-orange-300 text-xl font-semibold">
                  <div className="flex w-full flex-col gap-4 p-4">
                    <div className="skeleton h-32 w-full"></div> <div className="skeleton h-4 w-28"></div> <div className="skeleton h-4 w-full"></div> <div className="skeleton h-4 w-full"></div>
                  </div>
                </motion.div>
              )}
              {error && (
                <motion.div key="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-xl font-semibold z-10">
                  Error: {error}
                </motion.div>
              )}
              {!loading && !error && (quote || reasoning) && (
                <div className="mockup-window bg-base-100 border border-base-300">
                  <div className="grid place-content-center p-8 text-left">
                    {quote && <p className="text-3xl italic font-light text-yellow-100 leading-snug mb-6">"{quote}"</p>}
                    {currentTopic && (quote || reasoning) && <p className={`text-orange-300 text-lg ${quote ? "mt-4" : "mt-0"}`}>- AI on {currentTopic}</p>}
                    <AnimatePresence>
                      {reasoning && (
                        <motion.div
                          key="reasoning-content"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="pt-6 border-t border-white border-opacity-10 overflow-hidden z-10">
                          <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center">
                            <FaBrain className="mr-3 text-orange-400 text-xl" /> AI Reasoning
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{reasoning}</p> <div ref={quoteEndRef}></div>
                        </motion.div>
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
              className="max-w-5xl w-full">
              <div className="mockup-window border border-base-300 w-full">
                <div className="grid place-content-center border-t border-base-300 h-80">
                  <p className="text-xl text-orange-200 font-semibold">Select a topic below to sculpt an AI quote.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-full mx-auto mt-16 px-20">
          <fieldset className="border border-orange-900 p-6 rounded-md">
            <legend className="text-lg font-semibold text-orange-300 px-2">Enter your quote topic or idea for the texts</legend>
            <div className="flex items-center gap-4 mt-4">
              <input
                type="text"
                className="input input-bordered w-full bg-gray-800 text-white border-orange-900 focus:border-orange-400 focus:ring focus:ring-orange-400 focus:ring-opacity-50"
                placeholder="Enter topic or idea"
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
              />
              <button
                className="btn bg-orange-400 text-black font-semibold hover:bg-orange-300 hover:text-black hover:font-bold transition-all duration-300 ease-in-out shadow-md hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => generateCustomQuote(customTopic)}
                disabled={loading || !customTopic.trim()}>
                Generate
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Optional</p>
          </fieldset>
        </div>
        <div className="w-full mx-auto mt-16 px-20">
          <h2 className="text-2xl font-bold text-orange-300 text-center mb-8">Explore Topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topics.map(topic => (
              <button
                key={topic}
                className="w-full px-4 py-2 rounded bg-orange-400 text-black font-semibold  hover:bg-orange-300 hover:text-black hover:font-bold  transition-all duration-300 ease-in-out  shadow-md hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-between items-center"
                onClick={() => generateQuote(topic)}
                disabled={loading}>
                <span>{topic}</span> <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">{topicCounts[topic] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <footer className="bottom-0 w-full p-6 text-center bg-neutral-950 bg-opacity-5 backdrop-filter backdrop-blur-xl mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto flex flex-col md:flex-row justify-between items-center text-orange-200 text-sm">
          <p>© {new Date().getFullYear()} AI Quote Sculptor.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-orange-300 hover:text-white transition-colors">
              <FaGithub size={20} />
            </a>
            <a href="#" className="text-orange-300 hover:text-white transition-colors">
              <FaTwitter size={20} />
            </a>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}
