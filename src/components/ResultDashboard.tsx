"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  PieChart,
  Pie,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  Target,
  Heart,
  ArrowRight,
  RefreshCw,
  Share2,
  Download,
  Zap,
  Brain,
  Rocket,
  Award,
  Star,
  Crown,
  Gem,
  Flame,
  BarChart3,
  Briefcase,
  Compass,
  Lightbulb,
  CheckCircle2,
  Copy,
  ExternalLink,
  Bookmark,
  Printer,
  FileText,
  Clock,
  Calendar,
  MapPin,
  TrendingDown,
  Activity,
  Layers,
  MessageCircle,
  Network,
  Globe,
  Users,
  Eye,
} from "lucide-react";
import { SimulationResult } from "@/lib/api";
import AgentChatPanel from "./AgentChatPanel";
import KnowledgeGraph from "./KnowledgeGraph";
import ParallelUniverses from "./ParallelUniverses";
import TimelineEvolution from "./TimelineEvolution";
import ReportExportPanel from "./ReportExportPanel";
import AgentPersonalitySystem from "./AgentPersonalitySystem";
import WorldSandboxVisualization from "./WorldSandboxVisualization";
import GodModePanel from "./GodModePanel";

/**
 * ResultDashboard 组件属性接口
 */
interface ResultDashboardProps {
  result: SimulationResult;
  onRestart?: () => void;
}

/**
 * 动画数字计数器组件
 */
