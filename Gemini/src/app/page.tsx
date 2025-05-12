"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
const models = [
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash Preview 04-17",
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
    description: "Next generation features, speed, thinking, realtime streaming, and multimodal generation",
    inputs: "Audio, images, videos, and text",
    output: "Text, images (experimental), audio (coming soon)",
    optimizedFor: "Next generation features, speed, thinking, realtime streaming, and multimodal generation",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "8,192",
    keyCapabilities: "Structured outputs, caching, function calling, code execution, search, Live API, thinking (experimental)",
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
    description: "Fast and versatile performance across a diverse variety of tasks",
    inputs: "Audio, images, videos, and text",
    output: "Text",
    optimizedFor: "Fast and versatile performance across a diverse variety of tasks",
    inputTokenLimit: "1,048,576",
    outputTokenLimit: "8,192",
    keyCapabilities: "System instructions, JSON mode, JSON schema, adjustable safety settings, caching, tuning, function calling, code execution",
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
    keyCapabilities: "System instructions, JSON mode, JSON schema, adjustable safety settings, caching, tuning, function calling, code execution",
  },
];
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-blue-950 text-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
        <Image src="/chatbot.gif" alt="Chatbot GIF" unoptimized width={128} height={128} className="mx-auto mb-6 border-double border-8 border-blue-500 rounded-full" />
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">Select a Free Gemini Model</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">Choose a model to start your chat session. Each model is optimized for different use cases.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-zinc-900/70 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-blue-400 mb-2">{model.name}</h2>
              <p className="text-gray-300 text-sm mb-4">{model.description}</p>
              <div className="text-gray-400 text-xs space-y-1 mt-4">
                <p>
                  <strong>Inputs:</strong> {model.inputs}
                </p>
                <p>
                  <strong>Output:</strong> {model.output}
                </p>
                <p>
                  <strong>Optimized for:</strong> {model.optimizedFor}
                </p>
                <p>
                  <strong>Input Token Limit:</strong> {model.inputTokenLimit}
                </p>
                <p>
                  <strong>Output Token Limit:</strong> {model.outputTokenLimit}
                </p>
                <p>
                  <strong>Key Capabilities:</strong> {model.keyCapabilities}
                </p>
              </div>
            </div>
            <Link href={`/chat?model=${model.id}&modelName=${encodeURIComponent(model.name)}`} passHref>
              <motion.button
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-950 transition-colors duration-200 shadow-md mt-6"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}>
                Select
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
