"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) { return twMerge(clsx(inputs)); }

// ==========================================
// 1. DATA: THE JUNGLE SPOTS
// ==========================================
const HIDING_SPOTS = [
  { id: "elephant", emoji: "🐘", type: "correct", top: "20%", left: "15%", size: "text-9xl" },
  { id: "rabbit", emoji: "🐇", type: "wrong", top: "65%", left: "10%", size: "text-6xl" },
  { id: "snake", emoji: "🐍", type: "wrong", top: "80%", left: "40%", size: "text-6xl" },
  { id: "bird", emoji: "🦜", type: "wrong", top: "15%", left: "70%", size: "text-5xl" },
  { id: "monkey", emoji: "🐒", type: "wrong", top: "50%", left: "80%", size: "text-7xl" },
  { id: "tiger", emoji: "🐅", type: "wrong", top: "40%", left: "40%", size: "text-8xl" },
];

const QUESTION = "ابحث عن حيوان كبير (Find the Big Animal)";

export default function PeekABooJungle() {
  const [revealedIds, setRevealedIds] = useState([]); // Track which bushes are cleared
  const [gameState, setGameState] = useState("playing"); // playing, success
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const handleReveal = (item) => {
    if (gameState === "success") return;
    
    // Add to revealed list (prevents clicking again)
    if (!revealedIds.includes(item.id)) {
      setRevealedIds((prev) => [...prev, item.id]);
    }

    // Check Logic
    if (item.type === "correct") {
      setGameState("success");
    }
  };

  if (!isClient) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-emerald-900 relative overflow-hidden font-sans select-none">
      
      {/* --- BACKGROUND --- */}
      {/* A vibrant jungle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-800 to-emerald-950" />
      
      {/* Decorative Vines (CSS shapes) */}
      <div className="absolute top-0 right-10 w-2 h-64 bg-emerald-700 rounded-b-full opacity-60" />
      <div className="absolute top-0 left-20 w-3 h-96 bg-emerald-600 rounded-b-full opacity-60" />

      {/* --- HUD --- */}
      <div className="absolute top-8 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white/90 backdrop-blur border-4 border-emerald-500 px-10 py-4 rounded-3xl shadow-xl text-center"
        >
          <h1 className="text-3xl font-black text-emerald-800 mb-2">{QUESTION}</h1>
          <p className="text-emerald-600 font-bold">
            {gameState === "success" ? "🎉 أحسنت! وجدته!" : "اضغط على الشجيرات للبحث عنه"}
          </p>
        </motion.div>
      </div>

      {/* --- GAME AREA --- */}
      <div className="relative w-full h-screen">
        {HIDING_SPOTS.map((spot) => (
          <HidingSpot 
            key={spot.id} 
            data={spot} 
            isRevealed={revealedIds.includes(spot.id)}
            onReveal={() => handleReveal(spot)}
            gameState={gameState}
          />
        ))}
      </div>

      {/* --- SUCCESS OVERLAY --- */}
      <AnimatePresence>
        {gameState === "success" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-9xl mb-4"
              >
                🐘
              </motion.div>
              <h2 className="text-6xl font-black text-white drop-shadow-lg">ممتاز!</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// COMPONENT: THE INTERACTIVE BUSH
// ==========================================
function HidingSpot({ data, isRevealed, onReveal, gameState }) {
  // Random delay for the idle wind animation so they don't all move in sync
  const randomDelay = Math.random() * 2;

  return (
    <div 
      className="absolute flex items-center justify-center"
      style={{ top: data.top, left: data.left }}
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* 1. THE ANIMAL (Bottom Layer) */}
        <div className={cn("absolute z-0 transition-transform duration-500", isRevealed ? "scale-100" : "scale-50 opacity-0")}>
           <span className={cn("filter drop-shadow-2xl", data.size)}>
             {data.emoji}
           </span>
           {/* Name Label appears only when revealed */}
           {isRevealed && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap"
             >
               {data.id === "elephant" ? "فيل (Elephant)" : "ليس هذا..."}
             </motion.div>
           )}
        </div>

        {/* 2. THE BUSH (Top Layer - Clickable) */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.button
              onClick={onReveal}
              disabled={gameState === "success"}
              
              // ANIMATIONS
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                rotate: [0, 2, -2, 0], // Idle wind sway
              }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }} // "Poof" away animation
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -10, 10, -10, 10, 0], // Shake on hover
                transition: { duration: 0.4 } 
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 4, delay: randomDelay, ease: "easeInOut" } 
              }}
              
              className="absolute z-10 w-48 h-48 flex items-center justify-center cursor-pointer focus:outline-none group"
            >
              {/* SVG BUSH ART */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl text-emerald-500 group-hover:text-emerald-400 transition-colors">
                <path 
                  fill="currentColor" 
                  d="M45,130 C20,130 0,110 0,85 C0,60 20,40 45,40 C50,20 70,0 100,0 C130,0 150,20 155,40 C180,40 200,60 200,85 C200,110 180,130 155,130 L45,130 Z" // Cloud/Bush Shape
                />
                <path fill="rgba(0,0,0,0.1)" d="M45,130 Q100,100 155,130" /> {/* Slight shadow detail */}
              </svg>
              
              {/* "Eyes" inside the bush (Peek effect) */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                 <div className="w-3 h-3 bg-white rounded-full animate-blink" />
                 <div className="w-3 h-3 bg-white rounded-full animate-blink delay-75" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 3. PARTICLE EFFECT (Leaves falling when clicked) */}
        <AnimatePresence>
          {isRevealed && (
            <>
             {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ 
                    opacity: 0, 
                    x: (Math.random() - 0.5) * 200, 
                    y: (Math.random() - 0.5) * 200, 
                    rotate: Math.random() * 360 
                  }}
                  className="absolute w-4 h-4 bg-emerald-600 rounded-tr-xl rounded-bl-xl pointer-events-none z-20"
                />
             ))}
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}


