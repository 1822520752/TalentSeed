"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Move,
  Loader2, Network
} from "lucide-react";

/**
 * 图谱节点接口
 */
interface GraphNode {
  id: string;
  label: string;
  type: "core" | "skill" | "trait" | "experience";
  importance: number;
  x?: number;
  y?: number;
}

/**
 * 图谱边接口
 */
interface GraphEdge {
  source: string;
  target: string;
  label: string;
  strength: number;
}

/**
 * 图谱数据接口
 */
interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * KnowledgeGraph 属性接口
 */
interface KnowledgeGraphProps {
  talentData?: {
    coreTalent: string;
    talentDescription: string;
    bestCareers: Array<{ name: string; reason: string }>;
    actionableSteps: Array<{ title: string; description: string }>;
  };
}

/**
 * 节点类型颜色映射
 */
const NODE_COLORS: Record<string, string> = {
  core: "#00FF41",
  skill: "#00D4FF",
  trait: "#BD00FF",
  experience: "#FFD700",
};

/**
 * 知识图谱组件 - 连接真实AI API
 */
export default function KnowledgeGraph({ talentData }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (talentData) {
      fetchGraphData();
    }
  }, [talentData]);

  /**
   * 从API获取知识图谱数据
   */
  const fetchGraphData = async () => {
    if (!talentData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/knowledge-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentData }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const processedData = processGraphData(data.data);
        setGraphData(processedData);
      } else {
        throw new Error(data.error || "获取图谱数据失败");
      }
    } catch (err) {
      console.error("Knowledge graph error:", err);
      setError("无法生成知识图谱");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理图谱数据，计算节点位置
   */
  const processGraphData = (data: GraphData): GraphData => {
    if (!data.nodes || data.nodes.length === 0) {
      return data;
    }

    const centerX = 300;
    const centerY = 200;
    const radius = 150;

    const nodes = data.nodes.map((node, index) => {
      if (node.type === "core") {
        return { ...node, x: centerX, y: centerY };
      }

      const nonCoreNodes = data.nodes.filter((n) => n.type !== "core");
      const nonCoreIndex = nonCoreNodes.findIndex((n) => n.id === node.id);
      const angle = (nonCoreIndex / nonCoreNodes.length) * 2 * Math.PI - Math.PI / 2;
      const nodeRadius = radius * (0.6 + (node.importance / 100) * 0.4);

      return {
        ...node,
        x: centerX + Math.cos(angle) * nodeRadius,
        y: centerY + Math.sin(angle) * nodeRadius,
      };
    });

    return { ...data, nodes };
  };

  useEffect(() => {
    if (!graphData || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
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

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (graphData.edges) {
      graphData.edges.forEach((edge) => {
        const source = graphData.nodes.find((n) => n.id === edge.source);
        const target = graphData.nodes.find((n) => n.id === edge.target);
        if (!source || !target) return;
        if (source.x === undefined || source.y === undefined) return;
        if (target.x === undefined || target.y === undefined) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        const sourceColor = NODE_COLORS[source.type] || "#00FF41";
        const targetColor = NODE_COLORS[target.type] || "#00D4FF";
        gradient.addColorStop(0, `${sourceColor}60`);
        gradient.addColorStop(1, `${targetColor}60`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = edge.strength * 3;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    graphData.nodes.forEach((node) => {
      if (node.x === undefined || node.y === undefined) return;

      const nodeSize = 20 + (node.importance / 100) * 20;
      const isHovered = hoveredNode?.id === node.id;
      const nodeColor = NODE_COLORS[node.type] || "#00FF41";

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize + 8, 0, Math.PI * 2);
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize);
      gradient.addColorStop(0, nodeColor);
      gradient.addColorStop(0.5, `${nodeColor}80`);
      gradient.addColorStop(1, `${nodeColor}20`);

      ctx.fillStyle = gradient;
      ctx.fill();

      if (showLabels) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `${node.type === "core" ? 12 : 10}px "Space Grotesk"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x, node.y + nodeSize + 14);
      }
    });

    ctx.restore();
  }, [graphData, scale, offset, hoveredNode, showLabels]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (!graphData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    const hovered = graphData.nodes.find((node) => {
      if (node.x === undefined || node.y === undefined) return false;
      const dx = node.x - x;
      const dy = node.y - y;
      const size = 20 + (node.importance / 100) * 20;
      return Math.sqrt(dx * dx + dy * dy) < size + 5;
    });

    setHoveredNode(hovered || null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
  };

  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#BD00FF]/10 border border-[#BD00FF]/30">
              <Network className="w-5 h-5 text-[#BD00FF]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">知识图谱</h3>
              <p className="text-xs text-zinc-500 font-mono">
                {graphData ? `${graphData.nodes.length} 节点 · ${graphData.edges?.length || 0} 连接` : "AI 生成中..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => handleZoom(0.1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-zinc-400" />
            </motion.button>
            <motion.button
              onClick={() => handleZoom(-0.1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-zinc-400" />
            </motion.button>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400" />
            </motion.button>
            <motion.button
              onClick={() => setShowLabels(!showLabels)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[350px] rounded-xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#BD00FF] animate-spin" />
                <span className="text-sm text-zinc-500 font-mono">AI 正在生成知识图谱...</span>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Network className="w-8 h-8 text-zinc-600" />
                <span className="text-sm text-zinc-500 font-mono">{error}</span>
                <motion.button
                  onClick={fetchGraphData}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-mono"
                >
                  重试
                </motion.button>
              </div>
            </div>
          ) : !graphData ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-zinc-600 font-mono">等待天赋分析数据...</span>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          )}

          {hoveredNode && (
            <div className="absolute top-3 left-3 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: NODE_COLORS[hoveredNode.type] }}
                />
                <span className="text-sm font-medium text-white">{hoveredNode.label}</span>
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                类型: {hoveredNode.type} · 重要性: {hoveredNode.importance}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF41]" />
              核心天赋
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
              技能
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BD00FF]" />
              特质
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
              经历
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono">缩放: {Math.round(scale * 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
