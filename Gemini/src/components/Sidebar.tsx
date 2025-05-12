"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { BiHistory } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
interface ChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  messages: { id: string; content: string; createdAt: string; type: string }[];
}
interface SidebarProps {
  onSelectSession: (sessionId: string | null) => void;
  currentSessionId: string | null;
  sessionsRefreshTrigger: number;
}
export default function Sidebar({ onSelectSession, currentSessionId, sessionsRefreshTrigger }: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/chat/sessions");
        const data = await res.json();
        setSessions(data);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [sessionsRefreshTrigger]);
  const handleRenameSession = async (sessionId: string) => {
    if (!newSessionName.trim()) {
      setEditingSessionId(null);
      setNewSessionName("");
      return;
    }
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSessionName }),
      });
      if (res.ok) {
        const updatedSession = await res.json();
        setSessions(sessions.map(session => (session.id === sessionId ? { ...session, name: updatedSession.name } : session)));
      }
    } catch {
    } finally {
      setEditingSessionId(null);
      setNewSessionName("");
    }
  };
  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this chat session?")) {
      try {
        const res = await fetch(`/api/chat/sessions/delete?id=${sessionId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setSessions(sessions.filter(session => session.id !== sessionId));
          if (currentSessionId === sessionId) {
            onSelectSession(null);
          }
        }
      } catch {}
    }
  };
  const handleDeleteAllSessions = async () => {
    if (window.confirm("Are you sure you want to delete ALL chat sessions? This cannot be undone.")) {
      try {
        const res = await fetch("/api/chat/sessions/delete-all", { method: "DELETE" });
        if (res.ok) {
          setSessions([]);
          onSelectSession(null);
        }
      } catch {}
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sessionId: string) => {
    if (e.key === "Enter") {
      handleRenameSession(sessionId);
    } else if (e.key === "Escape") {
      setEditingSessionId(null);
      setNewSessionName("");
    }
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const sidebarVariants = {
    open: { width: "20rem", opacity: 1 },
    closed: { width: "3rem", opacity: 0.9 },
  };
  return (
    <motion.div
      className="h-full bg-gradient-to-b from-black to-blue-950 text-gray-100 flex flex-col shadow-lg relative border-r border-blue-900/30"
      initial="open"
      animate={isSidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}>
      <motion.button
        className="absolute -right-3 top-4 bg-blue-800 rounded-full p-1 shadow-md z-10 border border-blue-600/30"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1, backgroundColor: "#1e40af" }}
        whileTap={{ scale: 0.95 }}>
        <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.button>
      <div className={`p-4 flex flex-col h-full ${isSidebarOpen ? "block" : "hidden"}`}>
        <div className="flex items-center mb-6">
          <BiHistory className="text-2xl text-blue-500 mr-2" />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">Chat History</h2>
        </div>
        <motion.button
          className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-3 rounded-xl mb-6 hover:from-blue-800 hover:to-black flex items-center justify-center shadow-blue-900/20 shadow-lg border border-blue-800/50"
          onClick={() => onSelectSession(null)}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}>
          <FiPlusCircle className="mr-2" />
          New Chat
        </motion.button>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              {sessions.map(session => (
                <motion.li key={session.id} className="group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  {editingSessionId === session.id ? (
                    <input
                      type="text"
                      value={newSessionName}
                      onChange={e => setNewSessionName(e.target.value)}
                      onBlur={() => handleRenameSession(session.id)}
                      onKeyDown={e => handleKeyDown(e, session.id)}
                      className="w-full bg-gray-700 text-gray-100 p-3 rounded-xl outline-none ring-1 ring-blue-500 focus:ring-2"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          className="p-1 text-gray-500 hover:text-blue-400"
                          onClick={() => {
                            setEditingSessionId(session.id);
                            setNewSessionName(session.name || session.messages[0]?.content.substring(0, 30) || "New Chat");
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}>
                          <FiEdit size={14} />
                        </motion.button>
                        <motion.button className="p-1 text-gray-500 hover:text-blue-500" onClick={() => handleDeleteSession(session.id)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <FiTrash2 size={14} />
                        </motion.button>
                      </div>
                      <motion.button
                        className={`flex-1 text-left p-3 rounded-xl ${
                          session.id === currentSessionId ? "bg-gradient-to-r from-blue-900/70 to-black text-white shadow-md border border-blue-800/30" : "hover:bg-blue-950/30 text-gray-300"
                        }`}
                        onClick={() => onSelectSession(session.id)}
                        onDoubleClick={() => {
                          setEditingSessionId(session.id);
                          setNewSessionName(session.name || session.messages[0]?.content.substring(0, 30) || "New Chat");
                        }}
                        whileHover={{ scale: 1.01, backgroundColor: "#172554" }}
                        whileTap={{ scale: 0.99 }}>
                        <div className="truncate">
                          <ReactMarkdown>{session.name || session.messages[0]?.content.substring(0, 30) || "New Chat"}</ReactMarkdown>
                        </div>
                      </motion.button>
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
        <motion.button
          className="mt-4 bg-gradient-to-r from-black to-blue-950 text-white px-4 py-2 rounded-xl hover:from-blue-950 hover:to-black text-sm shadow-md border border-blue-900/50"
          onClick={handleDeleteAllSessions}
          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}>
          Delete All Chats
        </motion.button>
      </div>
      {!isSidebarOpen && (
        <div className="flex flex-col items-center py-4">
          <BiHistory className="text-2xl text-blue-500 mb-6" />
          <FiPlusCircle
            className="text-white text-xl mb-6 cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => {
              setIsSidebarOpen(true);
              onSelectSession(null);
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