///
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// function cn(...inputs) { return twMerge(clsx(inputs)); }

// // ==========================================
// // 1. DATA CONFIGURATION (The Hidden Animals)
// // ==========================================
// // We position animals absolutely on the screen (top/left percentages).
// const ANIMALS = [
//   { id: "elephant", type: "correct", emoji: "🐘", size: "text-9xl", top: "20%", left: "10%" },
//   { id: "rabbit", type: "wrong", emoji: "🐇", size: "text-5xl", top: "80%", left: "15%" },
//   { id: "lion", type: "wrong", emoji: "🦁", size: "text-7xl", top: "50%", left: "40%" },
//   { id: "bird", type: "wrong", emoji: "🐦", size: "text-4xl", top: "10%", left: "70%" },
//   { id: "palm", type: "wrong", emoji: "🌴", size: "text-9xl", top: "40%", left: "80%" },
//   { id: "turtle", type: "wrong", emoji: "🐢", size: "text-5xl", top: "85%", left: "60%" },
// ];

// const QUESTION = {
//   text: "ابحث عن حيوان كبير",
//   sub: "استخدم الكشاف للعثور عليه!"
// };

// export default function JungleFlashlight() {
//   // Mouse Position State
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [gameState, setGameState] = useState("playing"); // playing, success
//   const [isClient, setIsClient] = useState(false);
  
//   const containerRef = useRef(null);

//   useEffect(() => { setIsClient(true); }, []);

//   // Update flashlight position on mouse move
//   const handleMouseMove = (e) => {
//     if (gameState === "success") return; // Stop moving light on win
//     const rect = containerRef.current.getBoundingClientRect();
//     setMousePos({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//   };

//   const handleAnimalClick = (animal) => {
//     if (gameState !== "playing") return;

//     if (animal.id === "elephant") {
//       setGameState("success");
//     } else {
//       // Optional: Shake effect or "Try Again" sound
//       alert("حاول مرة أخرى! (Try again)");
//     }
//   };

//   if (!isClient) return null;

//   return (
//     <div 
//       ref={containerRef}
//       onMouseMove={handleMouseMove}
//       dir="rtl" 
//       className="relative w-full h-screen bg-slate-900 overflow-hidden cursor-none select-none"
//     >
      
//       {/* --- LAYER 1: THE VIBRANT JUNGLE (Hidden underneath) --- */}
//       <div className="absolute inset-0 bg-gradient-to-b from-emerald-800 to-emerald-950 flex items-center justify-center">
//         {/* Decorative Background Elements */}
//         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
//         {/* THE ANIMALS (Visible Layer) */}
//         {ANIMALS.map((animal) => (
//           <button
//             key={animal.id}
//             onClick={() => handleAnimalClick(animal)}
//             className={cn(
//               "absolute transition-transform hover:scale-110 active:scale-95 cursor-none z-10", 
//               animal.size
//             )}
//             style={{ top: animal.top, left: animal.left }}
//           >
//             {animal.emoji}
//           </button>
//         ))}
//       </div>

//       {/* --- LAYER 2: THE DARKNESS MASK (The Flashlight Effect) --- */}
//       <motion.div 
//         className="absolute inset-0 pointer-events-none z-20 bg-black"
//         animate={{
//           // If playing: Show darkness with a hole. If success: Reveal everything (opacity 0)
//           opacity: gameState === "success" ? 0 : 0.96,
//           // THE MAGIC: CSS Mask cuts a hole at mousePos
//           maskImage: gameState === "success" 
//             ? "none" 
//             : `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
//           WebkitMaskImage: gameState === "success" 
//             ? "none" 
//             : `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
//         }}
//         transition={{ duration: 1.5, ease: "easeInOut" }} // Slow reveal on win
//       />

//       {/* --- LAYER 3: FLASHLIGHT BEAM UI (Follows Mouse) --- */}
//       {gameState === "playing" && (
//         <div 
//           className="absolute pointer-events-none z-30 w-80 h-80 rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform duration-75"
//           style={{
//             transform: `translate(${mousePos.x - 160}px, ${mousePos.y - 160}px)` // Center the 320px circle
//           }}
//         />
//       )}

//       {/* --- LAYER 4: HUD / INSTRUCTIONS --- */}
//       <div className="absolute top-8 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
//         <motion.div 
//           initial={{ y: -50, opacity: 0 }} 
//           animate={{ y: 0, opacity: 1 }} 
//           className="bg-black/60 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-center shadow-2xl"
//         >
//           <h1 className="text-3xl font-black text-white mb-1 drop-shadow-md">
//             {gameState === "success" ? "🎉 أحسنت! وجدته!" : QUESTION.text}
//           </h1>
//           <p className="text-emerald-300 font-bold text-sm">
//             {gameState === "success" ? "الفيل هو الحيوان الكبير" : QUESTION.sub}
//           </p>
//         </motion.div>
//       </div>

//       {/* --- LAYER 5: VICTORY PARTICLES (Optional) --- */}
//       <AnimatePresence>
//         {gameState === "success" && (
//           <motion.div 
//             initial={{ opacity: 0 }} 
//             animate={{ opacity: 1 }} 
//             className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
//           >
//             <div className="text-9xl animate-bounce">🎊</div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }