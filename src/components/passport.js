// app/page.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs) { return twMerge(clsx(inputs)); }

// ==========================================
// DATA: THE ID CARDS (Cards 1-5)
// ==========================================
const PROFILES = {
  1: { id: 1, name: "أحمد القحطاني", role: "مهندس", nation: "سعودي", age: 25, avatar: "👨🏻‍💼", color: "bg-emerald-100" },
  2: { id: 2, name: "ماريا سميث", role: "ممرضة", nation: "أمريكية", age: 28, avatar: "👩🏼‍⚕️", color: "bg-blue-100" },
  3: { id: 3, name: "محمد أكرم بن سُهيمي", role: "صحفي", nation: "ماليزي", age: 22, avatar: "👨🏽‍💻", color: "bg-amber-100" },
  4: { id: 4, name: "آمال الحربي", role: "مدرسة لغة عربية", nation: "سعودية", age: 24, avatar: "👩🏻‍🏫", color: "bg-rose-100" },
  5: { id: 5, name: "عدنان شودري", role: "مدرس لغة إنجليزية", nation: "بريطاني", age: 23, avatar: "👨🏼‍🏫", color: "bg-indigo-100" },
};

// ==========================================
// DATA: THE QUESTIONS (1-10)
// We link each question to a specific profile ID so we know which card to show.
// ==========================================
const QUESTIONS = [
  { id: 1, profileId: 1, text: "ما هي مهنة أحمد القحطاني؟", options: ["مهندس", "مدرس", "صحفي", "ممرض"], answer: "مهندس" },
  { id: 2, profileId: 2, text: "ما هي وظيفة ماريا سميث؟", options: ["ممرضة", "مدرسة", "مهندسة", "صحفية"], answer: "ممرضة" },
  { id: 3, profileId: 3, text: "ما هي مهنة محمد أكرم بن سُهيمي؟", options: ["صحفي", "مهندس", "مدرس", "ممرض"], answer: "صحفي" },
  { id: 4, profileId: 4, text: "ما هي وظيفة آمال الحربي؟", options: ["مدرسة", "ممرضة", "صحفية", "مهندسة"], answer: "مدرسة" },
  { id: 5, profileId: 1, text: "ما هي جنسية أحمد القحطاني؟", options: ["سعودي", "أمريكي", "بريطاني", "ماليزي"], answer: "سعودي" },
  { id: 6, profileId: 2, text: "كم عمر ماريا سميث؟", options: ["25 سنة", "22 سنة", "28 سنة", "24 سنة"], answer: "28 سنة" },
  { id: 7, profileId: 5, text: "عدنان تشودري من...", options: ["بريطانيا", "السعودية", "أمريكا", "ماليزيا"], answer: "بريطانيا" },
  { id: 8, profileId: 3, text: "ما هي جنسية محمد أكرم؟", options: ["ماليزي", "سعودي", "بريطاني", "أمريكي"], answer: "ماليزي" },
  { id: 9, profileId: 4, text: "آمال الحربي...", options: ["سعودية", "أمريكية", "بريطانية", "ماليزية"], answer: "سعودية" },
  { id: 10, profileId: 5, text: "كم عمر عدنان شودري؟", options: ["23 سنة", "22 سنة", "24 سنة", "28 سنة"], answer: "23 سنة" },
];

