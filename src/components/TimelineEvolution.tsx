"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, TrendingUp, Target, Sparkles, ChevronRight,
  Play, Pause, SkipForward, RotateCcw
} from "lucide-react";

/**
 * 时间节点接口
 */
interface TimelineEvent {
  id: number;
  year: number;
  phase: string;
  title: string;
  description: string;
  milestone: string;
  type: "growth" | "achievement" | "challenge" | "breakthrough";
  metrics: {
    skill: number;
    wealth: number;
    impact: number;
  };
}

/**
 * 生成时间线数据
 */
const generateTimeline = (): TimelineEvent[] => [
  {
    id: 1,
    year: 1,
    phase: "探索期",
    title: "天赋觉醒",
    description: "发现自身独特的思维模式和创造力",
    milestone: "完成第一次自我认知突破",
    type: "breakthrough",
    metrics: { skill: 20, wealth: 10, impact: 5 },
  },
  {
    id: 2,
    year: 2,
    phase: "成长期",
    title: "技能积累",
    description: "系统性地提升核心能力",
    milestone: "掌握3项核心技能",
    type: "growth",
    metrics: { skill: 45, wealth: 25, impact: 15 },
  },
  {
    id: 3,
    year: 3,
    phase: "成长期",
    title: "首次突破",
    description: "在专业领域取得初步成就",
    milestone: "获得行业认可",
    type: "achievement",
    metrics: { skill: 60, wealth: 40, impact: 30 },
  },
  {
    id: 4,
    year: 5,
    phase: "发展期",
    title: "职业跃迁",
    description: "从执行者向决策者转变",
    milestone: "带领团队完成重大项目",
    type: "breakthrough",
    metrics: { skill: 75, wealth: 55, impact: 50 },
  },
  {
    id: 5,
    year: 7,
    phase: "成熟期",
    title: "影响力扩展",
    description: "开始影响行业发展方向",
    milestone: "成为领域专家",
    type: "achievement",
    metrics: { skill: 85, wealth: 70, impact: 65 },
  },
  {
    id: 6,
    year: 10,
    phase: "巅峰期",
    title: "价值实现",
    description: "天赋得到充分发挥",
    milestone: "创造独特的社会价值",
    type: "breakthrough",
    metrics: { skill: 95, wealth: 85, impact: 80 },
  },
  {
    id: 7,
    year: 15,
    phase: "传承期",
    title: "智慧传承",
    description: "将经验传授给下一代",
    milestone: "培养接班人",
    type: "achievement",
    metrics: { skill: 100, wealth: 95, impact: 95 },
  },
];

/**
 * 时间线演化组件
 */
export default function TimelineEvolution() {
  const [timeline] = useState<TimelineEvent[]>(generateTimeline);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  
  const currentEvent = timeline[currentIndex];
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= timeline.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isPlaying, timeline.length]);
  
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };
  const handleNext = () => {
    if (currentIndex < timeline.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };
  
  const typeColors = {
    growth: "#00D4FF",
    achievement: "#00FF41",
    challenge: "#FFD700",
    breakthrough: "#BD00FF",
  };
  
  const progress = ((currentIndex + 1) / timeline.length) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
              <Clock className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                演化时间线
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                未来 {timeline[timeline.length - 1].year} 年发展预测
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400" />
            </motion.button>
            <motion.button
              onClick={isPlaying ? handlePause : handlePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-zinc-400" />
              ) : (
                <Play className="w-4 h-4 text-zinc-400" />
              )}
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={currentIndex >= timeline.length - 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: typeColors[currentEvent?.type || "growth"] }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            {timeline.map((event, index) => (
              <motion.button
                key={event.id}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index <= currentIndex ? "" : "opacity-40"
                }`}
                style={{
                  backgroundColor:
                    index <= currentIndex
                      ? typeColors[event.type]
                      : "#3f3f46",
                  boxShadow:
                    index === currentIndex
                      ? `0 0 10px ${typeColors[event.type]}`
                      : undefined,
                }}
              />
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {currentEvent && (
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono"
                      style={{
                        backgroundColor: `${typeColors[currentEvent.type]}20`,
                        color: typeColors[currentEvent.type],
                      }}
                    >
                      {currentEvent.phase}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      第 {currentEvent.year} 年
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    {currentEvent.title}
                  </h4>
                </div>
                <motion.div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${typeColors[currentEvent.type]}15`,
                    border: `1px solid ${typeColors[currentEvent.type]}30`,
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: typeColors[currentEvent.type] }}
                  />
                </motion.div>
              </div>
              
              <p className="text-sm text-zinc-400 mb-4">
                {currentEvent.description}
              </p>
              
              <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500 font-mono">
                <Target className="w-3 h-3" />
                <span>里程碑: {currentEvent.milestone}</span>
              </div>
              
              {showMetrics && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-mono mb-1">技能水平</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#00D4FF]"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentEvent.metrics.skill}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-[#00D4FF] font-mono">
                        {currentEvent.metrics.skill}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-mono mb-1">财富积累</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#FFD700]"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentEvent.metrics.wealth}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-[#FFD700] font-mono">
                        {currentEvent.metrics.wealth}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-mono mb-1">社会影响</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#BD00FF]"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentEvent.metrics.impact}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-[#BD00FF] font-mono">
                        {currentEvent.metrics.impact}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-600 font-mono">
          {currentIndex + 1} / {timeline.length}
          <ChevronRight className="w-3 h-3" />
          {Math.round(progress)}% 完成
        </div>
      </div>
    </motion.div>
  );
}
