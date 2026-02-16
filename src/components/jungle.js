"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) { return twMerge(clsx(inputs)); }

// ==========================================
// 1. DATA CONFIGURATION
// ==========================================

// A. THE QUESTIONS (10 Tasks)
const QUESTIONS = [
  { id: 1, text: "هذا حيوان كبير", targetId: "elephant" },
  { id: 2, text: "هذا حيوان صغير", targetId: "rabbit" },
  { id: 3, text: "هذا حيوان ضَخْم", targetId: "whale" },
  { id: 4, text: "هذا حيوان شجاع", targetId: "lion" },
  { id: 5, text: "هذا حيوان طويل", targetId: "giraffe" },
  { id: 6, text: "هذا حيوان بطيء", targetId: "turtle" },
  { id: 7, text: "هذا حيوان سريع", targetId: "fox" },
  { id: 8, text: "هذا طائر صغير", targetId: "hummingbird" },
  { id: 9, text: "هذا نبات طويل", targetId: "palm" },
  { id: 10, text: "هذا طائر قاتل", targetId: "falcon" },
];

// B. THE SCENE ITEMS (Static SVG Locations)
// Note: 'd' contains dummy paths (circles). You must replace these strings 
// with your actual SVG paths that outline the animals in your jungle_bg.png.
const ANIMALS = [
  { id: "elephant", d: "M 48.00,295.50 C 48.00,295.50 79.50,244.50 159.00,280.50 220.50,243.00 280.50,261.00 399.00,312.00 396.00,490.50 358.50,472.50 358.50,474.00 427.50,600.00 352.50,807.00 310.50,837.00 294.00,853.50 247.50,825.00 247.50,825.00 247.50,825.00 255.00,792.00 255.00,792.00 255.00,792.00 279.00,726.00 279.00,726.00 279.00,726.00 216.00,736.50 178.50,652.50 177.00,667.50 199.50,798.00 199.50,798.00 199.50,798.00 114.00,856.50 114.00,856.50 114.00,856.50 120.00,805.50 120.00,805.50 120.00,805.50 85.50,723.00 85.50,723.00 85.50,723.00 190.50,600.00 190.50,600.00 190.50,600.00 246.00,600.00 246.00,600.00 246.00,600.00 249.00,576.00 249.00,576.00 249.00,576.00 231.00,561.00 231.00,561.00 231.00,561.00 294.00,499.50 265.50,444.00 252.00,408.00 297.00,432.00 288.00,408.00 268.50,403.50 259.50,346.50 219.00,355.50 190.50,355.50 51.00,499.50 51.00,501.00 51.00,502.50 39.00,466.50 39.00,466.50 39.00,466.50 48.00,295.50 48.00,295.50 Z", label: "Elephant" },
  { id: "rabbit", d: "M 170.25,843.00 C 159.75,831.00 160.75,815.75 181.50,810.00 180.75,779.50 205.75,778.00 221.25,793.50 240.25,783.75 271.50,803.00 240.25,824.75 231.00,831.75 234.50,838.00 227.50,841.00 235.75,847.00 241.75,856.75 237.00,871.25 266.75,889.25 258.75,903.75 258.75,903.75 258.75,903.75 237.75,912.25 237.75,912.25 237.75,912.25 184.00,912.00 184.00,912.00 184.00,912.00 164.00,895.25 167.00,886.00 171.75,874.25 163.25,863.75 163.25,863.75 163.25,863.75 164.50,848.00 170.25,843.00 Z", label: "Rabbit" },
  { id: "whale", d: "M 937.00,599.50 C 928.00,627.00 939.50,637.00 959.00,647.50 958.00,652.00 934.50,683.50 934.50,686.00 934.50,688.50 959.00,698.50 961.00,694.50 963.00,690.50 959.00,657.50 971.50,650.50 1025.00,657.00 1035.00,643.50 1033.50,630.50 1014.50,629.00 999.00,615.50 980.50,633.00 973.00,613.00 946.50,618.50 937.00,599.50 Z", label: "Whale" },
  { id: "lion", d: "M 586.00,566.00 C 599.00,566.00 619.00,594.00 648.00,598.00 646.00,579.00 700.00,569.00 702.00,631.00 712.00,641.00 798.00,674.00 686.00,761.00 679.00,767.00 689.00,788.00 687.00,822.00 715.00,867.00 694.00,884.00 654.00,909.00 643.00,912.00 629.00,939.00 629.00,939.00 629.00,939.00 585.00,898.00 575.00,900.00 565.00,902.00 548.00,706.00 555.00,582.00 558.00,571.00 573.00,566.00 586.00,566.00 Z", label: "Lion" },
  { id: "giraffe", d: "M 1076.00,110.00 C 1032.00,110.00 1022.00,175.00 1003.00,203.00 1002.00,210.00 994.00,245.00 1006.00,256.00 1015.00,280.00 1072.00,268.00 1084.00,259.00 1096.00,250.00 1117.00,209.00 1125.00,214.00 1169.00,220.00 1125.00,368.00 1150.00,488.00 1103.00,566.00 1144.00,572.00 1155.00,605.00 1155.00,615.00 1107.00,732.00 1114.00,742.00 1121.00,770.00 1155.00,765.00 1153.00,756.00 1134.00,731.00 1217.00,676.00 1208.00,663.00 1220.00,662.00 1255.00,651.00 1259.00,660.00 1263.00,669.00 1265.00,709.00 1283.00,703.00 1301.00,697.00 1335.00,712.00 1352.00,709.00 1369.00,706.00 1405.00,669.00 1409.00,658.00 1417.00,615.00 1320.00,554.00 1315.00,539.00 1309.00,503.00 1286.00,432.00 1248.00,376.00 1238.00,365.00 1194.00,246.00 1194.00,222.00 1194.00,198.00 1180.00,162.00 1198.00,144.00 1216.00,126.00 1214.00,140.00 1240.00,124.00 1266.00,108.00 1348.00,58.00 1226.00,53.00 1199.00,54.00 1166.00,45.00 1140.00,46.00 1114.00,47.00 1082.00,108.00 1076.00,110.00 Z", label: "Giraffe" },
  { id: "turtle", d: "M 1100.50,838.50 C 1091.00,849.50 1085.00,842.00 1055.00,865.00 1058.50,880.00 1072.50,866.50 1081.00,901.50 1111.00,908.50 1077.50,930.00 1063.50,938.00 1060.50,951.00 1081.50,984.00 1095.50,963.50 1110.50,937.00 1134.50,917.00 1137.00,923.00 1139.50,929.00 1159.00,944.50 1159.00,947.00 1159.00,949.50 1165.00,958.00 1169.00,983.00 1194.00,994.00 1198.00,957.50 1210.50,956.50 1213.00,954.50 1245.00,915.50 1287.00,925.50 1291.00,924.00 1334.00,885.50 1330.00,877.00 1307.50,861.00 1266.50,812.50 1259.50,812.00 1252.50,811.50 1196.00,809.50 1190.00,812.50 1182.50,817.50 1145.50,848.50 1139.00,847.00 1132.50,845.50 1107.00,835.00 1100.50,838.50 Z", label: "Turtle" },
  { id: "fox", d: "M 742.00,682.50 C 750.00,680.00 779.50,685.00 786.00,680.00 796.00,682.00 801.00,667.00 804.50,667.00 816.50,671.00 813.00,677.00 824.50,682.50 805.50,690.50 812.00,711.00 796.00,721.50 792.50,725.00 740.50,722.00 736.00,722.00 732.93,714.76 743.81,697.33 742.00,682.50 Z", label: "Fox" },
  { id: "hummingbird", d: "M 1406.67,107.33 C 1414.67,133.33 1448.00,158.00 1453.00,161.00 1482.00,187.33 1452.67,204.00 1472.00,204.67 1483.33,208.00 1478.67,176.33 1482.67,179.33 1482.00,164.00 1477.67,158.00 1486.67,156.00 1495.67,154.00 1518.00,101.00 1516.00,97.00 1453.33,146.67 1434.00,111.33 1406.67,107.33 Z", label: "Hummingbird" },
  { id: "palm", d: "M 747.33,676.00 C 747.33,676.00 739.33,210.00 739.33,204.00 774.00,224.00 768.00,316.00 780.00,326.00 792.00,336.00 810.67,254.00 771.33,177.33 780.97,173.12 820.00,223.33 818.00,217.33 816.00,211.33 840.00,208.00 840.00,200.00 840.00,192.00 824.00,174.00 824.00,154.00 824.00,134.00 806.00,94.00 784.00,92.00 766.00,71.33 705.33,68.00 690.67,72.00 610.00,77.33 597.33,157.33 597.33,181.33 614.00,264.00 579.33,326.67 642.67,382.67 618.00,274.67 636.67,208.00 674.67,187.33 636.00,260.67 662.67,352.00 692.00,370.00 678.00,284.00 694.00,206.00 702.00,212.00 708.00,220.00 694.00,584.00 694.00,592.00 694.00,600.00 709.33,610.00 702.67,634.00 738.00,648.00 747.33,676.00 747.33,676.00 Z", label: "Palm Tree" },
  { id: "falcon", d: "M 228.00,547.50 C 228.00,547.50 283.50,513.00 255.00,424.50 249.00,408.00 273.00,430.50 273.00,430.50 273.00,430.50 291.00,409.50 265.50,393.00 261.00,379.50 244.50,345.00 204.00,378.00 204.00,453.00 108.00,483.00 127.50,538.50 141.00,582.00 189.00,573.00 189.00,573.00 189.00,573.00 228.00,547.50 228.00,547.50 Z", label: "Falcon" },
];

