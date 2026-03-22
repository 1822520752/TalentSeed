"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Zap, Play, Pause, RotateCcw, Layers, Activity, Eye
} from "lucide-react";
import { useSimulationEngine } from "@/hooks/useSimulationEngine";
import type { Agent } from "@/lib/simulation-engine";

/**
 * 状态颜色映射
 */
const statusColors: Record<string, string> = {
  active: "#00FF41",
  thinking: "#00D4FF",
  interacting: "#BD00FF",
  resting: "#71717a",
  deciding: "#FFD700",
  learning: "#FF00E5",
};

/**
 * 真实仿真引擎驱动的世界沙盒组件
 */
export default function RealWorldSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const {
    isRunning,
    agents,
    events,
    emergentBehaviors,
    statistics,
    time,
    variables,
    start,
    stop,
    updateVariables,
    injectCrisis,
  } = useSimulationEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || agents.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    agents.forEach((agent) => {
      agents.forEach((other) => {
        if (agent.id === other.id) return;
        const strength = agent.relationships.get(other.id) || 0;
        if (strength < 60) return;

        ctx.beginPath();
        ctx.moveTo(agent.currentPosition.x, agent.currentPosition.y);
        ctx.lineTo(other.currentPosition.x, other.currentPosition.y);

        const gradient = ctx.createLinearGradient(
          agent.currentPosition.x,
          agent.currentPosition.y,
          other.currentPosition.x,
          other.currentPosition.y
        );
        gradient.addColorStop(0, `${agent.color}40`);
        gradient.addColorStop(1, `${other.color}40`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = strength / 30;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    });

    agents.forEach((agent) => {
      const { x, y } = agent.currentPosition;
      const size = 20 + (agent.energy / 100) * 10;
      const isSelected = selectedAgent?.id === agent.id;

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, size + 8, 0, Math.PI * 2);
        ctx.strokeStyle = agent.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, agent.color);
      gradient.addColorStop(0.5, `${agent.color}80`);
      gradient.addColorStop(1, `${agent.color}20`);

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(agent.avatar, x, y);

      ctx.fillStyle = "#ffffff";
      ctx.font = "11px 'Space Grotesk'";
      ctx.fillText(agent.name, x, y + size + 14);

      const statusColor = statusColors[agent.status] || "#71717a";
      ctx.beginPath();
      ctx.arc(x + size - 5, y - size + 5, 5, 0, Math.PI * 2);
      ctx.fillStyle = statusColor;
      ctx.fill();
    });
  }, [agents, selectedAgent]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = agents.find((agent) => {
      const dx = agent.currentPosition.x - x;
      const dy = agent.currentPosition.y - y;
      const size = 20 + (agent.energy / 100) * 10;
      return Math.sqrt(dx * dx + dy * dy) < size + 10;
    });

    setSelectedAgent(clicked || null);
  };

  const handleVariableChange = (key: string, value: number) => {
    updateVariables({ [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#BD00FF]/10 border border-[#BD00FF]/30">
              <Globe className="w-5 h-5 text-[#BD00FF]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                真实仿真引擎
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                {agents.length} 智能体 · T={time} · {isRunning ? "运行中" : "已暂停"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => (isRunning ? stop() : start())}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg border transition-colors ${
                isRunning
                  ? "border-[#00FF41]/50 bg-[#00FF41]/10"
                  : "border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {isRunning ? (
                <Pause className="w-4 h-4 text-[#00FF41]" />
              ) : (
                <Play className="w-4 h-4 text-zinc-400" />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                stop();
                setSelectedAgent(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              ref={containerRef}
              className="relative w-full h-[350px] rounded-xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-pointer"
              />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-500 font-mono">
                  点击智能体查看详情
                </span>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00FF41]" />
                  活跃
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#BD00FF]" />
                  交互
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  决策
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-500" />
                  休息
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
              <p className="text-xs text-zinc-500 font-mono mb-3">变量控制 (真实影响)</p>
              <div className="space-y-3">
                {variables && (
                  <>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">资源投入</span>
                        <span className="text-[#00FF41] font-mono">{variables.resourceLevel}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={variables.resourceLevel}
                        onChange={(e) => handleVariableChange("resourceLevel", Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#00FF41]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">市场波动</span>
                        <span className="text-[#00D4FF] font-mono">{variables.marketVolatility}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={variables.marketVolatility}
                        onChange={(e) => handleVariableChange("marketVolatility", Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#00D4FF]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">危机强度</span>
                        <span className="text-[#FF6B6B] font-mono">{variables.crisisIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={variables.crisisIntensity}
                        onChange={(e) => handleVariableChange("crisisIntensity", Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#FF6B6B]"
                      />
                    </div>
                  </>
                )}
              </div>

              <motion.button
                onClick={() => injectCrisis(80)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 transition-colors"
              >
                <Zap className="w-4 h-4 text-[#FF6B6B]" />
                <span className="text-xs text-[#FF6B6B] font-mono">注入危机事件</span>
              </motion.button>
            </div>

            <AnimatePresence>
              {selectedAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${selectedAgent.color}20`, border: `1px solid ${selectedAgent.color}40` }}
                    >
                      {selectedAgent.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{selectedAgent.name}</p>
                      <p className="text-xs text-zinc-500">{selectedAgent.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-zinc-800/50">
                      <span className="text-zinc-500">能量</span>
                      <p className="text-[#00FF41] font-mono">{selectedAgent.energy.toFixed(0)}%</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800/50">
                      <span className="text-zinc-500">动机</span>
                      <p className="text-[#00D4FF] font-mono">{selectedAgent.motivation.toFixed(0)}%</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800/50">
                      <span className="text-zinc-500">状态</span>
                      <p className="text-white font-mono">{selectedAgent.status}</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800/50">
                      <span className="text-zinc-500">记忆</span>
                      <p className="text-white font-mono">{selectedAgent.memory.length}条</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
              <p className="text-xs text-zinc-500 font-mono mb-2">涌现行为</p>
              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {emergentBehaviors.length === 0 ? (
                  <p className="text-xs text-zinc-600 font-mono text-center py-2">
                    等待涌现...
                  </p>
                ) : (
                  emergentBehaviors.slice(-3).map((behavior) => (
                    <div
                      key={behavior.id}
                      className="p-2 rounded-lg bg-zinc-800/50 text-xs"
                    >
                      <span className="text-[#BD00FF] font-mono">[{behavior.type}]</span>
                      <span className="text-zinc-400 ml-1">{behavior.description}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-zinc-800/50">
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#00FF41]">
              {statistics?.totalInteractions ?? 0}
            </p>
            <p className="text-xs text-zinc-500 font-mono">交互次数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#00D4FF]">
              {statistics?.successfulDecisions ?? 1}
            </p>
            <p className="text-xs text-zinc-500 font-mono">成功决策</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#BD00FF]">
              {emergentBehaviors.length}
            </p>
            <p className="text-xs text-zinc-500 font-mono">涌现行为</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#FFD700]">
              {statistics?.cooperationIndex.toFixed(0) ?? 50}
            </p>
            <p className="text-xs text-zinc-500 font-mono">协作指数</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