export default function PassportScannerGame() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing, success, error, finished
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const currentQuestion = QUESTIONS[currentQIndex];
  const currentProfile = PROFILES[currentQuestion?.profileId];

  const handleAnswer = (selectedOption) => {
    if (gameState !== "playing") return;

    if (selectedOption === currentQuestion.answer) {
      setGameState("success");
      setScore(s => s + 1);
      // Wait for animation then next question
      setTimeout(() => {
        if (currentQIndex < QUESTIONS.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          setGameState("playing");
        } else {
          setGameState("finished");
        }
      }, 1500);
    } else {
      setGameState("error");
      setTimeout(() => {
        setGameState("playing");
      }, 1000);
    }
  };

  if (!isClient) return null;

  if (gameState === "finished") {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-slate-800 p-8 rounded-3xl border-4 border-emerald-500 text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-4">انتهت المهمة!</h1>
          <p className="text-2xl mb-6">النتيجة النهائية: {score} / {QUESTIONS.length}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold text-xl transition">
            العب مرة أخرى
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col items-center py-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center px-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-emerald-400 tracking-wider">نظام فحص الجوازات</span>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          السؤال: <span className="text-emerald-400 font-bold font-mono">{currentQIndex + 1}/{QUESTIONS.length}</span>
        </div>
      </header>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 px-4 items-stretch">
        
        {/* LEFT: THE ID CARD (The Evidence) */}
        <div className="flex-1 flex justify-center items-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfile.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-full max-w-md"
            >
              <IDCard profile={currentProfile} gameState={gameState} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: THE SCANNER/QUESTION PANEL */}
        <div className="flex-1 bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          
          <div className="relative z-10">
            <h2 className="text-slate-400 text-sm font-bold mb-2 uppercase tracking-widest">سؤال التحقق</h2>
            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQuestion.text}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={gameState !== "playing"}
                  className={cn(
                    "w-full p-4 rounded-xl text-lg font-bold transition-all transform active:scale-95 text-right flex justify-between items-center group",
                    "bg-slate-700 hover:bg-slate-600 border-2 border-transparent",
                    // Visual feedback on specific button click could be added here
                  )}
                >
                  <span>{option}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">👈</span>
                </button>
              ))}
            </div>
          </div>

          {/* Result Overlay Text */}
          <AnimatePresence>
             {gameState === "error" && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute bottom-4 left-0 right-0 text-center text-red-400 font-bold"
                >
                    إجابة خاطئة! حاول مرة أخرى
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

// ==========================================
// SUB-COMPONENT: ID CARD
// ==========================================
function IDCard({ profile, gameState }) {
  return (
    <div className={cn("relative rounded-2xl shadow-2xl overflow-hidden text-slate-900 border-4 border-white/10 w-full aspect-[1.6/1]", profile.color)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
      
      {/* Card Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start border-b border-black/10 pb-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold opacity-50 uppercase tracking-widest">International ID Card</span>
          <span className="text-xs font-bold opacity-50 uppercase tracking-widest">بطاقة هوية دولية</span>
        </div>
        <div className="w-12 h-8 bg-slate-800/10 rounded flex items-center justify-center">
            <div className="w-8 h-4 border-2 border-slate-800/30 rounded-sm" />
        </div>
      </div>

      {/* Card Content */}
      <div className="absolute top-20 left-6 right-6 bottom-6 flex gap-6">
        {/* Photo Area */}
        <div className="w-1/3 h-full flex flex-col gap-2">
            <div className="flex-1 bg-white/40 rounded-lg border-2 border-black/5 flex items-center justify-center text-6xl shadow-inner relative overflow-hidden">
                {profile.avatar}
                {/* Hologram Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50" />
            </div>
            <div className="h-6 w-full bg-slate-900/10 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-mono opacity-60 tracking-tighter">ID: 8492-332-{profile.id}</span>
            </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 flex flex-col justify-center gap-3">
            <Field label="الاسم (Name)" value={profile.name} />
            <Field label="المهنة (Occupation)" value={profile.role} />
            <div className="flex gap-4">
                <Field label="الجنسية (Nationality)" value={profile.nation} />
                <Field label="العمر (Age)" value={`${profile.age} سنة`} />
            </div>
        </div>
      </div>

      {/* STAMP ANIMATION (Success/Fail) */}
      <AnimatePresence>
        {gameState === "success" && (
            <motion.div 
                initial={{ scale: 2, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: -10 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
                <div className="border-8 border-emerald-600 text-emerald-600 rounded-lg px-8 py-2 text-5xl font-black uppercase tracking-widest opacity-80 mix-blend-multiply" style={{ transform: "rotate(-15deg)" }}>
                    مقبول
                </div>
            </motion.div>
        )}
         {gameState === "error" && (
            <motion.div 
                initial={{ scale: 2, opacity: 0, rotate: 20 }}
                animate={{ scale: 1, opacity: 1, rotate: 10 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
                <div className="border-8 border-red-600 text-red-600 rounded-lg px-8 py-2 text-5xl font-black uppercase tracking-widest opacity-80 mix-blend-multiply" style={{ transform: "rotate(15deg)" }}>
                    مرفوض
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* SCANNER LASER EFFECT */}
      {gameState === "playing" && (
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-10"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
      )}
    </div>
  );
}

function Field({ label, value }) {
    return (
        <div className="flex flex-col border-b border-black/5 pb-1">
            <span className="text-[10px] uppercase opacity-50 font-bold tracking-wide">{label}</span>
            <span className="text-lg font-bold leading-tight">{value}</span>
        </div>
    );
}