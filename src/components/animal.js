"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs) { return twMerge(clsx(inputs)); }

// ==========================================
// 1. ASSET CONFIGURATION
// ==========================================

// A. THE STATIC MAP (Bushes stay in place)
// Replace 'src' with your specific bush PNGs (e.g., "/assets/bush_small.png")
const HIDING_SPOTS = [
  { id: "spot1", top: "60%", left: "10%", width: "w-48", height: "h-40", bushSrc: "/images/bush1.png" },
  { id: "spot2", top: "50%", left: "35%", width: "w-56", height: "h-48", bushSrc: "/images/bush2.png" },
  { id: "spot3", top: "75%", left: "50%", width: "w-64", height: "h-52", bushSrc: "/images/bush3.png" },
  { id: "spot4", top: "45%", left: "70%", width: "w-40", height: "h-40", bushSrc: "/images/bush4.png" },
  { id: "spot5", top: "20%", left: "20%", width: "w-48", height: "h-48", bushSrc: "/images/bush5.png" },
  { id: "spot6", top: "20%", left: "55%", width: "w-52", height: "h-44", bushSrc: "/images/bush6.png" },
  { id: "spot7", top: "80%", left: "80%", width: "w-48", height: "h-40", bushSrc: "/images/bush5.png" },
  { id: "spot8", top: "30%", left: "85%", width: "w-44", height: "h-44", bushSrc: "/images/bush2.png" },
  { id: "spot9", top: "75%", left: "25%", width: "w-40", height: "h-40", bushSrc: "/images/bush5.png" },
  { id: "spot10", top: "65%", left: "65%", width: "w-50", height: "h-50", bushSrc: "/images/bush1.png" },
];

// B. THE ANIMALS (These will be shuffled)
const ANIMALS = [
  { id: "elephant", name: "Elephant", src: "/images/elephant.png" },
  { id: "lion", name: "Lion", src: "/images/lion.png" },
  { id: "turtle", name: "Turtule", src: "/images/turtole.png" },
  { id: "giraffe", name: "Giraffe", src: "/images/giraffe.png" },
  { id: "fox", name: "Fox", src: "/images/fox.png" },
  { id: "whale", name: "Whale", src: "/images/whale.png" },
  { id: "hummingbird", name: "Bird", src: "/images/bird.png" },
  { id: "rabbit", name: "robbit", src: "/images/robbit.png" },
  { id: "palm", name: "Palm", src: "/images/palm.png" },
  { id: "falcon", name: "Falcon", src: "/images/falcon.png" },
];

// C. THE QUESTIONS

const QUESTIONS = [
  { 
    id: 1, 
    text: "هذا حيوان كبير", 
    targetId: "elephant" 
  },
  { 
    id: 2, 
    text: "هذا حيوان صغير", 
    targetId: "rabbit" 
  },
  { 
    id: 3, 
    text: "هذا حيوان ضَخْم", 
    targetId: "whale" 
  },
  { 
    id: 4, 
    text: "هذا حيوان شجاع", 
    targetId: "lion" 
  },
  { 
    id: 5, 
    text: "هذا حيوان طويل", 
    targetId: "giraffe" 
  },
  { 
    id: 6, 
    text: "هذا حيوان بطيء", 
    targetId: "turtle" 
  },
  { 
    id: 7, 
    text: "هذا حيوان سريع", 
    targetId: "fox" 
  },
  { 
    id: 8, 
    text: "هذا طائر صغير", 
    targetId: "hummingbird" 
  },
  { 
    id: 9, 
    text: "هذا نبات طويل", 
    targetId: "palm" 
  },
  { 
    id: 10, 
    text: "هذا طائر قاتل", 
    targetId: "falcon" 
  }
];

