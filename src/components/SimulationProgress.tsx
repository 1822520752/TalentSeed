"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { 
  Cpu, Network, Users, Globe, Sparkles, CheckCircle2, 
  Zap, Brain, Layers, Activity, Hexagon, Binary
} from "lucide-react";

/**
 * 模拟阶段配置接口
 */
interface SimulationStage {
  id: string;
  label: string;
  subLabel: string;
  messages: string[];
  icon: React.ReactNode;
  color: string;
  duration: number;
  particles: number;
}

/**
 * 模拟阶段配置数据 - 更丰富的阶段信息
 */
const SIMULATION_STAGES: SimulationStage[] = [
  {
    id: "system",
    label: "系统初始化",
    subLabel: "SYSTEM INITIALIZATION",
    messages: [
      "正在剥离表层情绪...",
      "解析潜意识数据流...",
      "建立量子计算通道...",
    ],
    icon: <Cpu className="w-5 h-5" />,
    color: "#00FF41",
    duration: 1200,
    particles: 30,
  },
  {
    id: "graphrag",
    label: "GraphRAG 引擎",
    subLabel: "KNOWLEDGE GRAPH EXTRACTION",
    messages: [
      "正在提取核心心智节点...",
      "构建个人知识图谱...",
      "识别关键决策模式...",
      "知识图谱构建完成。",
    ],
    icon: <Network className="w-5 h-5" />,
    color: "#00D4FF",
    duration: 1000,
    particles: 50,
  },
  {
    id: "swarm",
    label: "Swarm Engine",
    subLabel: "MULTI-AGENT DEPLOYMENT",
    messages: [
      "正在克隆 1000 个数字分身...",
      "分配 Agent 性格矩阵...",
      "初始化演化参数...",
    ],
    icon: <Users className="w-5 h-5" />,
    color: "#BD00FF",
    duration: 1200,
    particles: 80,
  },
  {
    id: "sandbox",
    label: "沙盒演化",
    subLabel: "PARALLEL UNIVERSE SIMULATION",
    messages: [
      "正在将分身投放至 50 种高压社会环境...",
      "启动加速演化引擎...",
      "实时监控生存率...",
      "演化进程: 100% 完成",
    ],
    icon: <Globe className="w-5 h-5" />,
    color: "#FF00E5",
    duration: 1000,
    particles: 100,
  },
  {
    id: "collapse",
    label: "数据坍缩",
    subLabel: "TALENT EXTRACTION",
    messages: [
      "演化完成，正在提取最高天赋胜率路径...",
      "计算最优职业匹配度...",
      "生成个性化行动协议...",
    ],
    icon: <Sparkles className="w-5 h-5" />,
    color: "#FFD700",
    duration: 800,
    particles: 60,
  },
];

/**
 * 高级矩阵代码雨背景组件 - 更专业的视觉效果
 */
function AdvancedMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const speeds: number[] = Array(columns).fill(0).map(() => 0.5 + Math.random() * 0.5);
    
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    const draw = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        const gradient = ctx.createLinearGradient(x, y - 100, x, y);
        gradient.addColorStop(0, "rgba(0, 255, 65, 0)");
        gradient.addColorStop(0.5, "rgba(0, 255, 65, 0.5)");
        gradient.addColorStop(1, "rgba(0, 255, 65, 1)");
        
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i] += speeds[i];
      }
    };
    
    const interval = setInterval(draw, 35);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

/**
 * 六边形网格背景
 */
