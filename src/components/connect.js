// app/page.js
"use client";

import { useState, useRef, useEffect } from "react";
// 3D Imports
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Float, Stars, RoundedBox } from "@react-three/drei";
// Animation & Utility Imports
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

// --- UTILS ---
function cn(...inputs) { return twMerge(clsx(inputs)); }

// ==========================================
// MAIN PAGE COMPONENT (The Switcher)
// ==========================================
const ft =function LearningPlatform() {
  const [activeTask, setActiveTask] = useState("2d"); // '2d' or '3d'

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation Header */}
      <nav className="p-4 bg-white shadow-sm flex justify-center gap-4 z-50 relative">
        <button
          onClick={() => setActiveTask("2d")}
          className={cn(
            "px-6 py-2 rounded-full font-bold transition-all",
            activeTask === "2d" ? "bg-sky-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          )}
        >
          ١. ربط الكلمات (2D)
        </button>
        <button
          onClick={() => setActiveTask("3d")}
          className={cn(
            "px-6 py-2 rounded-full font-bold transition-all",
            activeTask === "3d" ? "bg-purple-600 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          )}
        >
          ٢. عالم الحروف (3D)
        </button>
      </nav>

      {/* Content Area */}
      <div className="w-full h-[calc(100vh-80px)] relative">
        {activeTask === "2d" ? <ConnectGame2D /> : <MagicBlocks3D />}
      </div>
    </div>
  );
}

// ==========================================
// TASK 1: 2D CONNECTION GAME
// ==========================================
const GAME_DATA = [
  { id: 1, type: "image", content: "/apple1.png", matchId: 1 }, //"🍎"
  { id: 2, type: "image", content:"/car1.png" , matchId: 2 }, // "🚗"
  { id: 3, type: "image", content: "/cat1.png", matchId: 3 },//"🐈"
  { id: 4, type: "text", content: "تفاحة", matchId: 1 },
  { id: 5, type: "text", content: "سيارة", matchId: 2 },
  { id: 6, type: "text", content: "قطة", matchId: 3 },
];

export function ConnectGame2D({ onComplete }) {
  const [leftCol, setLeftCol] = useState([]);
  const [rightCol, setRightCol] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [connections, setConnections] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef(null);
  const itemRefs = useRef(new Map());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setLeftCol(GAME_DATA.filter((i) => i.type === "image").sort(() => Math.random() - 0.5));
    setRightCol(GAME_DATA.filter((i) => i.type === "text").sort(() => Math.random() - 0.5));
  }, []);

  const handleItemClick = (item) => {
    if (isSubmitted) setIsSubmitted(false);
    const existingIdx = connections.findIndex(c => c.start.id === item.id || c.end.id === item.id);
    
    if (existingIdx !== -1) {
      const newConns = [...connections];
      newConns.splice(existingIdx, 1);
      setConnections(newConns);
      if (!selectedItem) { setSelectedItem(item); return; }
    }
    if (selectedItem?.id === item.id) { setSelectedItem(null); return; }
    if (!selectedItem) { setSelectedItem(item); return; }
    if (selectedItem.type === item.type) { setSelectedItem(item); return; }

    setConnections(prev => [...prev, { start: selectedItem, end: item }]);
    setSelectedItem(null);
  };

  const getCoordinates = (itemId) => {
    const el = itemRefs.current.get(itemId);
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };
    const r1 = el.getBoundingClientRect();
    const r2 = container.getBoundingClientRect();
    return { x: r1.left - r2.left + r1.width / 2, y: r1.top - r2.top + r1.height / 2 };
  };

  const allConnected = connections.length === 3;

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-sky-50">
      {/* <h2 className="text-2xl font-bold text-sky-800 mb-6">صل الصورة بالكلمة</h2> */}
      
      <div ref={containerRef} className="relative bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl flex justify-between h-[450px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <AnimatePresence>
            {connections.map((conn) => {
              const start = getCoordinates(conn.start.id);
              const end = getCoordinates(conn.end.id);
              const isCorrect = isSubmitted ? conn.start.matchId === conn.end.matchId : true;
              const color = isSubmitted ? (isCorrect ? "#4ADE80" : "#F87171") : "#60A5FA";

              return (
                <motion.line
                  key={`${conn.start.id}-${conn.end.id}`}
                  x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                  stroke={color} strokeWidth="6" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        <div className="flex flex-col justify-around w-1/3 z-20 gap-3">
          {leftCol.map(item => (
            <GameItem2D key={item.id} item={item} selected={selectedItem} conns={connections} submitted={isSubmitted} onClick={() => handleItemClick(item)} setRef={el => itemRefs.current.set(item.id, el)} />
          ))}
        </div>
        <div className="flex flex-col justify-around w-1/3 z-20 gap-3">
          {rightCol.map(item => (
            <GameItem2D key={item.id} item={item} selected={selectedItem} conns={connections} submitted={isSubmitted} onClick={() => handleItemClick(item)} setRef={el => itemRefs.current.set(item.id, el)} />
          ))}
        </div>
      </div>

      <div className="h-16 mt-6">
        {allConnected && !isSubmitted && (
          <button onClick={() => setIsSubmitted(true)} className="px-8 py-3 bg-green-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition">تحقق من الإجابة ✅</button>
        )
        }
        {isSubmitted && (
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-sky-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition">لعبة جديدة 🔄</button>
        )}
      </div>
    </div>
  );
}

function GameItem2D({ item, selected, conns, submitted, onClick, setRef }) {
  const isSelected = selected?.id === item.id;
  const conn = conns.find(c => c.start.id === item.id || c.end.id === item.id);
  
  let styles = "bg-gray-50 border-gray-200";
  if (isSelected) styles = "border-sky-500 bg-sky-50 ring-4 ring-sky-200 scale-105";
  else if (conn) {
    if (submitted) {
      const isCorrect = conn.start.matchId === conn.end.matchId;
      styles = isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50";
    } else {
      styles = "border-sky-300 bg-sky-50";
    }
  }

  return (
    <div 
    ref={setRef} 
    onClick={onClick} 
    // 2. Added 'relative' and 'overflow-hidden' so the image stays inside the rounded corners
    className={cn("relative overflow-hidden h-24 w-full rounded-2xl flex items-center justify-center text-3xl cursor-pointer shadow-md border-4 transition-all text-black", styles)}
  >
    {item.type === "image" ? (
      <Image 
        src={item.content}       // Fixed typo: was 'scr', now 'src'
        alt="Game Item"          // Required for accessibility
        height={60}                     // Tells image to fill the parent div
        width={60}
        className="object-contain p-2" // Keeps aspect ratio & adds padding so it doesn't touch borders
        // sizes="(max-width: 200px) 100vw, 33vw" // Optimization for performance
      />
    ) : (
      <span className="z-10">{item.content}</span>
    )}
  </div>
  );
}


// ==========================================
// TASK 2: 3D MAGIC BLOCKS (Fixed)
// ==========================================

export function MagicBlocks3D() {
  const [hoveredLetter, setHoveredLetter] = useState(null);

  return (
    <div className="w-full h-full bg-slate-900 relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={["#0f172a"]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <group position={[0, 0, 0]}>
            <InteractiveBlock 
              position={[-2.5, 0, 0]} 
              color="#F87171" 
              letter="أ" 
              label="أرنب (Rabbit)" 
              onHover={setHoveredLetter} 
            />
            <InteractiveBlock 
              position={[0, 0, 0]} 
              color="#60A5FA" 
              letter="ب" 
              label="بطة (Duck)" 
              onHover={setHoveredLetter} 
            />
            <InteractiveBlock 
              position={[2.5, 0, 0]} 
              color="#34D399" 
              letter="ت" 
              label="تفاحة (Apple)" 
              onHover={setHoveredLetter} 
            />
          </group>
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* 2D Overlay */}
      <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
        {/* <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">عالم الحروف ثلاثي الأبعاد</h2> */}
        <p className="text-slate-300 text-lg">حرك المكعبات بالفأرة واضغط عليها</p>
      </div>

      {/* Interaction Feedback */}
      <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none h-16">
        <AnimatePresence mode="wait">
          {hoveredLetter && (
            <motion.div
              key={hoveredLetter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="inline-block bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20"
            >
              <span className="text-4xl font-bold text-white">{hoveredLetter}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Fixed 3D Block Component
function InteractiveBlock({ position, color, letter, label, onHover }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Basic idle rotation
    if (!active && !hovered) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    // Fast spin on click
    if (active) {
       meshRef.current.rotation.y += delta * 10;
    }
  });

  const handleClick = () => {
    setActive(true);
    setTimeout(() => setActive(false), 500);
  };

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 1.5, 1.5]} 
        radius={0.1}           
        smoothness={4}         
        onClick={handleClick}
        onPointerOver={() => { setHover(true); onHover(label); }}
        onPointerOut={() => { setHover(false); onHover(null); }}
        scale={hovered ? 1.2 : 1}
      >
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.1}
          transparent
          opacity={0.9}
        />
        
        <Text
          position={[0, 0, 0.8]} 
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {letter}
        </Text>
        
        {/* Back face text for 3D effect */}
        <Text
          position={[0, 0, -0.8]}
          rotation={[0, Math.PI, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {letter}
        </Text>
      </RoundedBox>
      
      {hovered && (
        <pointLight distance={3} intensity={2} color={color} />
      )}
    </group>
  );
}