// ==========================================
// 2. HELPER: SHUFFLE ALGORITHM
// ==========================================
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function SafariAdventure1() {
  // Game State
  const [qIndex, setQIndex] = useState(0);       // Which question are we on?
  const [gameMap, setGameMap] = useState([]);    // Stores { bushId, animal } pairs
  const [revealedBushes, setRevealedBushes] = useState([]); // Bushes that have been clicked
  const [gameState, setGameState] = useState("loading"); // loading, playing, success, finished
  
  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setGameState("loading");
    setQIndex(0);
    setRevealedBushes([]);
    
    // 1. Shuffle Animals
    const shuffledAnimals = shuffleArray(ANIMALS);
    
    // 2. Map Animals to Spots (1-to-1 mapping)
    const newMap = HIDING_SPOTS.map((spot, index) => ({
      spotId: spot.id,
      ...spot, // Copy coordinates
      hiddenAnimal: shuffledAnimals[index] || null // Assign animal if available
    }));

    setGameMap(newMap);
    setGameState("playing");
  };

  const handleBushClick = (spotId, animal) => {
    if (gameState !== "playing") return;
    if (revealedBushes.includes(spotId)) return;

    // Reveal the bush
    setRevealedBushes(prev => [...prev, spotId]);

    // Check if it's the target
    const currentQ = QUESTIONS[qIndex];
    
    if (animal && animal.id === currentQ.targetId) {
      // CORRECT!
      setGameState("success");
    } else {
      // WRONG - Optional: You could play a "try again" sound here
      console.log("Not the target...");
    }
  };

  const nextQuestion = () => {
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(prev => prev + 1);
      setGameState("playing");
      // Optional: Close all bushes again? 
      // setRevealedBushes([]); 
      // Usually better to keep them open or shuffle again. 
      // Let's keep them open to make subsequent questions easier (memory game style)
    } else {
      setGameState("finished");
    }
  };

  if (gameState === "loading") return <div className="h-screen bg-emerald-900" />;

  const currentQ = QUESTIONS[qIndex];

  return (
    <div className="relative w-full h-screen bg-emerald-900 overflow-hidden font-sans select-none">
      
      {/* 1. JUNGLE BACKGROUND */}
      <div className="absolute inset-0">
        <Image 
            src="/images/jungle_bg.png" // Your BG
            alt="Jungle"
            fill
            className="object-cover opacity-80"
            priority
        />
      </div>

      {/* 2. HUD (Question Board) */}
      {gameState !== "finished" && (
        <div className="absolute top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <motion.div 
            key={currentQ.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md border-4 border-emerald-600 px-12 py-6 rounded-3xl shadow-2xl text-center max-w-2xl"
          >
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">
              المهمة {qIndex + 1} / {QUESTIONS.length}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-emerald-900">
              {gameState === "success" ? `Great Job! You found the ${currentQ.targetId}!` : currentQ.text}
            </h1>
            
            {/* NEXT BUTTON (Appears on Success) */}
            <AnimatePresence>
                {gameState === "success" && (
                    <motion.button
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        onClick={nextQuestion}
                        className="mt-4 pointer-events-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-full font-bold text-xl shadow-lg animate-bounce"
                    >
                        Next Question ➡️
                    </motion.button>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* 3. GAME AREA (Spots) */}
      {gameMap.map((item) => (
        <GameSpot 
          key={item.spotId} 
          data={item} 
          isRevealed={revealedBushes.includes(item.spotId)}
          onReveal={() => handleBushClick(item.spotId, item.hiddenAnimal)}
          isTarget={gameState === "success" && item.hiddenAnimal?.id === currentQ.targetId}
        />
      ))}

      {/* 4. GAME OVER SCREEN */}
      {gameState === "finished" && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-3xl text-center shadow-2xl border-8 border-emerald-500"
          >
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-5xl font-black text-emerald-900 mb-6">Safari Complete!</h1>
            <button 
              onClick={startNewGame}
              className="bg-emerald-600 text-white px-10 py-4 rounded-full text-2xl font-bold hover:bg-emerald-700 transition shadow-lg"
            >
              Play Again 🔄
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: The Spot (Bush + Animal)
// ==========================================
function GameSpot1({ data, isRevealed, onReveal, isTarget }) {
  // Randomize wind sway delay so bushes don't move in sync
  const swayDelay = Math.random() * 2;

  return (
    <div 
      className={cn("absolute flex items-end justify-center", data.width, data.height)}
      style={{ top: data.top, left: data.left }}
    >
      
      {/* LAYER A: THE ANIMAL (Bottom) */}
      {/* It sits absolutely at the bottom center of the container */}
      {data.hiddenAnimal && (
        <div className="absolute bottom-0 z-0 w-32 h-32 flex items-center justify-center">
            {/* Replace this div with <Image /> for real PNGs */}
            <Image src={data.hiddenAnimal.src} width={100} height={100} className="object-contain" alt={data.hiddenAnimal.name} />
            
            {/* Using text for demo purposes, but Image logic is ready above */}
            {/* <div className={cn(
                "text-6xl transition-all duration-500", 
                isRevealed ? "scale-100 opacity-100" : "scale-50 opacity-0",
                isTarget && "animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
            )}> */}
                {/* Fallback to emoji if no src, or use your Image component here */}
                {/* For real implementation: <Image src={data.hiddenAnimal.src} alt={data.hiddenAnimal.name} fill className="object-contain" /> */}
                {/*<div className="text-center">
                    <div>🦁</div>  Placeholder Emoji 
                    {isRevealed && <div className="text-xs font-bold bg-white/80 px-2 rounded mt-1">{data.hiddenAnimal.name}</div>}
                </div>*/}
                {/* <Image src={data.hiddenAnimal.src} alt={data.hiddenAnimal.name} fill className="object-contain" />  */}
            {/* </div> */}
        </div>
      )}

      {/* LAYER B: THE BUSH (Top / Cover) */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            onClick={onReveal}
            
            // Initial Wind Sway
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: swayDelay, ease: "easeInOut" }}
            
            // Hover Shake Effect
            whileHover={{ 
              scale: 1.05, 
              rotate: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.4 } 
            }}
            
            // Click Disappear Animation
            exit={{ scale: 0, opacity: 0, y: 50, rotate: 10 }}
            
            className="absolute z-10 w-full h-full cursor-pointer origin-bottom"
          >
             {/* Replace with your Bush PNG */}
             <Image src={data.bushSrc} fill className="object-contain drop-shadow-xl" alt="bushe" />
             
             {/* Vector Bush Placeholder */}
             {/* <svg viewBox="0 0 200 160" className="w-full h-full text-emerald-600 drop-shadow-xl">
               <path fill="currentColor" d="M20,160 Q0,100 40,80 Q20,20 80,40 Q100,0 140,40 Q190,20 180,90 Q200,120 180,160 Z" />
               <path fill="rgba(0,0,0,0.1)" d="M40,160 Q30,120 60,100" />
             </svg> */}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Particle Leaves Effect on Reveal */}
      <AnimatePresence>
        {isRevealed && (
            <>
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0 }}
                    animate={{ 
                        opacity: 0, 
                        x: (Math.random() - 0.5) * 150, 
                        y: (Math.random()) * -100,
                        rotate: Math.random() * 360
                    }}
                    transition={{ duration: 0.8 }}
                    className="absolute z-20 w-3 h-3 bg-emerald-500 rounded-tr-lg"
                />
            ))}
            </>
        )}
      </AnimatePresence>
      
    </div>
  );
}

