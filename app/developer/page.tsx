"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex-1 p-6 text-white flex flex-col items-center">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold md:h-16 tracking-tight bg-gradient-to-r h-fit from-cyan-400 to-blue-600 bg-clip-text text-transparent animate-pulse">
          Hi, I'm Sagnik Majumder
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-xl text-center">
          Final year CS student at VIT Vellore.
        </p>
        {/* Social Links */}
        <div className="flex gap-4 mt-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="hover:scale-110 transition-transform"
          >
            <Link
              href="https://github.com/sagnikMajumder89"
              target="_blank"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="hover:scale-110 transition-transform"
          >
            <Link
              href="https://www.linkedin.com/in/sagnik-majumder-92345524b/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-16 max-w-2xl text-center"
      >
        <h2 className="text-2xl font-bold mb-2">About Me</h2>
        <p className="text-gray-400">Details</p>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center shadow-lg hover:shadow-cyan-500/50 transition-shadow animate-pulse">
            Skills
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center shadow-lg hover:shadow-blue-500/50 transition-shadow animate-pulse">
            Skills
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center shadow-lg hover:shadow-teal-500/50 transition-shadow animate-pulse">
            Skills
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example Project Card */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #06b6d4" }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-2">ChessMate</h3>
            <p className="text-gray-400 mb-2">
              A chess game where you can play against friends or bots.
            </p>
            <Link
              href="https://github.com/sagnikMajumder89/ChessMate"
              target="_blank"
              className="text-cyan-400 hover:underline"
            >
              View on GitHub
            </Link>
          </motion.div>
          {/* Duplicate for more projects */}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 mb-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Contact</h2>
        <Button asChild variant="default" className="mt-2 animate-bounce">
          <a href="mailto:sagnikm183@gmail.com">Say Hello</a>
        </Button>
      </motion.section>
    </main>
  );
}
