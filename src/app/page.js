"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {ConnectGame2D, MagicBlocks3D} from "../components/connect"
import InfiniteCharacterGallery from "../components/charcter"
import SafariAdventure from "../components/animal"
import PassportScannerGame from "../components/passport"

// ==========================================
// CONFIGURATION
// ==========================================
// 1. The Aspect Ratio of your SVG (Width / Height)
// 2432 / 1760 = ~1.38
const VIEWBOX = "0 0 2784 1536"; 

// 2. Your Path Data (Copied exactly from your prompt)
// const car = "M 1266.00,917.00 C 1266.00,917.00 1337.00,907.00 1337.00,907.00 1337.00,907.00 1382.00,923.00 1382.00,923.00 1382.00,923.00 1404.00,948.00 1404.00,948.00 1404.00,948.00 1417.00,952.00 1417.00,952.00 1417.00,952.00 1435.00,965.00 1435.00,965.00 1435.00,965.00 1439.00,987.00 1439.00,987.00 1439.00,987.00 1443.00,1003.00 1443.00,1003.00 1443.00,1003.00 1425.00,1015.00 1425.00,1015.00 1425.00,1015.00 1414.00,1038.00 1414.00,1038.00 1414.00,1038.00 1393.00,1045.00 1393.00,1045.00 1393.00,1045.00 1328.00,1058.00 1328.00,1058.00 1328.00,1058.00 1241.00,1076.00 1241.00,1076.00 1241.00,1076.00 1208.00,1075.00 1208.00,1075.00 1208.00,1075.00 1179.00,1063.00 1179.00,1063.00 1179.00,1063.00 1162.00,1048.00 1162.00,1048.00 1162.00,1048.00 1159.00,1036.00 1159.00,1036.00 1159.00,1036.00 1175.00,1028.00 1175.00,1028.00 1175.00,1028.00 1174.00,1008.00 1174.00,1008.00 1174.00,1008.00 1181.00,987.00 1181.00,987.00 1181.00,987.00 1192.00,974.00 1192.00,974.00 1192.00,974.00 1239.00,956.00 1239.00,956.00 1239.00,956.00 1266.00,917.00 1266.00,917.00 Z";
// const book = "M 1572.00,1240.00 C 1572.00,1240.00 1364.00,1120.00 1364.00,1120.00 1364.00,1120.00 1388.00,1094.00 1388.00,1094.00 1388.00,1094.00 1468.00,1060.00 1468.00,1060.00 1468.00,1060.00 1513.33,1048.00 1513.33,1048.00 1513.33,1048.00 1566.67,1050.00 1566.67,1050.00 1566.67,1050.00 1600.67,1023.33 1600.67,1023.33 1600.67,1023.33 1639.33,1012.67 1639.33,1012.67 1639.33,1012.67 1678.67,1008.00 1678.67,1008.00 1678.67,1008.00 1720.00,1006.67 1720.00,1006.67 1720.00,1006.67 1801.33,1037.33 1801.33,1037.33 1801.33,1037.33 1914.67,1084.00 1914.67,1084.00 1914.67,1084.00 1923.33,1093.33 1923.33,1093.33 1923.33,1093.33 1936.67,1098.00 1936.67,1098.00 1936.67,1098.00 1922.67,1111.33 1922.67,1111.33 1922.67,1111.33 1904.67,1117.33 1904.67,1117.33 1904.67,1117.33 1885.33,1126.67 1885.33,1126.67 1885.33,1126.67 1848.00,1140.00 1848.00,1140.00 1848.00,1140.00 1804.00,1156.00 1804.00,1156.00 1804.00,1156.00 1736.00,1181.33 1736.00,1181.33 1736.00,1181.33 1656.00,1210.00 1656.00,1210.00 1656.00,1210.00 1572.00,1240.00 1572.00,1240.00 Z"
// const box="M 1689.00,982.50 C 1689.00,982.50 1566.00,1028.67 1566.00,1028.67 1566.00,1028.67 1546.67,1020.00 1546.67,1020.00 1546.67,1020.00 1539.00,993.00 1539.00,993.00 1539.00,993.00 1559.33,980.00 1559.33,980.00 1559.33,980.00 1560.67,932.00 1560.67,932.00 1560.67,932.00 1578.00,922.67 1578.00,922.67 1578.00,922.67 1578.00,876.00 1578.00,876.00 1578.00,876.00 1572.00,868.67 1572.00,868.67 1572.00,868.67 1570.67,834.67 1570.67,834.67 1570.67,834.67 1561.33,830.67 1561.33,830.67 1561.33,830.67 1605.33,781.33 1605.33,781.33 1605.33,781.33 1644.00,774.67 1644.00,774.67 1644.00,774.67 1686.00,828.67 1686.00,828.67 1686.00,828.67 1678.67,836.00 1678.67,836.00 1678.67,836.00 1678.67,870.67 1678.67,870.67 1678.67,870.67 1669.33,880.00 1669.33,880.00 1669.33,880.00 1669.33,922.67 1669.33,922.67 1669.33,922.67 1689.33,928.67 1689.33,928.67 1689.33,928.67 1689.00,982.50 1689.00,982.50 Z"
// const card_box="M 778.50,1104.00 C 778.50,1104.00 720.00,1114.50 720.00,1114.50 720.00,1114.50 537.00,1050.00 537.00,1050.00 537.00,1050.00 634.50,1020.00 634.50,1021.50 634.50,1023.00 636.00,996.00 636.00,996.00 636.00,996.00 580.50,912.00 580.50,912.00 580.50,912.00 595.50,873.00 595.50,873.00 595.50,873.00 804.00,829.50 804.00,829.50 804.00,829.50 861.00,907.50 861.00,907.50 861.00,907.50 853.50,942.00 853.50,942.00 853.50,942.00 970.50,978.00 970.50,978.00 970.50,978.00 972.00,1033.50 972.00,1033.50 972.00,1033.50 778.50,1104.00 778.50,1104.00 Z"
// const card="M 964.50,1177.50 C 964.50,1177.50 873.00,1144.50 873.00,1144.50 873.00,1144.50 868.50,1135.50 868.50,1135.50 868.50,1135.50 897.00,1119.00 897.00,1119.00 897.00,1119.00 894.00,1089.00 894.00,1089.00 894.00,1089.00 1026.00,1036.50 1026.00,1036.50 1026.00,1036.50 1114.50,1066.50 1114.50,1066.50 1114.50,1066.50 1116.00,1108.50 1116.00,1108.50 1116.00,1108.50 964.50,1177.50 964.50,1177.50 Z"
const sheet = "M 184.50,1162.50 C 184.50,1162.50 502.50,1362.00 502.50,1362.00 502.50,1362.00 928.50,1083.00 928.50,1083.00 928.50,1083.00 594.00,882.00 594.00,882.00 594.00,882.00 184.50,1162.50 184.50,1162.50 Z"
const card2="M 916.50,1230.00 C 916.50,1230.00 922.50,1299.00 922.50,1299.00 922.50,1299.00 1149.00,1369.50 1149.00,1369.50 1149.00,1369.50 1344.00,1167.00 1344.00,1167.00 1344.00,1167.00 1336.50,1092.00 1336.50,1092.00 1336.50,1092.00 1138.50,1044.00 1138.50,1044.00 1138.50,1044.00 916.50,1230.00 916.50,1230.00 Z"
const passport ="M 1358.67,1300.67 C 1358.67,1300.67 1464.00,1327.50 1464.00,1327.50 1464.00,1327.50 1465.33,1345.33 1465.33,1345.33 1465.33,1345.33 1702.50,1480.50 1702.50,1480.50 1702.50,1480.50 1726.67,1479.33 1726.67,1479.33 1726.67,1479.33 1927.33,1265.33 1927.33,1265.33 1927.33,1265.33 1929.00,1203.00 1929.00,1203.00 1929.00,1203.00 1786.00,1138.00 1786.00,1138.00 1786.00,1138.00 1798.00,1110.00 1798.00,1110.00 1798.00,1110.00 1796.67,1092.67 1796.67,1092.67 1796.67,1092.67 1543.50,1042.50 1543.50,1042.50 1543.50,1042.50 1358.67,1300.67 1358.67,1300.67 Z"
const box2="M 1928.00,1154.00 C 1928.00,1154.00 1922.00,1326.00 1922.00,1326.00 1922.00,1326.00 2159.00,1535.00 2159.00,1535.00 2159.00,1535.00 2331.00,1537.00 2331.00,1537.00 2331.00,1537.00 2580.00,1386.00 2580.00,1386.00 2580.00,1386.00 2603.00,1207.00 2603.00,1207.00 2603.00,1207.00 2269.00,1006.00 2269.00,1006.00 2269.00,1006.00 1928.00,1154.00 1928.00,1154.00 Z"
const pen="M 458.33,720.67 C 458.33,720.67 265.00,773.33 261.67,765.67 220.00,731.00 244.00,708.33 245.33,707.67 278.00,686.33 450.00,670.00 450.00,670.00 450.00,670.00 464.33,671.33 464.33,671.33 464.33,671.33 469.33,674.33 470.33,677.33 496.33,667.67 509.00,692.67 475.00,704.00 475.00,704.00 471.67,713.33 471.67,713.33 471.67,713.33 458.33,720.67 458.33,720.67 Z"

