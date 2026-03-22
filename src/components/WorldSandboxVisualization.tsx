"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Zap, Users, TrendingUp, Target, Sparkles,
  Play, Pause, RotateCcw, Layers, Activity, Eye
} from "lucide-react";

/**
 * 世界节点接口
 */
interface WorldNode {
  id: string;
  type: "agent" | "event" | "resource" | "location";
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  connections: string[];
  activity: number;
}

/**
 * 世界连接接口
 */
interface WorldConnection {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: "social" | "economic" | "information" | "resource";
}

/**
 * 涌现事件接口
 */
interface EmergentEvent {
  id: string;
  type: "cooperation" | "competition" | "innovation" | "crisis";
  description: string;
  impact: number;
  timestamp: number;
  involvedAgents: string[];
}

/**
 * 世界沙盒可视化组件
 */
export default function WorldSandboxVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [timeStep, setTimeStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(null);
  const [emergentEvents, setEmergentEvents] = useState<EmergentEvent[]>([]);
  const [showConnections, setShowConnections] = useState(true);

  const worldData = useMemo(() => {
    const nodes: WorldNode[] = [
      { id: "agent-1", type: "agent", x: 200, y: 150, size: 24, color: "#00FF41", label: "艾达", connections: ["agent-2", "event-1"], activity: 0.9 },
      { id: "agent-2", type: "agent", x: 350, y: 100, size: 22, color: "#00D4FF", label: "马克", connections: ["agent-1", "agent-3"], activity: 0.7 },
      { id: "agent-3", type: "agent", x: 450, y: 200, size: 26, color: "#BD00FF", label: "琳达", connections: ["agent-2", "event-2"], activity: 0.85 },
      { id: "agent-4", type: "agent", x: 300, y: 280, size: 20, color: "#FF00E5", label: "杰克", connections: ["agent-1", "resource-1"], activity: 0.6 },
      { id: "agent-5", type: "agent", x: 150, y: 250, size: 23, color: "#FFD700", label: "苏菲", connections: ["agent-4", "location-1"], activity: 0.75 },
      { id: "agent-6", type: "agent", x: 500, y: 150, size: 21, color: "#FF6B6B", label: "大卫", connections: ["agent-3", "event-1"], activity: 0.8 },
      { id: "event-1", type: "event", x: 280, y: 180, size: 18, color: "#FFD700", label: "协作项目", connections: [], activity: 0.5 },
      { id: "event-2", type: "event", x: 420, y: 120, size: 16, color: "#FF6B6B", label: "创新突破", connections: [], activity: 0.4 },
      { id: "resource-1", type: "resource", x: 220, y: 320, size: 14, color: "#00FF41", label: "数据资源", connections: [], activity: 0.3 },
      { id: "location-1", type: "location", x: 100, y: 180, size: 30, color: "#00D4FF", label: "创新实验室", connections: [], activity: 0.6 },
    ];

    const connections: WorldConnection[] = [
      { id: "c1", source: "agent-1", target: "agent-2", strength: 0.8, type: "social" },
      { id: "c2", source: "agent-2", target: "agent-3", strength: 0.6, type: "information" },
      { id: "c3", source: "agent-1", target: "event-1", strength: 0.9, type: "economic" },
      { id: "c4", source: "agent-3", target: "event-2", strength: 0.7, type: "information" },
      { id: "c5", source: "agent-4", target: "resource-1", strength: 0.5, type: "resource" },
      { id: "c6", source: "agent-5", target: "location-1", strength: 0.8, type: "social" },
      { id: "c7", source: "agent-6", target: "event-1", strength: 0.6, type: "social" },
    ];

    return { nodes, connections };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeStep((prev) => prev + 1);

      if (Math.random() > 0.7) {
        const eventTypes: EmergentEvent["type"][] = ["cooperation", "competition", "innovation", "crisis"];
        const descriptions = {
          cooperation: "多个智能体形成协作联盟",
          competition: "资源竞争导致策略调整",
          innovation: "涌现出新的行为模式",
          crisis: "检测到潜在风险信号",
        };
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const newEvent: EmergentEvent = {
          id: `event-${Date.now()}`,
          type,
          description: descriptions[type],
          impact: Math.random() * 100,
          timestamp: timeStep,
          involvedAgents: ["agent-1", "agent-2"].slice(0, Math.floor(Math.random() * 3) + 1),
        };
        setEmergentEvents((prev) => [...prev.slice(-4), newEvent]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, timeStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

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

    if (showConnections) {
      worldData.connections.forEach((conn) => {
        const source = worldData.nodes.find((n) => n.id === conn.source);
        const target = worldData.nodes.find((n) => n.id === conn.target);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        gradient.addColorStop(0, `${source.color}60`);
        gradient.addColorStop(1, `${target.color}60`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = conn.strength * 3;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    worldData.nodes.forEach((node) => {
      const isSelected = selectedNode?.id === node.id;
      const pulseSize = isSelected ? node.size * 1.3 : node.size;

      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, pulseSize
      );
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(0.5, `${node.color}80`);
      gradient.addColorStop(1, `${node.color}20`);

      ctx.fillStyle = gradient;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = `${node.type === "agent" ? 11 : 9}px "Space Grotesk"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y + pulseSize + 14);

      if (node.type === "agent") {
        ctx.fillStyle = node.color;
        ctx.font = "14px sans-serif";
        ctx.fillText(
          node.label === "艾达" ? "👩‍🔬" :
          node.label === "马克" ? "👨‍💼" :
          node.label === "琳达" ? "👩‍🎨" :
          node.label === "杰克" ? "👨‍💻" :
          node.label === "苏菲" ? "👩‍🏫" : "👨‍⚕️",
          node.x, node.y
        );
      }
    });
  }, [worldData, selectedNode, showConnections, timeStep]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = worldData.nodes.find((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.size + 10;
    });

    setSelectedNode(clickedNode || null);
  };

  const eventTypeColors = {
    cooperation: "#00FF41",
    competition: "#FFD700",
    innovation: "#BD00FF",
    crisis: "#FF6B6B",
  };

  const eventTypeLabels = {
    cooperation: "协作",
    competition: "竞争",
    innovation: "创新",
    crisis: "危机",
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
                世界沙盒
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                高保真数字世界 · 实时演化
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <span className="text-xs text-zinc-400 font-mono">T={timeStep}</span>
            </div>
            <motion.button
              onClick={() => setShowConnections(!showConnections)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <Layers className="w-4 h-4 text-zinc-400" />
            </motion.button>
            <motion.button
              onClick={() => setIsRunning(!isRunning)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              {isRunning ? (
                <Pause className="w-4 h-4 text-zinc-400" />
              ) : (
                <Play className="w-4 h-4 text-zinc-400" />
              )}
            </motion.button>
            <motion.button
              onClick={() => {
                setTimeStep(0);
                setEmergentEvents([]);
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
                  点击节点查看详情
                </span>
              </div>

              <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00FF41]" />
                  智能体
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  事件
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                  资源
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#00FF41]" />
                <span className="text-xs text-zinc-400 font-mono">涌现事件</span>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                <AnimatePresence>
                  {emergentEvents.length === 0 ? (
                    <p className="text-xs text-zinc-600 font-mono text-center py-4">
                      等待涌现事件...
                    </p>
                  ) : (
                    emergentEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                            style={{
                              backgroundColor: `${eventTypeColors[event.type]}20`,
                              color: eventTypeColors[event.type],
                            }}
                          >
                            {eventTypeLabels[event.type]}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            T={event.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{event.description}</p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs text-zinc-400 font-mono">节点详情</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{selectedNode.label}</span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono"
                      style={{
                        backgroundColor: `${selectedNode.color}20`,
                        color: selectedNode.color,
                      }}
                    >
                      {selectedNode.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono">活跃度:</span>
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: selectedNode.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.activity * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      {Math.round(selectedNode.activity * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    连接数: {selectedNode.connections.length}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-zinc-800/50">
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#00FF41]">
              {worldData.nodes.filter((n) => n.type === "agent").length}
            </p>
            <p className="text-xs text-zinc-500 font-mono">智能体</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#00D4FF]">
              {worldData.connections.length}
            </p>
            <p className="text-xs text-zinc-500 font-mono">连接</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#BD00FF]">
              {emergentEvents.length}
            </p>
            <p className="text-xs text-zinc-500 font-mono">涌现事件</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-['Syne'] font-bold text-[#FFD700]">
              {timeStep}
            </p>
            <p className="text-xs text-zinc-500 font-mono">时间步</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