// ==========================================
// CONFIGURATION
// ==========================================
// 1. DIMENSIONS: MUST MATCH YOUR BACKGROUND IMAGE EXACTLY
const SCENE_WIDTH = 1556; 
const SCENE_HEIGHT = 1032;
const VIEWBOX = `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`;



export default function JungleNeonNight() {
  const [qIndex, setQIndex] = useState(0);
  const [correctIds, setCorrectIds] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  
  const containerRef = useRef(null);

  // NEW STATE: Controls the "Lights On" moment
  const [isCelebrating, setIsCelebrating] = useState(false); 

  useEffect(() => { setIsClient(true); }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

    const handleAnimalClick = (id) => {
        if (correctIds.includes(id) || isCelebrating) return; // Prevent double clicks
        
        const currentQ = QUESTIONS[qIndex];

        if (id === currentQ.targetId) {
        // 1. TRIGGER CELEBRATION
        setIsCelebrating(true);
        setCorrectIds(prev => [...prev, id]);
        
        // 2. WAIT 2 SECONDS (Show the full jungle!)
        setTimeout(() => {
            setIsCelebrating(false); // Lights go back off
            
            // 3. NEXT QUESTION
            if (qIndex < QUESTIONS.length - 1) {
            setQIndex(prev => prev + 1);
            }
        }, 2000);
        } else {
        // WRONG
        setWrongId(id);
        setTimeout(() => setWrongId(null), 1000);
        }
    };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* 1. CONTAINER */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full max-w-7xl shadow-2xl border-4 border-slate-800 rounded-xl overflow-hidden cursor-none"
        style={{ aspectRatio: `${SCENE_WIDTH} / ${SCENE_HEIGHT}` }}
      >
        
        {/* LAYER A: BACKGROUND IMAGE (Visible only through flashlight hole) */}
        <img 
          src="/imgs/jungle_bg.png" 
          alt="Jungle" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* LAYER B: DARKNESS MASK (The Black Curtain) */}
        {/* We place this BELOW the SVG now, but ABOVE the image */}
        <motion.div 
          className="absolute inset-0 bg-black pointer-events-none z-10"
          animate={{
            // IF CELEBRATING: Opacity 0 (Lights On!). ELSE: Opacity 0.96 (Darkness)
            opacity: isCelebrating ? 0 : 0.96,
            maskImage: `radial-gradient(circle 100px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 100px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
          }}
          transition={{ duration: 0.5 }} // Smooth fade in/out of the light
        />

        {/* CELEBRATION TEXT OVERLAY */}
        <AnimatePresence>
          {isCelebrating && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1.5, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="bg-white/90 text-emerald-600 px-12 py-6 rounded-3xl border-4 border-emerald-500 shadow-2xl text-6xl font-black drop-shadow-lg"
              >
                ! ممتاز 🎉
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* LAYER C: SVG INTERACTION LAYER (The Neon Overlay) */}
        {/* Z-INDEX 20: This sits ON TOP of the darkness */}
        <svg 
          viewBox={VIEWBOX} 
          className="absolute inset-0 w-full h-full pointer-events-auto overflow-visible z-20"
          preserveAspectRatio="none"
        >
          {/* Define a strong glow filter */}
          <defs>
             <filter id="neon-glow" height="200%" width="200%" x="-50%" y="-50%">
                {/* Thicker blur for the outer glow */}
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
             </filter>
          </defs>

          {ANIMALS.map((animal) => {
            const isCorrect = correctIds.includes(animal.id);
            const isWrong = wrongId === animal.id;
            // Check if THIS specific animal is the one being celebrated right now
            const isTarget = isCelebrating && animal.id === QUESTIONS[qIndex].targetId;

            return (
              <motion.path
                key={animal.id}
                d={animal.d}
                onClick={() => handleAnimalClick(animal.id)}
                
                // 1. DEFAULT STATE (Invisible)
                initial={{ 
                    fill: "rgba(0,0,0,0)", 
                    stroke: "rgba(0,0,0,0)", 
                    strokeWidth: 0,
                    strokeDasharray: "none"
                }}
                
                // 2. STATUS ANIMATIONS (Right/Wrong)
                animate={
                  isCorrect ? {
                    fill: "rgba(16, 185, 129, 0.2)", // Green tint
                    stroke: "#10B981",
                    strokeWidth: 4,
                    strokeDasharray: "none",
                    filter: "url(#neon-glow)"
                  } : isWrong ? {
                    fill: "rgba(239, 68, 68, 0.2)",  // Red tint
                    stroke: "#EF4444",
                    strokeWidth: 4,
                    strokeDasharray: "none",
                    filter: "url(#neon-glow)"
                  } : {
                    fill: "rgba(0,0,0,0)",
                    stroke: "rgba(0,0,0,0)",
                    strokeWidth: 0,
                    filter: "none"
                  }
                }
                
                // 3. HOVER EFFECT (NEON CYAN GUIDE)
                // This triggers even in the dark because it's z-index 20
                whileHover={!isCorrect && !isWrong ? {
                    // Body: Slightly visible white ghost
                    fill: "rgba(255, 255, 255, 0.15)",
                    
                    // Border: Bright Cyan Neon
                    stroke: "#06b6d4", // Cyan-500
                    strokeWidth: 5,
                    
                    // Glow: Strong drop shadow
                    filter: "drop-shadow(0 0 8px #06b6d4) drop-shadow(0 0 15px #06b6d4)",
                    
                    // Movement: Electric Current
                    strokeDasharray: "20 10", 
                    strokeDashoffset: -100,
                    
                    transition: {
                        strokeDashoffset: { repeat: Infinity, duration: 1.5, ease: "linear" }
                    }
                } : {}}
                
                className="cursor-none transition-colors"
              />
            );
          })}
        </svg>

        {/* LAYER D: FLASHLIGHT RING (Top UI) */}
        <div 
          className="absolute pointer-events-none z-30 w-[100px] h-[100px] border-2 border-white/20 rounded-full shadow-[0_0_100px_rgba(255,255,255,0.1)]"
          style={{ transform: `translate(${mousePos.x - 50}px, ${mousePos.y - 50}px)` }}
        />
        
        {/* E. HUD */}
        <div className="absolute top-6 w-full flex justify-center pointer-events-none z-40">
             <div className="bg-black/70 backdrop-blur-sm text-cyan-300 px-8 py-3 rounded-full border border-cyan-500/30 text-2xl font-bold shadow-2xl">
                {QUESTIONS[qIndex].text}
             </div>
        </div>

      </div>
    </div>
  );
}