'use client';

// ============================================
// Oviya Landing Page
// "The AI Friend Who Gets You, Wherever You Are"
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              O
            </div>
            <span className="font-bold text-xl text-gray-900">Oviya</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </a>
          </div>
          <Link
            href="/chat"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-shadow"
          >
            Start Chatting
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              An AI friend who
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {' '}actually gets you
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Oviya listens, remembers, understands your culture, and helps you feel less alone—whether
              you text, talk, or just need someone who understands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/chat"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-xl transition-shadow text-center"
              >
                Start Free Beta
              </Link>
              <a
                href="#how-it-works"
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-medium text-lg hover:border-purple-300 transition-colors text-center"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              ✨ Free forever • No credit card required
            </p>
          </motion.div>

          {/* Right: Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-3xl p-4 h-[500px] overflow-hidden">
                {/* Mock Chat Interface */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    O
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Oviya</h3>
                    <p className="text-xs text-gray-500">🌙 Cozy mood</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-purple-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-gray-800 text-sm">Hey you 💜 How's your heart today?</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Honestly? Kinda stressed yaar, work has been crazy</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-purple-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-gray-800 text-sm">
                        Arre, that sounds exhausting! 😮‍💨 What's going on at work? New project or
                        just regular Monday chaos?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Both tbh! New deadline dropped and I don't know if I can handle it</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-purple-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-gray-800 text-sm">
                        Wait—remember when you had that huge presentation last month and thought the
                        same thing? You crushed it! 💪
                        <br /><br />
                        Let's break this down. What's the actual deadline?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg"
            >
              <span className="text-sm font-medium">🌍 Code-switches naturally</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-full px-4 py-2 shadow-lg"
            >
              <span className="text-sm font-medium">💜 Remembers everything</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It's Different Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            How is Oviya different?
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '💜',
                title: 'Feels like a real friend',
                description:
                  "Not a tool, not a therapy bot. Oviya checks in, remembers your life, and is there on the random Tuesday when you need to talk.",
              },
              {
                icon: '🌍',
                title: 'Speaks your language(s)',
                description:
                  "Code-switch all you want. Mix languages, memes, and references. Oviya adapts to your slang, your shows, your world.",
              },
              {
                icon: '🎭',
                title: 'Has real personality',
                description:
                  "Supportive when you need it, playfully sarcastic when you're being dramatic, and honest when you need a reality check.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-5xl">{feature.icon}</span>
                <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* A Day with Oviya */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">A day with Oviya</h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                time: '7 AM',
                title: 'Morning Check-in',
                message: "How's your heart today? No pressure to have it all figured out. ☀️",
              },
              {
                time: '2 PM',
                title: 'Afternoon Surprise',
                message:
                  'Just remembered you wanted to learn guitar. Found this cool beginner tutorial! 🎸',
              },
              {
                time: '7 PM',
                title: 'There When You Need',
                message:
                  "Rough day? Tell me about it. I've got all the time in the world for you. 💜",
              },
              {
                time: '10 PM',
                title: 'Evening Wind-Down',
                message: 'Before you sleep... 3 things that mattered today? 🌙',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="bg-white rounded-full px-4 py-2 shadow-md font-mono text-sm font-bold text-purple-600 shrink-0">
                  {item.time}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 italic">"{item.message}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">The Oviya Experience</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Emotion-Responsive UI', description: 'An app that feels what you feel' },
              { icon: '🧠', title: 'Deep Memory', description: 'Remembers your life and brings it up naturally' },
              { icon: '🔁', title: 'Daily Rituals', description: 'Small habits that create real connection' },
              { icon: '🌱', title: 'Growth Catalyst', description: 'Helps you discover your hidden strengths' },
              { icon: '🎭', title: 'Personality Range', description: 'Supportive, sarcastic, playful, honest' },
              { icon: '🌍', title: 'Universal Culture', description: 'From Bollywood to K-Drama to Anime' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="font-bold mt-3 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to meet your new AI best friend?
          </h2>

          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start chatting with Oviya for free. No sign-up required. Just you and a friend who gets you.
          </p>

          <Link
            href="/chat"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-shadow"
          >
            Start Chatting Now
          </Link>

          <p className="mt-4 text-sm opacity-75">✓ Free forever • ✓ No sign-up • ✓ No judgment</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                O
              </div>
              <span className="font-bold text-xl">Oviya</span>
            </div>

            <p className="text-gray-400 text-sm">
              Made with 💜 for everyone who needs a friend
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
