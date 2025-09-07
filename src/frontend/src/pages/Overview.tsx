import React, { useState } from "react";
import { Sparkles, Image, Zap, Settings, History, User, Moon, Sun, Wand2, Download, Share2, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import PromptBar from "../components/prompting/PromptBar";
import ResultsGrid from "../components/ResultsGrid";

const MidjourneyStudio = () => {
  const [theme, setTheme] = useState("dark");

  const samplePrompts = [
    "/imagine a stunning product advertisement for innovative tech gadget, minimalistic design, clean white background, professional lighting --ar 16:9 --v 5",
    "/imagine modern social media campaign for lifestyle brand, vibrant colors, urban setting, young professionals, dynamic composition --ar 1:1 --v 5",
    "/imagine corporate brand identity design, elegant typography, sophisticated color palette, professional presentation --ar 4:3 --v 5",
    "/imagine eye-catching marketing visual for digital campaign, bold graphics, contemporary style, high impact --ar 16:9 --v 5",
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 border-b border-gray-800 bg-black/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Midjourney
                </h1>
                <p className="text-xs text-gray-400">for Meta Ad Studio</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                <User size={16} />
                <span className="font-medium">Subscribe</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight"
              >
                imagine
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                Create stunning advertisements with AI. Describe your vision and watch the magic happen.
              </motion.p>
            </div>
          </motion.div>

          {/* Prompt Input - Midjourney Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl">
                <div className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Wand2 size={24} className="text-white" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Prompt</h3>
                        <textarea
                          placeholder="/imagine a professional advertisement for a tech product, clean design, modern aesthetic, high quality --ar 16:9 --v 5"
                          className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>AR: 16:9</span>
                          <span>•</span>
                          <span>Quality: High</span>
                          <span>•</span>
                          <span>Style: Modern</span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center space-x-2"
                        >
                          <Zap size={18} />
                          <span>Generate</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sample Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-white">Popular Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {samplePrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group p-6 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-xl transition-all text-left backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mt-1">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 font-mono leading-relaxed group-hover:text-white transition-colors">
                        {prompt}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Creations</h2>
              <p className="text-gray-400">AI-generated advertisements ready for your campaigns</p>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Image size={32} className="text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">No images yet</h3>
                <p className="text-gray-400 mb-6">Enter a prompt above to start generating stunning advertisements</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white shadow-lg transition-all"
                >
                  Start Creating
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-gray-500 text-sm"
          >
            <p>Powered by AI • Built for Meta Ad Studio</p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
};

export default MidjourneyStudio;
