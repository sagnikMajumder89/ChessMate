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
          Hi, I&apos;m Sagnik Majumder
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-xl text-center">
          Final year CS student at VIT Vellore | AWS Certified Solutions
          Architect | Full Stack Developer
        </p>
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
        <p className="text-gray-400">
          I’m a passionate full stack developer specializing in scalable web and
          mobile applications. With strong skills in backend systems, cloud
          infrastructure, and frontend frameworks, I build efficient,
          user-friendly digital solutions. I’m AWS SAA certified and currently
          exploring system design and DevOps.
        </p>
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
          {[
            "C++ / Java / Python / Dart",
            "JavaScript / TypeScript",
            "React.js / Flutter / Node.js",
            "MongoDB / SQL / Prisma",
            "Firebase / Git / GitHub",
            "AWS SAA-C03 / NGINX",
            "DSA / OOP / REST APIs",
          ].map((skill, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg p-4 text-center shadow-lg hover:shadow-cyan-500/50 transition-shadow flex items-center justify-center"
            >
              {skill}
            </div>
          ))}
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
          {[
            {
              title: "ChessMate",
              description:
                "Multiplayer online chess app with matchmaking, ELO-based rating, and interactive UI.",
              link: "https://github.com/sagnikMajumder89/ChessMate",
            },
            {
              title: "ScoreVault",
              description:
                "Flutter-based Android app to track and manage player scores with Firebase auth and database.",
              link: "https://github.com/sagnikMajumder89/ScoreVault",
            },
            {
              title: "MediNexus",
              description:
                "Hackathon-winning app for centralized medical records management. Built with MERN stack.",
              link: "https://github.com/4ByteBuilders/MediNexus/",
            },
          ].map((proj, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px #06b6d4" }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{proj.title}</h3>
              <p className="text-gray-400 mb-2">{proj.description}</p>
              <Link
                href={proj.link}
                target="_blank"
                className="text-cyan-400 hover:underline"
              >
                View on GitHub
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Certifications Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        viewport={{ once: true }}
        className="mt-16 w-full max-w-2xl text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Certifications</h2>
        <ul className="text-gray-400 space-y-2">
          <li>
            <strong>AWS Solutions Architect Associate</strong> – Aug 2024
          </li>
          <li>
            <strong>Web Developer Bootcamp</strong> – Udemy, Nov 2023
          </li>
          <li>
            <strong>Flutter Android App Dev</strong> – Udemy, May 2023
          </li>
          <li>
            <strong>LeetCode Rating:</strong> 1673 (Top 15%)
          </li>
        </ul>
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
