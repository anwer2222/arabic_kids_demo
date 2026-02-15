// app/components/InfiniteCharacterGallery.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs) { return twMerge(clsx(inputs)); }

// --- DATA ---
const CHARACTERS = [
  { id: 1, name: "حَسَن", attr: "tall", emoji: "🦒", url:"/hasan.png" },
  { id: 2, name: "طُوْبَى", attr: "short", emoji: "👧", url:"/toba.png" },
  { id: 3, name: "يوسف", attr: "fat", emoji: "🐻" ,url:"/yosif.png"},
  { id: 4, name: "سعد", attr: "thin", emoji: "🦯",url:"/saad.png"},
  { id: 5, name: "كمال", attr: "old", emoji: "👴",url:"/kamal.png" },
  { id: 6, name: "ماري", attr: "athletic_f", emoji: "🤸‍♀️",url:"/maria.png" },
  { id: 7, name: "مراد", attr: "athletic_m", emoji: "🏋️‍♂️" ,url:"/morad.png"},
  { id: 8, name: "سمية", attr: "child_f", emoji: "👶" ,url:"/somia.png"},
  { id: 9, name: "جانيت", attr: "old_f", emoji: "👵",url:"/Janit.png"},
  { id: 10, name: "يوسف", attr: "child_b", emoji: "🐻" ,url:"/yosif1.png"},
];

const TASKS = [
  { id: 1, targetAttr: "thin", text: "ابحث عن الشخص (النحيف)" },
  { id: 2, targetAttr: "tall", text: "أين هو الشخص (الطويل)؟" },
  { id: 3, targetAttr: "fat", text: "من هو الشخص (السمين)؟" },
];

export default function InfiniteCharacterGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const currentTask = TASKS[taskIndex];
  const isFinished = taskIndex >= TASKS.length;

  // --- INFINITE LOOP LOGIC ---
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CHARACTERS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
  };

  const handleCapture = () => {
    if (gameState !== "playing") return;
    const char = CHARACTERS[activeIndex];

    if (char.attr === currentTask.targetAttr) {
      setGameState("success");
      setTimeout(() => {
        if (taskIndex < TASKS.length - 1) {
          setTaskIndex(prev => prev + 1);
          setGameState("playing");
        } else {
          setTaskIndex(prev => prev + 1); // Triggers finish screen
        }
      }, 1500);
    } else {
      setGameState("error");
      setTimeout(() => setGameState("playing"), 1000);
    }
  };

  // --- POSITION MATH ---
  // Calculates where an item should be relative to the center (-2, -1, 0, 1, 2)
  // This handles the "Wrap Around" logic
  const getOffset = (index) => {
    const total = CHARACTERS.length;
    let diff = index - activeIndex;
    
    // Wrap logic: If diff is > 5, it means it's closer via the other side
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    
    return diff;
  };

  if (!isClient) return null;
  if (isFinished) return <div className="h-screen bg-slate-900 text-white flex items-center justify-center text-3xl font-bold">🎉 مبروك! أنهيت المهمة</div>;

  return (
    <div dir="rtl" className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="h-24 bg-white shadow-sm flex flex-col items-center justify-center z-20">
        <div className="text-sm font-bold text-slate-400">المهمة {taskIndex + 1}</div>
        <h1 className="text-2xl font-black text-slate-800">{currentTask.text}</h1>
      </header>

      {/* CAROUSEL AREA */}
      <main className="flex-1 relative flex items-center justify-center bg-slate-200 overflow-hidden">
        
        {/* THE LENS (Static UI Overlay) */}
        <div className="absolute z-30 pointer-events-none flex items-center justify-center">
          <div className={cn(
            "w-72 h-72 rounded-full border-[8px] transition-all duration-300 shadow-2xl",
            gameState === "playing" ? "border-white bg-white/10" :
            gameState === "success" ? "border-emerald-500 bg-emerald-500/20" : "border-red-500 bg-red-500/20"
          )}>
            {/* Crosshairs */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-white/50" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-white/50" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-white/50" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-white/50" />
          </div>
          {/* Status Icon */}
          <div className="absolute z-40 text-6xl">
            {gameState === "success" && "✅"}
            {gameState === "error" && "❌"}
          </div>
        </div>

        {/* THE CARDS (Positioned Absolute) */}
        <div className="relative w-full h-full flex items-center justify-center perspective-1000 z-10">
          {CHARACTERS.map((char, i) => {
            const offset = getOffset(i); // -2, -1, 0, 1, 2
            const isActive = offset === 0;
            
            // We only render items close to center to improve performance
            if (Math.abs(offset) > 3) return null; 

            return (
              <motion.div
                key={char.id}
                className="absolute top-1/2 left-1/2"
                initial={false} // Prevents jump on first render
                animate={{
                  x: offset * 220, // 220px spacing
                  y: "-50%",       // Center vertically
                  // Force Center (Active) logic:
                  left: "50%",     // Relative to container center
                  marginLeft: "-7rem", // Half of card width (w-56 = 14rem)
                  scale: isActive ? 1.3 : 0.85,
                  opacity: isActive ? 1 : 0.4,
                  zIndex: 100 - Math.abs(offset), // Center item on top
                  rotateY: offset * -15 // 3D Rotation effect
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <div className={cn(
                  "w-56 h-80 bg-white rounded-3xl shadow-xl flex flex-col items-center p-4 border-b-8 transition-colors",
                  isActive ? "border-indigo-500 shadow-indigo-200" : "border-slate-300 "
                )}>
                  <Image className="flex-1  bg-slate-50 rounded-2xl flex items-center justify-center text-8xl mb-4 border border-slate-100" src={char.url} alt={char.name} width={70} height={30}/>
                    {/* {char.emoji}
                  </div> */}
                  <h3 className="text-2xl font-bold text-slate-800">{char.name}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* CONTROLS */}
      <footer className="h-28 bg-white z-20 flex items-center justify-center gap-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button onClick={handlePrev} className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 text-3xl font-bold transition">➡️</button>
        
        <button 
          onClick={handleCapture}
          className={cn(
            "h-16 px-10 rounded-full text-xl font-black text-white shadow-lg transition-transform active:scale-95",
            gameState === "playing" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-400"
          )}
        >
          {gameState === "playing" ? "📸 التقاط (Capture)" : "..."}
        </button>

        <button onClick={handleNext} className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 text-3xl font-bold transition">⬅️</button>
      </footer>
    </div>
  );
}