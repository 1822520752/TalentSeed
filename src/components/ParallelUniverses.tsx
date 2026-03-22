"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Zap, Users, TrendingUp, Target, Sparkles,
  Play, Pause, RotateCcw, Layers, Activity, Eye,
  Loader2
} from "lucide-react";

/**
 * 宇宙状态类型
 */
type UniverseStatus = "success" | "partial" | "failed";

/**
 * 宇宙接口定义
 */
interface Universe {
  id: string;
  name: string;
  scenario: string;
  status: UniverseStatus;
  successRate: number;
  keyFactors: string[];
  outcome: string;
  lessons: string[];
}

/**
 * 平行宇宙数据接口
 */
interface ParallelUniversesData {
  universes: Universe[];
  summary: {
    successCount: number;
    partialCount: number;
    failedCount: number;
    bestPath: string;
    riskFactors: string[];
  };
}

/**
 * ParallelUniverses 属性接口
 */
interface ParallelUniversesProps {
  talentData?: {
    coreTalent: string;
    talentDescription: string;
    stats: {
      survivalRate: number;
      flowIndex: number;
      adaptabilityScore: number;
      innovationIndex: number;
    };
    bestCareers: Array<{ name: string; matchScore: number }>;
  };
  variables?: {
    resourceLevel?: number;
    marketVolatility?: number;
    policyIntervention?: number;
    crisisIntensity?: number;
  };
}

/**
 * 状态颜色映射
 */
const STATUS_COLORS: Record<UniverseStatus, string> = {
  success: "#00FF41",
  partial: "#FFD700",
  failed: "#FF6B6B",
};

/**
 * 平行宇宙模拟组件 - 连接真实AI API
 */
export default function ParallelUniverses({ talentData, variables }: ParallelUniversesProps) {
  const [data, setData] = useState<ParallelUniversesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (talentData) {
      fetchUniverses();
    }
  }, [talentData, variables]);

  useEffect(() => {
    if (isPlaying && data) {
      playIntervalRef.current = setInterval(() => {
        setSelectedIndex((prev) => (prev + 1) % data.universes.length);
      }, 2000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, data]);

  /**
   * 从API获取平行宇宙数据
   */
  const fetchUniverses = async () => {
    if (!talentData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/parallel-universes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentData, variables }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || "获取平行宇宙数据失败");
      }
    } catch (err) {
      console.error("Parallel universes error:", err);
      setError("无法生成平行宇宙模拟");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUniverse = data?.universes[selectedIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
              <Layers className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">平行宇宙模拟</h3>
              <p className="text-xs text-zinc-500 font-mono">
                {data ? `${data.universes.length} 个宇宙 · ${data.summary.successCount} 成功` : "AI 模拟中..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg border transition-colors ${
                isPlaying
                  ? "border-[#00FF41]/50 bg-[#00FF41]/10"
                  : "border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-[#00FF41]" />
              ) : (
                <Play className="w-4 h-4 text-zinc-400" />
              )}
            </motion.button>
            <motion.button
              onClick={fetchUniverses}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-[#00D4FF] animate-spin mb-4" />
            <span className="text-sm text-zinc-500 font-mono">AI 正在模拟 12 个平行宇宙...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Globe className="w-10 h-10 text-zinc-600 mb-4" />
            <span className="text-sm text-zinc-500 font-mono mb-4">{error}</span>
            <motion.button
              onClick={fetchUniverses}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-mono"
            >
              重试
            </motion.button>
          </div>
        ) : !data ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-sm text-zinc-600 font-mono">等待天赋分析数据...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-6">
              {data.universes.map((universe, index) => (
                <motion.button
                  key={universe.id}
                  onClick={() => setSelectedIndex(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative aspect-square rounded-lg border transition-all ${
                    selectedIndex === index
                      ? "border-white/50"
                      : "border-zinc-800/50 hover:border-zinc-700"
                  }`}
                  style={{
                    backgroundColor: `${STATUS_COLORS[universe.status]}20`,
                    boxShadow: selectedIndex === index ? `0 0 15px ${STATUS_COLORS[universe.status]}40` : undefined,
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs font-mono"
                    style={{ color: STATUS_COLORS[universe.status] }}
                  >
                    {index + 1}
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selectedUniverse && (
                <motion.div
                  key={selectedUniverse.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{selectedUniverse.name}</h4>
                      <p className="text-sm text-zinc-500">{selectedUniverse.scenario}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className="px-3 py-1 rounded-lg text-sm font-mono"
                        style={{
                          backgroundColor: `${STATUS_COLORS[selectedUniverse.status]}20`,
                          color: STATUS_COLORS[selectedUniverse.status],
                        }}
                      >
                        {selectedUniverse.successRate}% 成功率
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-zinc-500 font-mono mb-1">关键因素</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUniverse.keyFactors.map((factor, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400 font-mono"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-zinc-500 font-mono mb-1">结果</p>
                    <p className="text-sm text-zinc-300">{selectedUniverse.outcome}</p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 font-mono mb-1">经验教训</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUniverse.lessons.map((lesson, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-zinc-800/50 text-xs text-zinc-500 font-mono"
                        >
                          {lesson}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-zinc-800/50">
              <div className="text-center">
                <p className="text-2xl font-['Syne'] font-bold text-[#00FF41]">
                  {data.summary.successCount}
                </p>
                <p className="text-xs text-zinc-500 font-mono">成功宇宙</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-['Syne'] font-bold text-[#FFD700]">
                  {data.summary.partialCount}
                </p>
                <p className="text-xs text-zinc-500 font-mono">部分成功</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-['Syne'] font-bold text-[#FF6B6B]">
                  {data.summary.failedCount}
                </p>
                <p className="text-xs text-zinc-500 font-mono">失败宇宙</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-['Syne'] font-bold text-[#00D4FF]">
                  {Math.round((data.summary.successCount / data.universes.length) * 100)}%
                </p>
                <p className="text-xs text-zinc-500 font-mono">总成功率</p>
              </div>
            </div>

            {data.summary.bestPath && (
              <div className="mt-4 p-3 rounded-xl border border-[#00FF41]/30 bg-[#00FF41]/5">
                <p className="text-xs text-[#00FF41] font-mono mb-1">最佳发展路径</p>
                <p className="text-sm text-zinc-300">{data.summary.bestPath}</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