function AnimatedCounter({ 
  value, 
  duration = 2, 
  suffix = "",
  prefix = "",
}: { 
  value: number; 
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}

/**
 * 核心天赋标签组件 - 专业版
 */
function TalentLabel({ label, description }: { label: string; description?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="relative"
    >
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FF41]/10 via-[#00D4FF]/10 to-[#BD00FF]/10 blur-3xl rounded-3xl" />
      </motion.div>
      
      <motion.div
        animate={{
          boxShadow: [
            "0 0 40px rgba(0, 255, 65, 0.2), 0 0 80px rgba(0, 255, 65, 0.1)",
            "0 0 60px rgba(0, 255, 65, 0.3), 0 0 120px rgba(0, 255, 65, 0.15)",
            "0 0 40px rgba(0, 255, 65, 0.2), 0 0 80px rgba(0, 255, 65, 0.1)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative px-8 sm:px-12 py-8 sm:py-10 rounded-3xl border-2 border-[#00FF41]/40 bg-[#0a0a0f]/90 backdrop-blur-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#00FF41]/20 to-[#00D4FF]/20 border border-[#00FF41]/30 rounded-full"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Crown className="w-4 h-4 text-[#FFD700]" />
          </motion.div>
          <span className="text-xs font-mono text-[#00FF41] tracking-wider">
            AI 核心天赋识别
          </span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
          </motion.div>
        </motion.div>
        
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/20">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
              <span className="text-xs font-mono text-[#00FF41]">VERIFIED TALENT</span>
            </div>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Syne'] font-extrabold mb-4">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400"
            >
              【
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-block bg-gradient-to-r from-[#00FF41] via-[#00D4FF] to-[#BD00FF] bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% 200%",
                animation: "gradient-shift 3s ease infinite",
              }}
            >
              {label}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400"
            >
              】
            </motion.span>
          </h1>
          
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-zinc-400 text-sm sm:text-base font-['Space_Grotesk'] max-w-xl mx-auto leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-zinc-600 font-mono"
        >
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#00FF41]" />
            98.5% 置信度
          </span>
          <span>|</span>
          <span>1000 Agents 验证</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * 高级指标卡片组件
 */
function AdvancedMetricCard({
  icon,
  label,
  value,
  subValue,
  color,
  delay,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
  delay: number;
  trend?: "up" | "down" | "neutral";
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ backgroundColor: color, opacity: 0.05 }}
        animate={{ opacity: isHovered ? 0.1 : 0.05 }}
      />
      
      <motion.div
        className="relative p-5 sm:p-6 rounded-2xl border backdrop-blur-xl overflow-hidden"
        style={{
          backgroundColor: "rgba(10, 10, 15, 0.9)",
          borderColor: `${color}30`,
        }}
        animate={{ borderColor: isHovered ? `${color}60` : `${color}30` }}
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${color}30, transparent 70%)`,
          }}
          animate={{ opacity: isHovered ? 0.3 : 0.2 }}
        />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="p-3 rounded-xl"
              style={{ 
                backgroundColor: `${color}15`,
                boxShadow: `0 0 20px ${color}20`,
              }}
              animate={{ 
                boxShadow: isHovered 
                  ? `0 0 30px ${color}40` 
                  : `0 0 20px ${color}20`,
              }}
            >
              <span style={{ color }}>{icon}</span>
            </motion.div>
            
            <div className="flex items-center gap-2">
              {trend && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.3 }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono ${
                    trend === "up" ? "bg-[#00FF41]/10 text-[#00FF41]" :
                    trend === "down" ? "bg-red-500/10 text-red-400" :
                    "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {trend === "down" && <TrendingDown className="w-3 h-3" />}
                  {trend === "neutral" && <Activity className="w-3 h-3" />}
                </motion.div>
              )}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: delay * 2 }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
          
          <p className="text-xs text-zinc-500 font-mono mb-1 tracking-wider">{label}</p>
          <motion.p 
            className="text-2xl sm:text-3xl font-['Syne'] font-bold mb-1"
            style={{ color }}
          >
            {value}
          </motion.p>
          {subValue && (
            <p className="text-xs text-zinc-600 font-mono">{subValue}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * 专业雷达图组件
 */
function ProfessionalRadarChart({ data }: { data: SimulationResult["evolutionData"] }) {
  const radarData = data.map((item) => ({
    mode: item.mode,
    成功率: item.successRate,
    满意度: item.satisfaction,
    成长性: item.growth,
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative p-6 rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-transparent rounded-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
              <BarChart3 className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                演化路径分析
              </h3>
              <p className="text-xs text-zinc-500 font-mono">Multi-dimensional comparison</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-[#00D4FF]/50 transition-colors"
            >
              <Download className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
              <PolarGrid 
                stroke="#3f3f46" 
                strokeDasharray="3 3"
                radialLines={true}
              />
              <PolarAngleAxis
                dataKey="mode"
                tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#71717a", fontSize: 10 }}
                tickCount={5}
              />
              <Radar 
                name="成功率" 
                dataKey="成功率" 
                stroke="#00FF41" 
                fill="#00FF41" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar 
                name="满意度" 
                dataKey="满意度" 
                stroke="#00D4FF" 
                fill="#00D4FF" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar 
                name="成长性" 
                dataKey="成长性" 
                stroke="#BD00FF" 
                fill="#BD00FF" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 10, 15, 0.95)",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#e4e4e7",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                iconSize={8}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-zinc-800/50">
          {[
            { label: "成功率", color: "#00FF41", desc: "职业匹配度" },
            { label: "满意度", color: "#00D4FF", desc: "工作幸福感" },
            { label: "成长性", color: "#BD00FF", desc: "发展潜力" },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-zinc-400 font-mono">{item.label}</span>
              </div>
              <span className="text-[10px] text-zinc-600">{item.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 专业条形图组件
 */
function ProfessionalBarChart({ data }: { data: SimulationResult["evolutionData"] }) {
  const barData = data.map((item) => ({
    name: item.mode,
    成功率: item.successRate,
    满意度: item.satisfaction,
    成长性: item.growth,
  }));
  
  const colors = {
    成功率: "#00FF41",
    满意度: "#00D4FF",
    成长性: "#BD00FF",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative p-6 rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#BD00FF]/5 to-transparent rounded-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#BD00FF]/10 border border-[#BD00FF]/30">
              <Target className="w-5 h-5 text-[#BD00FF]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                模式对比分析
              </h3>
              <p className="text-xs text-zinc-500 font-mono">Success rate comparison</p>
            </div>
          </div>
        </div>
        
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={{ stroke: "#3f3f46" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 12, fontFamily: "monospace" }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 10, 15, 0.95)",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#e4e4e7",
                  backdropFilter: "blur(10px)",
                }}
                formatter={(value, name) => [`${value}%`, String(name)]}
              />
              <Bar dataKey="成功率" radius={[0, 4, 4, 0]} barSize={16}>
                {barData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors.成功率} />
                ))}
              </Bar>
              <Bar dataKey="满意度" radius={[0, 4, 4, 0]} barSize={16}>
                {barData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors.满意度} />
                ))}
              </Bar>
              <Bar dataKey="成长性" radius={[0, 4, 4, 0]} barSize={16}>
                {barData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors.成长性} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 p-4 rounded-xl bg-[#00FF41]/5 border border-[#00FF41]/20"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#00FF41]/10">
              <Lightbulb className="w-4 h-4 text-[#00FF41]" />
            </div>
            <div>
              <p className="text-xs font-mono text-[#00FF41] mb-1">AI 推荐</p>
              <p className="text-sm text-zinc-300">
                {data.reduce((best, current) => 
                  current.successRate > best.successRate ? current : best
                ).mode} 模式成功率最高，建议优先探索此方向
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * 职业匹配卡片组件
 */
function CareerMatchCard({ 
  career, 
  index,
  isPrimary,
}: { 
  career: { name: string; match: number };
  index: number;
  isPrimary: boolean;
}) {
  const colors = ["#00FF41", "#00D4FF", "#BD00FF", "#FF00E5"];
  const color = colors[index % colors.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="relative group cursor-pointer"
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${color}10, transparent)` }}
      />
      
      <div 
        className="relative flex items-center gap-4 p-4 rounded-xl border transition-colors"
        style={{ 
          backgroundColor: "rgba(10, 10, 15, 0.8)",
          borderColor: isPrimary ? `${color}50` : "rgba(63, 63, 70, 0.5)",
        }}
      >
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          {isPrimary ? (
            <Crown className="w-5 h-5" style={{ color: "#FFD700" }} />
          ) : (
            <Briefcase className="w-5 h-5" style={{ color }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white truncate">{career.name}</h4>
            {isPrimary && (
              <span className="px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-mono">
                BEST MATCH
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${career.match}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color }}>
              {career.match}%
            </span>
          </div>
        </div>
        
        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors flex-shrink-0" />
      </div>
    </motion.div>
  );
}

/**
 * 职业匹配区块组件
 */
function CareerMatchSection({ 
  careers 
}: { 
  careers: Array<{ name: string; matchScore: number; reason: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative p-6 rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
          <Award className="w-5 h-5 text-[#FFD700]" />
        </div>
        <div>
          <h3 className="text-lg font-['Syne'] font-semibold text-white">
            职业匹配排行
          </h3>
          <p className="text-xs text-zinc-500 font-mono">Top career matches</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {careers.slice(0, 4).map((career, index) => (
          <motion.div
            key={career.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="group relative p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:border-[#00FF41]/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "💼"}</span>
                <h4 className="font-medium text-white">{career.name}</h4>
              </div>
              <span className="text-sm font-mono text-[#00FF41]">{career.matchScore}%</span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2">{career.reason}</p>
            <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00FF41] to-[#00D4FF]"
                initial={{ width: 0 }}
                animate={{ width: `${career.matchScore}%` }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * 行动项图标映射
 */
const ACTION_ICONS: Record<string, React.ReactNode> = {
  brain: <Brain className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  rocket: <Rocket className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  target: <Target className="w-5 h-5" />,
  lightbulb: <Lightbulb className="w-5 h-5" />,
  compass: <Compass className="w-5 h-5" />,
};

/**
 * 微步行动卡片组件 - 增强版
 */
function ActionCard({
  item,
  index,
}: {
  item: SimulationResult["actionableSteps"][0];
  index: number;
}) {
  const difficultyColors = {
    easy: { color: "#00FF41", label: "简单", time: "5-10分钟" },
    medium: { color: "#FFD700", label: "中等", time: "15-30分钟" },
    hard: { color: "#FF6B6B", label: "挑战", time: "30-60分钟" },
  };
  
  const config = difficultyColors[item.difficulty as keyof typeof difficultyColors] || difficultyColors.medium;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      whileHover={{ scale: 1.01, x: 8 }}
      className="relative group cursor-pointer"
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${config.color}10, transparent)` }}
      />
      
      <div 
        className="relative flex items-start gap-4 p-5 rounded-xl border transition-colors"
        style={{ 
          backgroundColor: "rgba(10, 10, 15, 0.8)",
          borderColor: "rgba(63, 63, 70, 0.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${config.color}15`,
              border: `1px solid ${config.color}30`,
            }}
            whileHover={{ scale: 1.1 }}
          >
            <span style={{ color: config.color }}>
              {ACTION_ICONS.brain}
            </span>
          </motion.div>
          
          <div className="flex flex-col gap-1">
            <span 
              className="text-[10px] font-mono px-2 py-0.5 rounded-full w-fit"
              style={{ 
                backgroundColor: `${config.color}20`,
                color: config.color,
              }}
            >
              {config.label}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
          <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{item.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-zinc-600 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.estimatedTime || config.time}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              步骤 {index + 1}
            </span>
          </div>
        </div>
        
        <motion.div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-700 group-hover:border-[#00FF41]/50 transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00FF41] transition-colors" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * 今日行动协议卡片组件 - 专业版
 */
function ActionProtocolCard({ items }: { items: SimulationResult["actionableSteps"] }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const text = items.map((item, i) => `${i + 1}. ${item.title}: ${item.description}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 via-[#00D4FF]/5 to-[#BD00FF]/10 blur-2xl rounded-3xl" />
      
      <div className="relative p-6 sm:p-8 rounded-3xl border border-zinc-800/50 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-[#00FF41]/20 to-[#00D4FF]/20 border border-[#00FF41]/30"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(0, 255, 65, 0.2)",
                  "0 0 40px rgba(0, 255, 65, 0.3)",
                  "0 0 20px rgba(0, 255, 65, 0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-[#00FF41]" />
            </motion.div>
            <div>
              <h3 className="text-xl font-['Syne'] font-semibold text-white">
                今日行动协议
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                {items.length} 个立即执行的微小行动
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400" />
              )}
              <span className="text-xs text-zinc-400 font-mono">
                {copied ? "已复制" : "复制"}
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all"
            >
              <Download className="w-4 h-4 text-zinc-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-[#BD00FF]/50 hover:bg-[#BD00FF]/5 transition-all"
            >
              <Share2 className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <ActionCard key={item.id} item={item} index={index} />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-between"
        >
          <p className="text-xs text-zinc-600 font-mono">
            💡 每天完成一个小步骤，持续积累成长
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">预计总时长:</span>
            <span className="text-xs text-[#00FF41] font-mono">30-45 分钟</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * 洞察卡片组件
 */
function InsightCard({ insight }: { insight: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="relative p-6 sm:p-8 rounded-2xl border border-[#BD00FF]/30 bg-gradient-to-br from-[#BD00FF]/10 to-transparent"
    >
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Gem className="w-4 h-4 text-[#BD00FF]" />
        </motion.div>
        <span className="text-xs font-mono text-[#BD00FF] tracking-wider">AI 深度洞察</span>
      </div>
      
      <p className="text-center text-zinc-300 font-['Space_Grotesk'] text-base sm:text-lg leading-relaxed pt-4 italic">
        &ldquo;{insight}&rdquo;
      </p>
    </motion.div>
  );
}

/**
 * 操作按钮组组件
 */
function ActionButtons({ onRestart }: { onRestart?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
    >
      <motion.button
        onClick={onRestart}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all text-zinc-400 hover:text-[#00FF41] font-mono text-sm"
      >
        <RefreshCw className="w-4 h-4" />
        重新演算
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all text-zinc-400 hover:text-[#00D4FF] font-mono text-sm"
      >
        <Bookmark className="w-4 h-4" />
        保存结果
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00FF41] to-emerald-500 text-black font-['Syne'] font-semibold text-sm shadow-lg shadow-[#00FF41]/20"
      >
        <Download className="w-4 h-4" />
        导出完整报告
      </motion.button>
    </motion.div>
  );
}

/**
 * 结果仪表盘主组件 - 专业版
 */
export default function ResultDashboard({ result, onRestart }: ResultDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAgentChat, setShowAgentChat] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "graph" | "universes" | "timeline" | "agents" | "sandbox" | "godmode">("overview");
  
  const tabs = [
    { id: "overview", label: "总览", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "graph", label: "知识图谱", icon: <Network className="w-4 h-4" /> },
    { id: "universes", label: "平行宇宙", icon: <Globe className="w-4 h-4" /> },
    { id: "timeline", label: "时间线", icon: <Clock className="w-4 h-4" /> },
    { id: "agents", label: "智能体", icon: <Users className="w-4 h-4" /> },
    { id: "sandbox", label: "世界沙盒", icon: <Layers className="w-4 h-4" /> },
    { id: "godmode", label: "上帝视角", icon: <Eye className="w-4 h-4" /> },
  ];
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#030712] py-16 sm:py-24 px-4 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <TalentLabel 
          label={result.coreTalent} 
          description={result.talentDescription}
        />
        
        <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                activeTab === tab.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? "rgba(39, 39, 42, 0.8)" : undefined,
              }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <AdvancedMetricCard
                  icon={<Heart className="w-5 h-5" />}
                  label="平行宇宙存活率"
                  value={`${result.stats.survivalRate}%`}
                  color="#00FF41"
                  delay={0.2}
                  trend="up"
                />
                <AdvancedMetricCard
                  icon={<Target className="w-5 h-5" />}
                  label="最匹配职业方向"
                  value={result.bestCareers[0]?.name || "分析中..."}
                  subValue={result.bestCareers.slice(1, 3).map(c => c.name).join(" / ")}
                  color="#00D4FF"
                  delay={0.3}
                />
                <AdvancedMetricCard
                  icon={<Sparkles className="w-5 h-5" />}
                  label="心流指数"
                  value={`${result.stats.flowIndex}/10`}
                  subValue="高度专注状态"
                  color="#BD00FF"
                  delay={0.4}
                  trend="neutral"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfessionalRadarChart data={result.evolutionData} />
                <ProfessionalBarChart data={result.evolutionData} />
              </div>
              
              <CareerMatchSection careers={result.bestCareers} />
              
              <ActionProtocolCard items={result.actionableSteps} />
              
              {result.insight && (
                <InsightCard insight={result.insight} />
              )}
            </motion.div>
          )}
          
          {activeTab === "graph" && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-[600px]"
            >
              <KnowledgeGraph talentData={{
                coreTalent: result.coreTalent,
                talentDescription: result.talentDescription,
                bestCareers: result.bestCareers,
                actionableSteps: result.actionableSteps,
              }} />
            </motion.div>
          )}
          
          {activeTab === "universes" && (
            <motion.div
              key="universes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ParallelUniverses talentData={{
                  coreTalent: result.coreTalent,
                  talentDescription: result.talentDescription,
                  stats: result.stats,
                  bestCareers: result.bestCareers,
                }}
              />
            </motion.div>
          )}
          
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TimelineEvolution />
            </motion.div>
          )}
          
          {activeTab === "agents" && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AgentPersonalitySystem />
            </motion.div>
          )}
          
          {activeTab === "sandbox" && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WorldSandboxVisualization />
            </motion.div>
          )}
          
          {activeTab === "godmode" && (
            <motion.div
              key="godmode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GodModePanel />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <motion.button
            onClick={() => setShowAgentChat(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#BD00FF] to-[#FF00E5] text-white font-['Syne'] font-semibold text-sm shadow-lg shadow-[#BD00FF]/20"
          >
            <MessageCircle className="w-4 h-4" />
            深度对话
          </motion.button>
          
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 hover:border-[#00FF41]/50 hover:bg-[#00FF41]/5 transition-all text-zinc-400 hover:text-[#00FF41] font-mono text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            重新演算
          </motion.button>
          
          <motion.button
            onClick={() => setShowExport(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00FF41] to-emerald-500 text-black font-['Syne'] font-semibold text-sm shadow-lg shadow-[#00FF41]/20"
          >
            <Download className="w-4 h-4" />
            导出完整报告
          </motion.button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center pt-8"
        >
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#00FF41]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-zinc-500 font-mono">Analysis Complete</span>
            </div>
            <span className="text-xs text-zinc-600">|</span>
            <span className="text-xs text-zinc-500 font-mono">TalentSwarm v0.3.0</span>
            <span className="text-xs text-zinc-600">|</span>
            <span className="text-xs text-zinc-500 font-mono">Multi-Agent Engine</span>
          </div>
        </motion.div>
      </div>
      
      <AgentChatPanel
        isOpen={showAgentChat}
        onClose={() => setShowAgentChat(false)}
        talentLabel={result.coreTalent}
      />
      
      <ReportExportPanel
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        result={result}
      />
    </motion.div>
  );
}
