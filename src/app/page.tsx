"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Github, Sparkles, Zap, Brain, Orbit, ArrowRight, 
  ChevronDown, Play, Star, Users, TrendingUp, Target,
  Layers, Cpu, Network, Globe, Heart, Share2, Download,
  RefreshCw, ExternalLink, Copy, Check, History, Bookmark
} from "lucide-react";
import SimulationProgress from "@/components/SimulationProgress";
import ResultDashboard from "@/components/ResultDashboard";
import HistoryPanel, { historyUtils } from "@/components/HistoryPanel";
import { simulateTalent, SimulationResult } from "@/lib/api";

/**
 * 页面状态枚举
 */
type PageState = "input" | "simulating" | "result" | "error";

/**
 * 粒子背景组件
 */
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];
    
    const colors = ["#00FF41", "#00D4FF", "#BD00FF", "#FF00E5"];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.stroke();
          }
        });
      });
      
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    animate();
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

/**
 * 导航栏组件
 */
function Navbar({ onOpenHistory }: { onOpenHistory?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Orbit className="w-9 h-9 text-[#00FF41]" />
            </motion.div>
            <div className="absolute inset-0 blur-lg bg-[#00FF41]/50 rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Syne'] text-xl font-bold tracking-tight">
              <span className="text-white">Talent</span>
              <span className="text-[#00FF41]">Swarm</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest">
              MULTI-AGENT TALENT ENGINE
            </span>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onOpenHistory}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 hover:border-[#BD00FF]/50 hover:bg-[#BD00FF]/5 transition-all group"
          >
            <History className="w-4 h-4 text-zinc-400 group-hover:text-[#BD00FF] transition-colors" />
            <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hidden sm:inline">历史记录</span>
          </motion.button>
          <motion.a
            href="#features"
            whileHover={{ y: -2 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Features
          </motion.a>
          <motion.a
            href="#how-it-works"
            whileHover={{ y: -2 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            How it works
          </motion.a>
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all group"
          >
            <Github className="w-4 h-4 text-zinc-400 group-hover:text-[#00FF41] transition-colors" />
            <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">Star</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 group-hover:bg-[#00FF41]/10 transition-colors">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-mono text-zinc-400">1.2k</span>
            </span>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

/**
 * Hero 区域组件
 */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <div ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center">
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF41]/30 bg-[#00FF41]/5 text-[#00FF41] text-sm font-mono backdrop-blur-sm">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            AI-Powered Talent Discovery Engine
            <span className="px-2 py-0.5 rounded bg-[#00FF41]/20 text-xs">BETA</span>
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Syne'] font-extrabold mb-8 leading-[0.95] tracking-tight"
        >
          <span className="block text-zinc-300">Stop Testing.</span>
          <span className="block text-gradient-animated">Start Simulating.</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          停止枯燥测试，开始演算你的{" "}
          <span className="text-[#00FF41] font-mono font-bold">1000</span>{" "}
          种人生。
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base text-zinc-500 max-w-xl mx-auto mb-12"
        >
          输入你的潜意识，AI 引擎将生成 1000 个平行宇宙的你，寻找你真正的天赋归属。
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500"
        >
          {[
            { icon: <Users className="w-4 h-4" />, label: "1000+ Agents" },
            { icon: <Network className="w-4 h-4" />, label: "GraphRAG" },
            { icon: <Globe className="w-4 h-4" />, label: "50+ Scenarios" },
            { icon: <Zap className="w-4 h-4" />, label: "Real-time" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800"
            >
              <span className="text-[#00FF41]">{item.icon}</span>
              <span className="font-mono">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-zinc-600"
          >
            <span className="text-xs font-mono">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * 特性展示组件
 */
function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Multi-Agent System",
      description: "1000 个 AI Agent 并行演算，模拟不同职业场景下的你",
      color: "#00FF41",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "GraphRAG Engine",
      description: "提取核心心智节点，构建个人知识图谱",
      color: "#00D4FF",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "50+ Scenarios",
      description: "覆盖创业、打工、自由职业等多种人生路径",
      color: "#BD00FF",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Matching",
      description: "基于演化结果，精准匹配你的天赋职业方向",
      color: "#FF00E5",
    },
  ];
  
  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#00FF41] tracking-widest mb-4 block">
            POWERED BY AI
          </span>
          <h2 className="text-3xl md:text-4xl font-['Syne'] font-bold text-white mb-4">
            How TalentSwarm Works
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            我们的多智能体系统会在后台模拟 1000 个平行宇宙，找出最优天赋路径
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `${feature.color}15`,
                  boxShadow: `0 0 20px ${feature.color}20`
                }}
              >
                <span style={{ color: feature.color }}>{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 核心交互区组件
 */
function InteractionArea({ onLaunch }: { onLaunch: (input: string) => void }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  const handleLaunch = () => {
    if (!inputValue.trim() || inputValue.length < 10) return;
    onLaunch(inputValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleLaunch();
    }
  };
  
  useEffect(() => {
    setCharCount(inputValue.length);
  }, [inputValue]);
  
  const isValid = inputValue.trim().length >= 10;
  
  return (
    <section id="how-it-works" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono text-[#00FF41] tracking-widest mb-4 block">
            START YOUR JOURNEY
          </span>
          <h2 className="text-3xl md:text-4xl font-['Syne'] font-bold text-white mb-4">
            输入你的潜意识
          </h2>
          <p className="text-zinc-400">
            告诉我们你最近的困惑、一段日记，或你最引以为傲的一件事
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div
            className={`relative rounded-2xl transition-all duration-500 ${
              isFocused ? "glow-box" : ""
            }`}
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00FF41]/20 via-[#00D4FF]/20 to-[#BD00FF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative glass-panel rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-[#00FF41]" />
                    Multi-Agent Ready
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                    1000 Simulations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${
                    charCount < 10 ? "text-zinc-600" : 
                    charCount < 500 ? "text-zinc-400" : 
                    charCount < 2000 ? "text-[#00FF41]" : "text-red-400"
                  }`}>
                    {charCount} / 2000
                  </span>
                </div>
              </div>
              
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="倾诉你最近的困惑、一段日记，或你最引以为傲的一件事...&#10;&#10;例如：我最近在思考如何平衡工作和生活，感觉自己总是在追求完美，但有时候会感到力不从心..."
                className="w-full h-48 bg-transparent text-zinc-200 placeholder-zinc-600 font-['Space_Grotesk'] text-base p-5 resize-none focus:outline-none"
              />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={handleLaunch}
              disabled={!isValid}
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              className={`relative group w-full sm:w-auto px-8 py-4 rounded-xl font-['Syne'] font-semibold text-lg tracking-wide transition-all duration-300 ${
                isValid
                  ? "bg-gradient-to-r from-[#00FF41] to-emerald-500 text-black cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {isValid && (
                <>
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00FF41] to-emerald-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                </>
              )}
              <span className="relative flex items-center justify-center gap-3">
                <motion.span
                  animate={isValid ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🚀
                </motion.span>
                <span>启动沙盒演算</span>
              </span>
            </motion.button>
            
            <p className="text-xs text-zinc-600 font-mono text-center sm:text-left">
              ⌘ + Enter 快速启动 · 数据本地加密存储
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * 统计数据组件
 */
function StatsSection() {
  const stats = [
    { value: "1,000+", label: "AI Agents", suffix: "" },
    { value: "50+", label: "Career Paths", suffix: "" },
    { value: "98.5%", label: "Accuracy Rate", suffix: "" },
    { value: "10K+", label: "Users Served", suffix: "" },
  ];
  
  return (
    <section className="relative py-16 px-6 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-['Syne'] font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500 font-mono">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 错误页面组件
 */
function ErrorPage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center px-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center"
        >
          <span className="text-4xl">⚠️</span>
        </motion.div>
        <h2 className="text-2xl font-['Syne'] font-bold text-white mb-3">演算遇到问题</h2>
        <p className="text-zinc-400 text-sm mb-8">{error}</p>
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00FF41] to-emerald-500 text-black font-['Syne'] font-semibold"
        >
          重新开始
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * 底部组件
 */
function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Orbit className="w-6 h-6 text-[#00FF41]" />
            <span className="font-['Syne'] font-bold text-white">TalentSwarm</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-zinc-500 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
              System Online
            </span>
            <span>v0.1.0 Beta</span>
            <span>Open Source</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#00FF41] transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * 首页主组件
 */
export default function Home() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [userInput, setUserInput] = useState("");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [apiCallStarted, setApiCallStarted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchSimulationResult = useCallback(async (input: string) => {
    const response = await simulateTalent(input);

    if (response.success && response.data) {
      setSimulationResult(response.data);
      historyUtils.saveRecord(response.data, input);
      setPageState("result");
    } else {
      setErrorMessage(response.error || "未知错误");
      setPageState("error");
    }
  }, []);

  const handleLaunch = (input: string) => {
    setUserInput(input);
    setSimulationResult(null);
    setErrorMessage("");
    setApiCallStarted(false);
    setPageState("simulating");
  };

  useEffect(() => {
    if (pageState === "simulating" && userInput && !apiCallStarted) {
      setApiCallStarted(true);
      fetchSimulationResult(userInput);
    }
  }, [pageState, userInput, apiCallStarted, fetchSimulationResult]);

  const handleRestart = () => {
    setUserInput("");
    setSimulationResult(null);
    setErrorMessage("");
    setApiCallStarted(false);
    setPageState("input");
  };

  const handleSelectHistory = (record: SimulationResult & { input: string; timestamp: string }) => {
    setUserInput(record.input);
    setSimulationResult(record);
    setPageState("result");
    setShowHistory(false);
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <ParticleBackground />
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      
      {pageState !== "result" && pageState !== "error" && <Navbar />}
      
      <AnimatePresence mode="wait">
        {pageState === "input" && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection />
            <FeaturesSection />
            <InteractionArea onLaunch={handleLaunch} />
            <StatsSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pageState === "simulating" && (
          <SimulationProgress
            key="simulation"
            userInput={userInput}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pageState === "result" && simulationResult && (
          <ResultDashboard
            key="result"
            result={simulationResult}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pageState === "error" && (
          <ErrorPage
            key="error"
            error={errorMessage}
            onRetry={handleRestart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            key="history"
            onSelectRecord={handleSelectHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