export default function SafariAdventure() {
  const [qIndex, setQIndex] = useState(0);
  const [gameMap, setGameMap] = useState([]);
  
  // State 1: Tracks which bushes are currently invisible
  const [revealedBushes, setRevealedBushes] = useState([]); 
  
  // State 2: Prevents clicking while "Wrong Answer" animation plays
  const [isLocked, setIsLocked] = useState(false); 
  
  const [gameState, setGameState] = useState("loading");

  useEffect(() => { startNewGame(); }, []);

  // ... (Keep startNewGame and shuffle logic same as before) ...
  const startNewGame = () => {
    setGameState("loading");
    setQIndex(0);
    setRevealedBushes([]);
    
    // 1. Shuffle Animals
    const shuffledAnimals = shuffleArray(ANIMALS);
    
    // 2. Map Animals to Spots (1-to-1 mapping)
    const newMap = HIDING_SPOTS.map((spot, index) => ({
      spotId: spot.id,
      ...spot, // Copy coordinates
      hiddenAnimal: shuffledAnimals[index] || null // Assign animal if available
    }));

    setGameMap(newMap);
    setGameState("playing");
  };

  // ==========================================
  // THE FIXED HANDLER
  // ==========================================
  const handleBushClick = (spotId, animal) => {
    // 1. Stop if game is over, board is locked, or bush is already open
    if (gameState !== "playing" || isLocked || revealedBushes.includes(spotId)) return;

    // 2. Reveal the bush immediately (So user sees the animal)
    setRevealedBushes((prev) => [...prev, spotId]);

    const currentQ = QUESTIONS[qIndex];
    const isCorrect = animal && animal.id === currentQ.targetId;

    if (isCorrect) {
      // SCENARIO A: RIGHT SELECTION
      // Keep it revealed. Change game state to success.
      setGameState("success");
      // Optional: Play Success Sound
    } else {
      // SCENARIO B: WRONG SELECTION (The "Peek" Logic)
      
      // Lock the board so they can't spam click
      setIsLocked(true);

      // Wait 1.5 seconds, then hide the animal again (Bush grows back)
      setTimeout(() => {
        setRevealedBushes((prev) => prev.filter((id) => id !== spotId));
        setIsLocked(false); // Unlock the board
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(prev => prev + 1);
      setGameState("playing");
      // Optional: Close all bushes again? 
      // setRevealedBushes([]); 
      // Usually better to keep them open or shuffle again. 
      // Let's keep them open to make subsequent questions easier (memory game style)
    } else {
      setGameState("finished");
    }
  };

  if (gameState === "loading") return <div className="h-screen bg-emerald-900" />;

  const currentQ = QUESTIONS[qIndex];

  return (
    // ... Container ...

    <div className="relative w-full h-screen bg-emerald-900 overflow-hidden font-sans select-none">
      
      {/* 1. JUNGLE BACKGROUND */}
      <div className="absolute inset-0">
        <Image 
            src="/images/jungle_bg.png" // Your BG
            alt="Jungle"
            fill
            className="object-cover opacity-80"
            priority
        />
      </div>

      {/* 2. HUD (Question Board) */}
      {gameState !== "finished" && (
        <div className="absolute top-2 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <motion.div 
            key={currentQ.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md border-4 border-emerald-600 px-12 py-2 rounded-3xl shadow-2xl text-center max-w-2xl"
          >
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">
              المهمة {qIndex + 1} / {QUESTIONS.length}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-emerald-900">
              {gameState === "success" ? `عمل رائع لقد وجدته` : currentQ.text}
            </h1>
            
            {/* NEXT BUTTON (Appears on Success) */}
            <AnimatePresence>
                {gameState === "success" && (
                    <motion.button
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        onClick={nextQuestion}
                        className="mt-4 pointer-events-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-full font-bold text-xl shadow-lg animate-bounce"
                    >
                        الأسئلة التالية ➡️
                    </motion.button>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
      {/* Pass the new props to GameSpot:
         - isLocked: to disable hover effects when busy
         - isWrong: to show a red X if needed
      */}
      {gameMap.map((item) => (
        <GameSpot 
          key={item.spotId} 
          data={item} 
          isRevealed={revealedBushes.includes(item.spotId)}
          onReveal={() => handleBushClick(item.spotId, item.hiddenAnimal)}
          isTarget={gameState === "success" && item.hiddenAnimal?.id === QUESTIONS[qIndex].targetId}
          isLocked={isLocked} // Pass this down
        />
      ))}
    </div>
  );
}


// ==========================================
// UPDATED COMPONENT: GameSpot (With Peeking)
// ==========================================
function GameSpot({ data, isRevealed, onReveal, isTarget, isLocked }) {
  return (
    <motion.div 
      className={cn("absolute flex items-end justify-center", data.width, data.height)}
      style={{ top: data.top, left: data.left }}
      initial="idle"
      whileHover={!isRevealed && !isLocked ? "peek" : "idle"} // Trigger peek only if hidden & unlocked
      animate={isRevealed ? "revealed" : "idle"}
    >
      
      {/* LAYER A: THE ANIMAL (Bottom) */}
      {/* This layer handles the "Peeking" movement */}
      <motion.div 
        className="absolute bottom-0 z-0 w-full h-full flex items-center justify-center pointer-events-none"
        variants={{
          idle: { y: 0, rotate: 0 },
          peek: { 
            y: -50, // Move UP to show head
            rotate: [0, -5, 5, -5, 0], // Wiggle ears
            transition: { 
              y: { duration: 0.3, ease: "easeOut" },
              rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
            }
          },
          revealed: { y: -20, scale: 1.2, rotate: 0 } // Move up and stay there when revealed
        }}
      >
         <div className={cn(
            "text-6xl transition-opacity duration-300",
            // If revealed: fully visible. If hiding: visible (so we can peek) but sitting behind bush
            isRevealed ? "opacity-100" : "opacity-100" 
         )}>
            {/* 1. THE ANIMAL IMAGE 
               Ideally use <Image /> here. 
               For the "Peek" to work, the image needs to be tall enough 
               that the head clears the bush when moved up.
            */}
            {data.hiddenAnimal ? (
               <Image src={data.hiddenAnimal.src} alt="animal" width={100} height={100} className="object-contain" />
              //  <span>{/* Placeholder Emoji for Demo */}🦁</span>
            ) : null}
            
            {/* WRONG ANSWER FEEDBACK */}
            {isRevealed && !isTarget && (
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                 className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap"
               >
                 Try again!
               </motion.div>
            )}
         </div>
      </motion.div>

      {/* LAYER B: THE BUSH (Top / Cover) */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.button
            onClick={onReveal}
            disabled={isLocked}
            
            // Exit: Disappear
            exit={{ scale: 0, opacity: 0, rotate: 10 }}
            
            // Enter: Grow back
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            
            // Hover: Only shake slightly (The main action is the animal peeking now)
            whileHover={!isLocked ? { scale: 1.05 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            
            className={cn(
              "absolute z-10 w-full h-full focus:outline-none origin-bottom",
              isLocked ? "cursor-not-allowed grayscale-[0.5]" : "cursor-pointer"
            )}
          >
             {/* Replace with your Bush PNG */}
             <Image src={data.bushSrc} fill className="object-contain drop-shadow-xl" alt="bush" />
             {/* <svg viewBox="0 0 200 160" className="w-full h-full text-emerald-600 drop-shadow-xl">
               <path fill="currentColor" d="M20,160 Q0,100 40,80 Q20,20 80,40 Q100,0 140,40 Q190,20 180,90 Q200,120 180,160 Z" />
               <path fill="rgba(0,0,0,0.1)" d="M40,160 Q30,120 60,100" />
             </svg> */}
          </motion.button>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}