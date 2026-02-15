"use client";

import { motion } from "framer-motion";

export default function InteractiveLion() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50">
      <h2 className="text-2xl font-bold text-slate-700 mb-8">Hover to wake the Lion!</h2>
      
      {/* 1. CONTAINER: Detects the Hover */}
      <motion.div
        className="relative w-64 h-64 cursor-pointer"
        initial="rest"
        whileHover="active" // This triggers the "active" variant on all children
        animate="rest"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          
          {/* --- A. THE MANE (Spins on hover) --- */}
          <motion.g
            variants={{
              rest: { rotate: 0 },
              active: { rotate: 180, transition: { type: "spring", damping: 10 } }
            }}
            originX="100px" originY="100px" // Center point for rotation
          >
            {/* Drawing a spiky mane using a simple star shape logic or multiple circles. 
                For simplicity, here is a flower-like mane. */}
            <circle cx="100" cy="100" r="90" fill="#F59E0B" />
            {[...Array(12)].map((_, i) => (
              <circle 
                key={i} 
                cx={100 + 90 * Math.cos((i * 30 * Math.PI) / 180)} 
                cy={100 + 90 * Math.sin((i * 30 * Math.PI) / 180)} 
                r="15" 
                fill="#F59E0B" 
              />
            ))}
          </motion.g>

          {/* --- B. THE HEAD (Face Base) --- */}
          <circle cx="100" cy="100" r="70" fill="#FCD34D" />

          {/* --- C. THE EARS (Wiggle on hover) --- */}
          <motion.circle 
            cx="40" cy="50" r="20" fill="#FCD34D" 
            variants={{ active: { y: -5 } }} 
          />
          <motion.circle 
            cx="160" cy="50" r="20" fill="#FCD34D" 
            variants={{ active: { y: -5 } }} 
          />

          {/* --- D. THE EYES (The Expression Changer) --- */}
          {/* Left Eye */}
          <motion.g variants={{ rest: { scaleY: 0.1 }, active: { scaleY: 1 } }}>
             <circle cx="70" cy="90" r="8" fill="#374151" />
             {/* White sparkle in eye */}
             <circle cx="72" cy="88" r="3" fill="white" />
          </motion.g>
          
          {/* Right Eye */}
          <motion.g variants={{ rest: { scaleY: 0.1 }, active: { scaleY: 1 } }}>
             <circle cx="130" cy="90" r="8" fill="#374151" />
             <circle cx="132" cy="88" r="3" fill="white" />
          </motion.g>

          {/* --- E. THE EYEBROWS (Move Up) --- */}
          <motion.path
            d="M 60 75 Q 70 70 80 75" // Curve for eyebrow
            stroke="#92400E" strokeWidth="4" strokeLinecap="round" fill="transparent"
            variants={{ rest: { y: 0 }, active: { y: -10 } }} // Move UP on hover
          />
          <motion.path
            d="M 120 75 Q 130 70 140 75"
            stroke="#92400E" strokeWidth="4" strokeLinecap="round" fill="transparent"
            variants={{ rest: { y: 0 }, active: { y: -10 } }}
          />

          {/* --- F. THE MOUTH (Smile) --- */}
          {/* Nose */}
          <path d="M 90 110 L 110 110 L 100 120 Z" fill="#78350F" />
          
          {/* Mouth Lines */}
          <motion.path
            d="M 100 120 Q 100 140 80 135" // Left side of mouth
            stroke="#78350F" strokeWidth="3" fill="transparent"
            variants={{ 
              rest: { d: "M 100 120 Q 100 130 80 135" }, // Flat/Neutral
              active: { d: "M 100 120 Q 90 145 70 130" } // Big Smile Curve
            }}
          />
           <motion.path
            d="M 100 120 Q 100 140 120 135" // Right side of mouth
            stroke="#78350F" strokeWidth="3" fill="transparent"
            variants={{ 
              rest: { d: "M 100 120 Q 100 130 120 135" }, // Flat/Neutral
              active: { d: "M 100 120 Q 110 145 130 130" } // Big Smile Curve
            }}
          />

        </svg>
      </motion.div>
    </div>
  );
}