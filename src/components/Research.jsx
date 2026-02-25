import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { ppp } from "../assets";


const Research = () => (
  <section className="py-12 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
    <motion.div
      variants={fadeIn("left", "spring", 0.2, 1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-xl md:ml-10 lg:ml-32"
    >
      <h2 className="text-3xl font-bold text-white mb-4">Published Research Paper</h2>
      <div className="bg-black-100 rounded-xl p-6 shadow-lg border border-gray-800">
        <p className="text-lg text-white mb-2">
          <span className="font-semibold">AI and Privacy: Ethical Concerns in Data Collection and Surveillance</span> in the <span className="italic">International Journal for Multidisciplinary Research (IJFMR)</span>, Volume 6, Issue 6 (Impact Factor: 9.24).
        </p>
        <a
          href="https://www.ijfmr.com/research-paper.php?id=32150"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-400 hover:underline hover:text-blue-300 font-medium"
        >
          View Paper ↗
        </a>
      </div>
    </motion.div>
    <div className="flex-shrink-0 mt-8 md:mt-0 md:mr-12">
      <img
        src={ppp}
        alt="Profile"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-white animate-profile-glow"
      />
    </div>
  </section>
);

export default Research;
