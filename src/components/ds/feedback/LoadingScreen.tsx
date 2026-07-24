"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoadingScreen({ message = "Curating Botanical Selection..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-2 border-[#1C3322] border-t-[#C9A227] flex items-center justify-center mb-6 shadow-ambient-sm"
      >
        <Sparkles className="w-6 h-6 text-[#C9A227]" />
      </motion.div>

      <h3 className="font-serif text-2xl font-medium text-[#161A17] mb-2 tracking-tight">
        Sana Amnis
      </h3>

      <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#676E6A] font-semibold animate-pulse">
        {message}
      </p>
    </div>
  );
}