function HexGridBackground() {
  const hexagons = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 40,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {hexagons.map((hex) => (
        <motion.div
          key={hex.id}
          className="absolute"
          style={{
            left: `${hex.x}%`,
            top: `${hex.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 60, 0],
          }}
          transition={{
            duration: hex.duration,
            delay: hex.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Hexagon 
            className="w-full h-full" 
            style={{ 
              width: hex.size, 
              height: hex.size,
              color: "#00FF41",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 数据流粒子效果
 */
function DataFlowParticles({ activeStage }: { activeStage: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 3,
    }));
  }, []);
  
  const colors = ["#00FF41", "#00D4FF", "#BD00FF", "#FF00E5", "#FFD700"];
  const activeColor = colors[activeStage] || colors[0];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: activeColor,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.speed * 2,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * 打字机效果 Hook - 增强版
 */
function useTypewriter(text: string, speed: number = 30, start: boolean = true) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    if (!start) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }
    
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed, start]);
  
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);
  
  return { displayedText, isComplete, showCursor };
}

/**
 * 环形进度条组件
 */
function CircularProgress({ 
  progress, 
  color, 
  size = 120,
  strokeWidth = 4,
}: { 
  progress: number; 
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="opacity-20"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-2xl font-mono font-bold"
          style={{ color }}
          key={Math.round(progress)}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  );
}

/**
 * 高级流光加载条组件
 */
function AdvancedProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ 
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}50`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-y-0 w-24 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
        }}
        animate={{
          x: ["-100%", "600%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-4 rounded-full"
        style={{
          background: color,
          filter: "blur(4px)",
          opacity: progress > 0 ? 1 : 0,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
        }}
      />
    </div>
  );
}

/**
 * 统计数据卡片
 */
function StatsCard({ 
  label, 
  value, 
  icon, 
  color,
  delay,
}: { 
  label: string; 
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="relative group"
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${color}10, transparent)`,
        }}
      />
      <div 
        className="relative p-4 rounded-xl border backdrop-blur-sm"
        style={{ 
          backgroundColor: "rgba(10, 10, 15, 0.8)",
          borderColor: `${color}20`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{label}</span>
        </div>
        <motion.div
          className="text-xl font-mono font-bold"
          style={{ color }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay * 2 }}
        >
          {value}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * 单个阶段显示组件 - 增强版
 */
function StageDisplay({ 
  stage, 
  isActive, 
  isCompleted,
  messageIndex,
  progress,
}: { 
  stage: SimulationStage; 
  isActive: boolean;
  isCompleted: boolean;
  messageIndex: number;
  progress: number;
}) {
  const currentMessage = stage.messages[messageIndex] || stage.messages[stage.messages.length - 1];
  const { displayedText, isComplete, showCursor } = useTypewriter(
    currentMessage, 
    25, 
    isActive
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
        style={{ 
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(90deg, ${stage.color}10, transparent)`,
        }}
      />
      
      <div className="relative flex items-start gap-4 p-4">
        <div className="relative">
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
            style={{ 
              backgroundColor: isCompleted 
                ? `${stage.color}20` 
                : isActive 
                  ? `${stage.color}25` 
                  : "rgba(39, 39, 42, 0.5)",
              border: `2px solid ${isCompleted || isActive ? stage.color : "#3f3f46"}`,
              boxShadow: isActive ? `0 0 20px ${stage.color}40` : "none",
            }}
          >
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle2 className="w-6 h-6" style={{ color: stage.color }} />
              </motion.div>
            ) : (
              <motion.div
                animate={isActive ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ color: isActive ? stage.color : "#71717a" }}
              >
                {stage.icon}
              </motion.div>
            )}
            
            {isActive && !isCompleted && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ border: `2px solid ${stage.color}` }}
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          
          {isActive && !isCompleted && (
            <motion.div
              className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full"
              style={{ backgroundColor: stage.color }}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h3 
                className="text-sm font-semibold"
                style={{ color: isActive || isCompleted ? stage.color : "#71717a" }}
              >
                {stage.label}
              </h3>
              <p className="text-[10px] text-zinc-600 font-mono tracking-wider">
                {stage.subLabel}
              </p>
            </div>
            
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto"
              >
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <span className="text-[10px] text-zinc-400 font-mono">ACTIVE</span>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="relative min-h-[24px]">
            <p className="font-mono text-sm text-zinc-300">
              {isActive ? displayedText : isCompleted ? currentMessage : ""}
              {isActive && !isComplete && showCursor && (
                <span 
                  className="inline-block w-2 h-4 ml-0.5"
                  style={{ backgroundColor: stage.color }}
                />
              )}
            </p>
          </div>
          
          {isActive && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              className="mt-3"
            >
              <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stage.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 模拟进度主组件 - 专业版
 */
export default function SimulationProgress({ 
  onComplete,
  userInput,
}: { 
  onComplete?: () => void;
  userInput?: string;
}) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const totalProgress = useMemo(() => {
    const baseProgress = (currentStageIndex / SIMULATION_STAGES.length) * 100;
    const currentStageContribution = completedStages.has(SIMULATION_STAGES[currentStageIndex]?.id) 
      ? (100 / SIMULATION_STAGES.length) 
      : (stageProgress / SIMULATION_STAGES.length);
    return Math.min(baseProgress + currentStageContribution, 100);
  }, [currentStageIndex, completedStages, stageProgress]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (isComplete) return;
    
    const currentStage = SIMULATION_STAGES[currentStageIndex];
    if (!currentStage) return;
    
    const progressInterval = setInterval(() => {
      setStageProgress((prev) => {
        const increment = 100 / (currentStage.duration / 50);
        return Math.min(prev + increment, 100);
      });
    }, 50);
    
    return () => clearInterval(progressInterval);
  }, [currentStageIndex, isComplete]);
  
  const advanceStage = useCallback(() => {
    const currentStage = SIMULATION_STAGES[currentStageIndex];
    
    if (!currentStage) return;
    
    if (currentMessageIndex < currentStage.messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
      return;
    }
    
    setCompletedStages(prev => new Set([...prev, currentStage.id]));
    setStageProgress(0);
    
    if (currentStageIndex < SIMULATION_STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setCurrentMessageIndex(0);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }
  }, [currentStageIndex, currentMessageIndex, onComplete]);
  
  useEffect(() => {
    if (isComplete) return;
    
    const currentStage = SIMULATION_STAGES[currentStageIndex];
    if (!currentStage) return;
    
    const timer = setTimeout(advanceStage, currentStage.duration);
    
    return () => clearTimeout(timer);
  }, [currentStageIndex, currentMessageIndex, advanceStage, isComplete]);
  
  const currentStage = SIMULATION_STAGES[currentStageIndex];
  const currentColor = currentStage?.color || "#00FF41";
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#030712] flex items-center justify-center overflow-hidden"
    >
      <AdvancedMatrixRain />
      <HexGridBackground />
      <DataFlowParticles activeStage={currentStageIndex} />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030712]/50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div 
            className="absolute -inset-1 rounded-3xl opacity-50"
            style={{
              background: `linear-gradient(135deg, ${currentColor}20, transparent, ${currentColor}10)`,
            }}
          />
          
          <div className="relative bg-[#0a0a0f]/90 border border-zinc-800/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="text-center lg:text-left mb-8">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        `0 0 20px ${currentColor}30`,
                        `0 0 40px ${currentColor}50`,
                        `0 0 20px ${currentColor}30`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 lg:mx-0 mx-auto"
                    style={{ 
                      backgroundColor: `${currentColor}15`,
                      border: `2px solid ${currentColor}40`,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu className="w-8 h-8" style={{ color: currentColor }} />
                    </motion.div>
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl font-['Syne'] font-bold text-white mb-2">
                    <span style={{ color: currentColor }}>沙盒演算</span>进行中
                  </h2>
                  <p className="text-zinc-500 text-sm font-mono">
                    AI 引擎正在深度解析你的潜意识数据...
                  </p>
                </div>
                
                {userInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-zinc-500" />
                      <p className="text-xs text-zinc-500 font-mono">输入数据</p>
                    </div>
                    <p className="text-sm text-zinc-300 line-clamp-2">{userInput}</p>
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {SIMULATION_STAGES.map((stage, index) => (
                      <motion.div
                        key={stage.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: index <= currentStageIndex ? 1 : 0.4,
                          height: "auto",
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StageDisplay
                          stage={stage}
                          isActive={index === currentStageIndex && !isComplete}
                          isCompleted={completedStages.has(stage.id)}
                          messageIndex={index === currentStageIndex ? currentMessageIndex : stage.messages.length - 1}
                          progress={stageProgress}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="lg:w-64 flex flex-col gap-4">
                <div className="flex justify-center lg:justify-start">
                  <CircularProgress 
                    progress={totalProgress} 
                    color={currentColor}
                    size={140}
                    strokeWidth={6}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <StatsCard
                    label="运行时间"
                    value={formatTime(elapsedTime)}
                    icon={<Activity className="w-4 h-4" />}
                    color={currentColor}
                    delay={0.1}
                  />
                  <StatsCard
                    label="活跃 Agent"
                    value={`${Math.floor(totalProgress * 10)}+`}
                    icon={<Users className="w-4 h-4" />}
                    color={currentColor}
                    delay={0.2}
                  />
                  <StatsCard
                    label="演化场景"
                    value={`${Math.floor(totalProgress / 2)}+`}
                    icon={<Globe className="w-4 h-4" />}
                    color={currentColor}
                    delay={0.3}
                  />
                  <StatsCard
                    label="数据节点"
                    value={`${Math.floor(totalProgress * 5)}+`}
                    icon={<Network className="w-4 h-4" />}
                    color={currentColor}
                    delay={0.4}
                  />
                </div>
                
                <div className="mt-auto pt-4 border-t border-zinc-800/50">
                  <div className="flex justify-between text-xs text-zinc-500 font-mono mb-2">
                    <span>总进度</span>
                    <span>{Math.round(totalProgress)}%</span>
                  </div>
                  <AdvancedProgressBar 
                    progress={totalProgress} 
                    color={currentColor} 
                  />
                </div>
              </div>
            </div>
            
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 p-4 rounded-xl border"
                style={{ 
                  backgroundColor: `${currentColor}10`,
                  borderColor: `${currentColor}30`,
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <CheckCircle2 className="w-6 h-6" style={{ color: currentColor }} />
                  </motion.div>
                  <p className="font-mono text-sm" style={{ color: currentColor }}>
                    演算完成！正在准备结果展示...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#00FF41]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-zinc-500 font-mono">System Online</span>
            </div>
            <span className="text-xs text-zinc-600">|</span>
            <span className="text-xs text-zinc-500 font-mono">TalentSwarm v0.2.0</span>
            <span className="text-xs text-zinc-600">|</span>
            <span className="text-xs text-zinc-500 font-mono">Multi-Agent Engine</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