const SCENE_OBJECTS = [
  { 
    id: "sheet", 
    label: "صل الصورة بالكلمة", 
    d: sheet, 
    type: "sheet",
    taskComponent: ConnectGame2D 
  },
  { 
    id: "box", 
    label: "البحث والاستكشاف", 
    d: box2,
    type: "box",
    taskComponent: SafariAdventure 
  },
  { 
    id: "pen", 
    label: "عالم الحروف ثلاثي الأبعاد", 
    d: pen,
    type: "pen",
    taskComponent: MagicBlocks3D 
  },
  { 
    id: "passport", 
    label: "فحص الجوازات", 
    d: passport,
    type: "passport",
    taskComponent: PassportScannerGame 
  },
  { 
    id: "card", 
    label: "ابحث عن الشخص", 
    d: card2,
    type: "card",
    taskComponent: InfiniteCharacterGallery 
  },
];

function cn(...inputs) { return twMerge(clsx(inputs)); }

// ==========================================
// 1. SCENE CONFIGURATION
// ==========================================

// // Viewbox must match your SVG coordinate system
// const VIEWBOX = "0 0 2432 1760";
const BG_IMAGE = "/yellow_tabel.png"//"/boy_Image9.png"; 

export default function InteractiveSVGScene() {
  const [activeTask, setActiveTask] = useState(null); // The object currently being interacted with
  const [completedIds, setCompletedIds] = useState([]); // List of completed IDs
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  // --- LOGIC: HANDLE COMPLETION ---
  const handleTaskComplete = () => {
    if (activeTask && !completedIds.includes(activeTask.id)) {
      setCompletedIds([...completedIds, activeTask.id]);
    }
    // Close modal
    setActiveTask(null);
  };

  // Calculate Progress
  const progress = Math.round((completedIds.length / SCENE_OBJECTS.length) * 100);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* HEADER HUD */}
      <div className=" absolute w-full max-w-xl mb-4 flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg text-white z-30 top-5">
          <p> </p>
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-xl font-bold">مكتب تفاعلي</h1>
          <p className="text-slate-400 text-sm">انقر على الأشياء المتوهجة لإكمال المهام</p>
        </div>
        <div className="flex items-center gap-4">
          
          {/* Progress Bar */}
          <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden" dir="rtl">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-right flex gap-5">
            <div className="text-xl font-bold text-emerald-400">{progress}%</div>
            <div className="text-xl font-bold text-slate-400 uppercase">التقدم</div>
          </div>
        </div>
      </div>

      {/* MAIN SCENE CONTAINER */}
      <div className="relative w-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700">
        
        {/* 1. BACKGROUND IMAGE */}
        <img src={BG_IMAGE} alt="Scene" className="w-full h-auto block pointer-events-none opacity-80" />

        {/* 2. SVG OVERLAY LAYER */}
        <svg 
          viewBox={VIEWBOX} 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {SCENE_OBJECTS.map((obj) => {
            const isCompleted = completedIds.includes(obj.id);
            
            return (
              <motion.path
                key={obj.id}
                d={obj.d}
                onClick={() => setActiveTask(obj)}
                
                // Initial State
                fill="transparent"
                stroke={isCompleted ? "#10B981" : "transparent"} 
                strokeWidth="5"
                
                // Interaction Styles
                className={cn(
                  "transition-all duration-300 cursor-pointer focus:outline-none",
                  isCompleted ? "cursor-default" : "hover:cursor-pointer"
                )}
                
                // Animations
                whileHover={!isCompleted ? { 
                  fill: "rgba(255, 255, 255, 0.15)", 
                  stroke: "white", 
                  strokeWidth: 3 
                } : {}}
                whileTap={!isCompleted ? { scale: 0.99 } : {}}
                
                // Optional: Tooltip logic can be added here
              />
            );
          })}
        </svg>

        {/* 3. TASK MODAL */}
        <AnimatePresence>
          {activeTask && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-slate-100 p-4 border-b flex justify-between items-center">
                  <p> </p>
                  <h2 className="font-bold text-lg text-slate-800 ">{activeTask.label}</h2>
                  <button onClick={() => setActiveTask(null)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-500 font-bold transition text-gray-400">✕</button>
                </div>

                {/* Game Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                   <activeTask.taskComponent onComplete={handleTaskComplete} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// ==========================================
// MOCK TASK COMPONENTS
// (Replace these with your full games from previous demos)
// ==========================================

function MiniMatchingGame({ onComplete }) {
  const [matched, setMatched] = useState(false);
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="text-4xl">📧 ↔️ 📩</div>
      <h3 className="text-2xl font-bold text-slate-800">Check Your Emails</h3>
      <p className="text-slate-600">Connect the sender to the correct subject line.</p>
      
      {!matched ? (
        <button 
          onClick={() => setMatched(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Simulate Game Win
        </button>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
          <div className="text-green-500 text-5xl font-bold">Excellent!</div>
          <button onClick={onComplete} className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold shadow-lg animate-bounce">
            Close & Mark Done
          </button>
        </motion.div>
      )}
    </div>
  );
}

function MiniQuizGame({ onComplete }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="text-4xl">☕️</div>
      <h3 className="text-2xl font-bold text-slate-800">Morning Coffee Quiz</h3>
      <p className="text-slate-600">What is the Arabic word for "Morning"?</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <button className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:bg-red-50">Layl (Night)</button>
        <button onClick={onComplete} className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:bg-green-100 hover:border-green-500">Sabah (Morning)</button>
      </div>
    </div>
  );
}

function MiniReadingTask({ onComplete }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="text-4xl">📒</div>
      <h3 className="text-2xl font-bold text-slate-800">Review Notes</h3>
      <p className="text-slate-600">Read the vocabulary list to complete this task.</p>
      <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 w-full max-w-sm text-right font-bold text-slate-700">
        1. كتاب (Book)<br/>
        2. قلم (Pen)<br/>
        3. مكتب (Desk)
      </div>
      <button onClick={onComplete} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        I have read it
      </button>
    </div>
  );
}