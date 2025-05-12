"use client";
import Image from "next/image";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Code, MessageSquare, Image as ImageIcon, FileText, Zap, Cpu, Menu, X, ChevronDown, FileCode, Search, User } from "lucide-react";

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

const features = [
  {
    icon: <Code size={28} className="text-blue-400" />,
    title: "Code Generation",
    description: "Generate, debug, and optimize code across multiple programming languages.",
  },
  {
    icon: <ImageIcon size={28} className="text-purple-400" />,
    title: "Image Understanding",
    description: "Analyze, describe, and extract information from images with high accuracy.",
  },
  {
    icon: <FileCode size={28} className="text-pink-400" />,
    title: "Function Calling",
    description: "Integrate AI capabilities into your applications with structured data outputs.",
  },
  {
    icon: <Search size={28} className="text-blue-400" />,
    title: "Search Grounding",
    description: "Get real-time information and data-backed responses from reliable sources.",
  },
  {
    icon: <Cpu size={28} className="text-purple-400" />,
    title: "Advanced Thinking",
    description: "Solve complex problems with multi-step reasoning and analytical capabilities.",
  },
  {
    icon: <FileText size={28} className="text-pink-400" />,
    title: "Long Context Window",
    description: "Process and understand extensive documents and conversations with high retention.",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openSignInModal = () => setShowSignInModal(true);
  const closeSignInModal = () => setShowSignInModal(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleModelSelect = (modelId: string, modelName: string | number | boolean) => {
    if (session) window.location.href = `/chat?model=${modelId}&modelName=${encodeURIComponent(modelName)}`;
    else openSignInModal();
  };

  const scrollToModels = () => {
    const element = document.getElementById("model-selection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-[100px]"></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <header className="z-80 border-b border-white/10 sticky top-0 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/chatbot.gif" alt="Gemini" unoptimized width={40} height={40} className="rounded-full border border-blue-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Gemini</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              Playground
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">{session.user?.name}</span>
                <Image src={session.user?.image || "/placeholder-avatar.png"} alt="Profile" width={32} height={32} className="rounded-full border border-white/20" />
              </div>
            ) : (
              <button onClick={openSignInModal} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          <button className="md:hidden text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-white/10">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <a href="#" className="py-2 text-gray-300 hover:text-white">
                  Features
                </a>
                <a href="#" className="py-2 text-gray-300 hover:text-white">
                  Playground
                </a>
                <a href="#" className="py-2 text-gray-300 hover:text-white">
                  Pricing
                </a>

                {!session && (
                  <button onClick={openSignInModal} className="mt-2 w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2">
                    <User size={16} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto mb-16">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 blur-xl"></div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-500 overflow-hidden">
                <Image src="/chatbot.gif" alt="Gemini AI" unoptimized width={96} height={96} className="rounded-full object-cover" />
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Experience the Power
              <br />
              of Gemini AI
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose from our collection of state-of-the-art models optimized for different use cases. Start your journey with advanced AI capabilities today.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-medium flex items-center gap-2 mx-auto"
              onClick={scrollToModels}>
              Get Started <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section id="model-selection" className="relative z-10 py-16 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Select a Free Gemini Model</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Each model is designed and optimized for specific use cases. Choose the one that best suits your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative rounded-2xl p-6 border border-white/10 bg-black/60 backdrop-blur-sm flex flex-col h-full overflow-hidden group-hover:border-blue-500/50 transition-all duration-300">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">{model.name}</h3>
                      <p className="text-gray-300">{model.description}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                      {model.id.includes("2.5") ? <Cpu size={24} /> : model.id.includes("2.0") ? <Zap size={24} /> : <MessageSquare size={24} />}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 mb-5 border border-white/10">
                    <div className="text-gray-300 space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" />
                        <span className="font-medium text-blue-400">Inputs:</span> {model.inputs}
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-400" />
                        <span className="font-medium text-blue-400">Output:</span> {model.output}
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-blue-400" />
                        <span className="font-medium text-blue-400">Optimized for:</span> {model.optimizedFor}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="font-medium text-blue-400 mb-1">Input Limit</p>
                      <p className="text-gray-300">{model.inputTokenLimit}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="font-medium text-blue-400 mb-1">Output Limit</p>
                      <p className="text-gray-300">{model.outputTokenLimit}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg text-xs border border-white/10 mb-6">
                    <p className="font-medium text-blue-400 mb-1">Key Capabilities:</p>
                    <p className="text-gray-300">{model.keyCapabilities}</p>
                  </div>

                  <motion.button
                    className="mt-auto w-full py-3 rounded-xl font-semibold text-white relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModelSelect(model.id, model.name)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <div className="absolute inset-0 bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Select <ChevronRight size={18} />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Explore what Gemini can do for you with these powerful capabilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm">
                <div className="p-3 bg-blue-600/20 rounded-xl inline-block mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Gemini?</h2>
            <p className="text-xl text-gray-300 mb-8">Start using our cutting-edge AI models today and transform the way you work.</p>
            <motion.button
              variants={{
                pulse: {
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }}
              animate="pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-medium flex items-center gap-2 mx-auto"
              onClick={openSignInModal}>
              Get Started Now <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 border-t border-white/10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/chatbot.gif" alt="Gemini" unoptimized width={32} height={32} className="rounded-full border border-blue-500" />
                <span className="text-xl font-bold">Gemini</span>
              </div>
              <p className="text-gray-400 mb-4">Experience the next generation of AI with Gemini's advanced models.</p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Models</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Gemini 2.5 Flash
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Gemini 2.0 Flash
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Gemini 1.5 Flash
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    View All Models
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 Gemini AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </footer>

      <AnimatePresence>
        {showSignInModal && (
          <React.Fragment>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={closeSignInModal} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
              <div className="relative rounded-2xl p-8 mx-4 bg-black/80 backdrop-blur-md border border-white/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full -ml-20 -mb-20"></div>

                <button onClick={closeSignInModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                  <X size={24} />
                </button>

                <div className="text-center mb-8 relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-xl"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 overflow-hidden">
                      <Image src="/chatbot.gif" alt="Gemini AI" unoptimized width={80} height={80} className="rounded-full object-cover" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Sign in to Gemini</h2>
                  <p className="text-gray-400 mt-2">Continue with your Google account to access all features</p>
                </div>

                <motion.button
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl mt-4 relative overflow-hidden group z-10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signIn("google", { redirectTo: "/" })}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-5 h-5 mr-3 relative z-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-white font-medium relative z-10">Continue with Google</span>
                </motion.button>

                <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
                  <p className="text-xs text-center text-gray-400">By continuing, you agree to Gemini's Terms of Service and Privacy Policy</p>
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}
