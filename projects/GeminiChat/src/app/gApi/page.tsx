import React from "react";
const page = () => {
  return <div>page</div>;
};
export default page;
// "use client";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Key, ExternalLink, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
// export default function GApi() {
// const router = useRouter();
// const { data: session, status } = useSession();
// const [error, setError] = useState("");
// const [geminiApiKey, setApiKey] = useState("");
// const [success, setSuccess] = useState(false);
// const [isLoading, setIsLoading] = useState(false);
// const [showApiKey, setShowApiKey] = useState(false);
// const handleSubmit = async (event: React.FormEvent) => {
// event.preventDefault();
// setIsLoading(true);
// setError("");
// if (!geminiApiKey) {
// setError("Please enter your API key.");
// setIsLoading(false);
// return;
// }
// try {
// const response = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ geminiApiKey }) });
// if (response.ok) {
// setSuccess(true);
// setTimeout(() => {
// router.push("/chat");
// }, 1500);
// } else {
// setError("Failed to save API key. Please try again.");
// }
// } catch (error) {
// console.error("Error saving API key:", error);
// setError("An error occurred while saving the API key.");
// } finally {
// setIsLoading(false);
// }
// };
// const handleGoBack = () => {
// router.back();
// };
// return (
// <div className="min-h-screen bg-black text-white">
// {/* Background Effects */}
// <div className="fixed inset-0 z-0">
// <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-[100px]"></div>
// <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-3xl"></div>
// <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-3xl"></div>
// </div>
// {/* Header */}
// <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
// <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
// <div className="flex items-center gap-4">
// <button onClick={handleGoBack} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 text-gray-300 hover:text-white">
// <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
// </button>
// <div className="flex items-center gap-2">
// <Image src="/chatbot.gif" alt="Gemini" unoptimized width={32} height={32} className="rounded-full border border-blue-500" />
// <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Gemini</span>
// </div>
// </div>
// </nav>
// </header>
// {/* Main Content */}
// <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
// <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
// {/* Card Container */}
// <div className="relative group">
// <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-sm"></div>
// <div className="relative rounded-2xl p-8 border border-white/10 bg-black/60 backdrop-blur-sm">
// {/* Header */}
// <div className="text-center mb-8">
// <div className="w-16 h-16 mx-auto mb-4 relative">
// <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-xl"></div>
// <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
// <Key size={24} className="text-white" />
// </div>
// </div>
// <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">Enter your Gemini API Key</h1>
// <p className="text-gray-400 text-sm">Secure your access to Gemini's powerful AI models</p>
// </div>
// {/* Instructions */}
// <div className="mb-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
// <p className="text-sm text-gray-300 mb-3">Get your free API key from Google AI Studio:</p>
// <a
// href="https://aistudio.google.com/apikey"
// target="_blank"
// rel="noopener noreferrer"
// className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
// <ExternalLink size={16} /> Visit Google AI Studio
// </a>
// </div>
// {/* Form */}
// <form onSubmit={handleSubmit} className="space-y-6">
// <div>
// <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="geminiApiKey">
// API Key
// </label>
// <div className="relative">
// <input
// className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
// id="geminiApiKey"
// type={showApiKey ? "text" : "password"}
// placeholder="Enter your API key"
// value={geminiApiKey}
// onChange={e => {
// setApiKey(e.target.value);
// setError("");
// }}
// disabled={isLoading}
// />
// <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
// {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
// </button>
// </div>
// </div>
// {/* Error Message */}
// <AnimatePresence>
// {error && (
// <motion.div
// initial={{ opacity: 0, y: -10 }}
// animate={{ opacity: 1, y: 0 }}
// exit={{ opacity: 0, y: -10 }}
// className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
// <AlertCircle size={16} /> <span className="text-sm">{error}</span>
// </motion.div>
// )}
// </AnimatePresence>
// {/* Success Message */}
// <AnimatePresence>
// {success && (
// <motion.div
// initial={{ opacity: 0, y: -10 }}
// animate={{ opacity: 1, y: 0 }}
// exit={{ opacity: 0, y: -10 }}
// className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
// <CheckCircle size={16} /> <span className="text-sm">API key saved successfully! Redirecting...</span>
// </motion.div>
// )}
// </AnimatePresence>
// {/* Submit Button */}
// <motion.button
// type="submit"
// disabled={isLoading || success}
// whileHover={{ scale: isLoading ? 1 : 1.02 }}
// whileTap={{ scale: isLoading ? 1 : 0.98 }}
// className="w-full py-3 rounded-xl font-semibold text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed">
// <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
// <div className="absolute inset-0 bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
// <span className="relative z-10 flex items-center justify-center">
// {isLoading ? (
// <>
// <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Saving...
// </>
// ) : success ? (
// <>
// <CheckCircle size={18} className="mr-2" /> Saved!
// </>
// ) : (
// "Save API Key"
// )}
// </span>
// </motion.button>
// {/* Clear Button */}
// {geminiApiKey && (
// <button
// type="button"
// onClick={() => {
// setApiKey("");
// setError("");
// }}
// className="w-full text-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
// Clear API Key
// </button>
// )}
// </form>
// {/* Security Notice */}
// <div className="mt-6 pt-4 border-t border-white/10">
// <p className="text-xs text-center text-gray-500">Your API key is stored securely and only used to authenticate your requests to Gemini AI</p>
// </div>
// </div>
// </div>
// </motion.div>
// </div>
// </div>
// );
// }
