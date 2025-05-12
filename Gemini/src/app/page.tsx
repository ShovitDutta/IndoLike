"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

const models = [
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash Preview",
    description: "Adaptive thinking, cost efficiency",
    inputs: "Audio, images, videos, and text",
    output: "Text",
    optimizedFor: "Adaptive thinking, cost efficiency",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "65,536",
    keyCapabilities: "Code execution, function calling, search grounding, structured outputs, thinking",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Next generation features, speed, thinking, realtime streaming",
    inputs: "Audio, images, videos, and text",
    output: "Text, images (experimental), audio (coming soon)",
    optimizedFor: "Next generation features, speed, thinking, multimodal generation",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "8,192",
    keyCapabilities: "Structured outputs, caching, function calling, code execution",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    description: "Cost efficiency and low latency",
    inputs: "Audio, images, videos, and text",
    output: "Text",
    optimizedFor: "Cost efficiency and low latency",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "8,192",
    keyCapabilities: "Structured outputs, caching, function calling",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast and versatile performance across diverse tasks",
    inputs: "Audio, images, videos, and text",
    output: "Text",
    optimizedFor: "Fast and versatile performance across diverse tasks",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "8,192",
    keyCapabilities: "System instructions, JSON mode, code execution",
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    description: "High volume and lower intelligence tasks",
    inputs: "Audio, images, videos, and text",
    output: "Text",
    optimizedFor: "High volume and lower intelligence tasks",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "8,192",
    keyCapabilities: "System instructions, JSON mode, function calling",
  },
];

export default function Home() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const openSignInModal = () => setShowSignInModal(true);
  const closeSignInModal = () => setShowSignInModal(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 text-gray-800 p-6">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12 max-w-4xl">
        <div className="mb-6 relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full bg-white shadow-inner"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-white shadow-lg"></div>
          <Image src="/chatbot.gif" alt="Chatbot GIF" unoptimized width={128} height={128} className="absolute inset-0 mx-auto rounded-full object-cover z-10" />
        </div>

        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">Select a Free Gemini Model</h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose a model to start your chat session. Each model is optimized for different use cases.</p>

        <motion.button
          className="mt-6 px-8 py-3 rounded-xl font-semibold text-white relative"
          style={{
            background: "linear-gradient(145deg, #4a88e5, #3f73c2)",
            boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
          }}
          whileHover={{
            boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
            y: -2,
          }}
          whileTap={{
            boxShadow: "inset 4px 4px 8px #3664a9, inset -4px -4px 8px #599aff",
            y: 0,
          }}
          onClick={openSignInModal}>
          Sign in with Google
        </motion.button>
      </motion.div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative rounded-2xl p-6 flex flex-col justify-between h-full"
            style={{
              background: "linear-gradient(145deg, #ffffff, #e6e9f0)",
              boxShadow: "12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff",
            }}>
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">{model.name}</h2>
              <p className="text-gray-600 mb-4">{model.description}</p>

              <div
                className="bg-blue-50 rounded-xl p-4 mb-4"
                style={{
                  boxShadow: "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
                }}>
                <div className="text-gray-700 space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Inputs:</span> {model.inputs}
                  </p>
                  <p>
                    <span className="font-medium">Output:</span> {model.output}
                  </p>
                  <p>
                    <span className="font-medium">Optimized for:</span> {model.optimizedFor}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className="bg-white rounded-lg p-2"
                  style={{
                    boxShadow: "inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff",
                  }}>
                  <p className="font-medium text-blue-500">Input Limit</p>
                  <p>{model.inputTokenLimit}</p>
                </div>
                <div
                  className="bg-white rounded-lg p-2"
                  style={{
                    boxShadow: "inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff",
                  }}>
                  <p className="font-medium text-blue-500">Output Limit</p>
                  <p>{model.outputTokenLimit}</p>
                </div>
              </div>

              <div
                className="mt-4 p-3 bg-blue-50 rounded-lg text-xs"
                style={{
                  boxShadow: "inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff",
                }}>
                <p className="font-medium text-blue-500">Key Capabilities:</p>
                <p className="text-gray-700">{model.keyCapabilities}</p>
              </div>
            </div>

            <Link href={`/chat?model=${model.id}&modelName=${encodeURIComponent(model.name)}`} passHref>
              <motion.button
                className="w-full py-3 rounded-xl font-semibold text-white mt-6 relative"
                style={{
                  background: "linear-gradient(145deg, #4a88e5, #3f73c2)",
                  boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
                }}
                whileHover={{
                  boxShadow: "4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff",
                  y: -2,
                }}
                whileTap={{
                  boxShadow: "inset 3px 3px 6px #3664a9, inset -3px -3px 6px #599aff",
                  y: 0,
                }}>
                Select
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Sign In Modal */}
      <AnimatePresence>
        {showSignInModal && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeSignInModal} />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
              <div
                className="relative rounded-2xl p-8 bg-white mx-4"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #e6e9f0)",
                  boxShadow: "20px 20px 40px #c3cad5, -20px -20px 40px #ffffff",
                }}>
                <button onClick={closeSignInModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-white shadow-inner"></div>
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-50 to-white shadow-lg"></div>
                    <Image src="/chatbot.gif" alt="Chatbot GIF" unoptimized width={64} height={64} className="absolute inset-0 mx-auto rounded-full object-cover z-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Sign in to Gemini</h2>
                  <p className="text-gray-500 mt-2">Continue with your Google account to access all features</p>
                </div>

                <motion.button
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl mt-4 relative"
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #e6e9f0)",
                    boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
                  }}
                  whileHover={{
                    boxShadow: "4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff",
                    y: -1,
                  }}
                  whileTap={{
                    boxShadow: "inset 3px 3px 6px #c3cad5, inset -3px -3px 6px #ffffff",
                    y: 0,
                  }}
                  onClick={() => signIn("google", { redirectTo: "/" })}>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-gray-800 font-medium">Continue with Google</span>
                </motion.button>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-center text-gray-500">By continuing, you agree to Gemini's Terms of Service and Privacy Policy</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
