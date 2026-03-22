"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Heart, Zap, Users, MessageCircle, TrendingUp,
  Target, Sparkles, Activity, Clock, Star, Eye
} from "lucide-react";

/**
 * 智能体个性属性接口
 */
interface AgentPersonality {
  id: string;
  name: string;
  avatar: string;
  role: string;
  traits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  skills: string[];
  memory: MemoryItem[];
  behavior: BehaviorPattern[];
  color: string;
  status: "active" | "thinking" | "interacting" | "resting";
}

/**
 * 记忆项接口
 */
interface MemoryItem {
  id: string;
  content: string;
  type: "fact" | "event" | "emotion" | "decision";
  importance: number;
  timestamp: Date;
}

/**
 * 行为模式接口
 */
interface BehaviorPattern {
  id: string;
  name: string;
  frequency: number;
  lastTriggered: Date;
  outcomes: string[];
}

/**
 * 预设智能体列表
 */
const PRESET_AGENTS: AgentPersonality[] = [
  {
    id: "agent-1",
    name: "艾达",
    avatar: "👩‍🔬",
    role: "数据科学家",
    traits: { openness: 92, conscientiousness: 88, extraversion: 45, agreeableness: 67, neuroticism: 23 },
    skills: ["数据分析", "机器学习", "可视化", "Python"],
    memory: [],
    behavior: [],
    color: "#00FF41",
    status: "active",
  },
  {
    id: "agent-2",
    name: "马克",
    avatar: "👨‍💼",
    role: "产品经理",
    traits: { openness: 78, conscientiousness: 82, extraversion: 91, agreeableness: 73, neuroticism: 35 },
    skills: ["战略规划", "用户研究", "团队协作", "演讲"],
    memory: [],
    behavior: [],
    color: "#00D4FF",
    status: "thinking",
  },
  {
    id: "agent-3",
    name: "琳达",
    avatar: "👩‍🎨",
    role: "创意总监",
    traits: { openness: 95, conscientiousness: 56, extraversion: 72, agreeableness: 81, neuroticism: 48 },
    skills: ["视觉设计", "品牌策略", "用户洞察", "创新思维"],
    memory: [],
    behavior: [],
    color: "#BD00FF",
    status: "interacting",
  },
  {
    id: "agent-4",
    name: "杰克",
    avatar: "👨‍💻",
    role: "全栈工程师",
    traits: { openness: 67, conscientiousness: 94, extraversion: 38, agreeableness: 52, neuroticism: 41 },
    skills: ["系统架构", "前端开发", "后端开发", "DevOps"],
    memory: [],
    behavior: [],
    color: "#FF00E5",
    status: "resting",
  },
  {
    id: "agent-5",
    name: "苏菲",
    avatar: "👩‍🏫",
    role: "教育顾问",
    traits: { openness: 84, conscientiousness: 79, extraversion: 88, agreeableness: 94, neuroticism: 29 },
    skills: ["课程设计", "学习科学", "沟通技巧", "心理学"],
    memory: [],
    behavior: [],
    color: "#FFD700",
    status: "active",
  },
  {
    id: "agent-6",
    name: "大卫",
    avatar: "👨‍⚕️",
    role: "心理咨询师",
    traits: { openness: 89, conscientiousness: 73, extraversion: 65, agreeableness: 96, neuroticism: 32 },
    skills: ["心理分析", "情绪管理", "沟通治疗", "危机干预"],
    memory: [],
    behavior: [],
    color: "#FF6B6B",
    status: "thinking",
  },
];

/**
 * 智能体个性系统组件
 */
export default function AgentPersonalitySystem() {
  const [agents, setAgents] = useState<AgentPersonality[]>(PRESET_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentPersonality | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "network">("grid");
  const [simulationTime, setSimulationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulationTime((prev) => prev + 1);
      setAgents((prevAgents) =>
        prevAgents.map((agent) => ({
          ...agent,
          status: ["active", "thinking", "interacting", "resting"][
            Math.floor(Math.random() * 4)
          ] as AgentPersonality["status"],
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    active: "#00FF41",
    thinking: "#00D4FF",
    interacting: "#BD00FF",
    resting: "#71717a",
  };

  const statusLabels = {
    active: "活跃",
    thinking: "思考中",
    interacting: "交互中",
    resting: "休息",
  };

  const traitLabels = {
    openness: "开放性",
    conscientiousness: "尽责性",
    extraversion: "外向性",
    agreeableness: "宜人性",
    neuroticism: "神经质",
  };

  const activeCount = useMemo(
    () => agents.filter((a) => a.status === "active" || a.status === "interacting").length,
    [agents]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl border border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30">
              <Users className="w-5 h-5 text-[#00FF41]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                智能体个性系统
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                {agents.length} 个智能体 · {activeCount} 个活跃
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-400 font-mono">
                T+{simulationTime}s
              </span>
            </div>
            <motion.button
              onClick={() => setViewMode(viewMode === "grid" ? "network" : "grid")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <Eye className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {agents.map((agent) => (
            <motion.button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-4 rounded-xl border transition-all ${
                selectedAgent?.id === agent.id
                  ? "border-white/30 bg-zinc-900"
                  : "border-zinc-800/50 hover:border-zinc-700"
              }`}
              style={{
                boxShadow:
                  selectedAgent?.id === agent.id
                    ? `0 0 20px ${agent.color}30`
                    : undefined,
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2"
                  style={{
                    backgroundColor: `${agent.color}15`,
                    border: `2px solid ${agent.color}40`,
                  }}
                >
                  {agent.avatar}
                </div>
                <span className="text-sm font-medium text-white mb-1">{agent.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">{agent.role}</span>
                <div
                  className="mt-2 px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    backgroundColor: `${statusColors[agent.status]}20`,
                    color: statusColors[agent.status],
                  }}
                >
                  {statusLabels[agent.status]}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              key={selectedAgent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      backgroundColor: `${selectedAgent.color}15`,
                      border: `2px solid ${selectedAgent.color}40`,
                    }}
                  >
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedAgent.name}</h4>
                    <p className="text-sm text-zinc-500 font-mono">{selectedAgent.role}</p>
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-lg text-xs font-mono"
                  style={{
                    backgroundColor: `${statusColors[selectedAgent.status]}20`,
                    color: statusColors[selectedAgent.status],
                  }}
                >
                  {statusLabels[selectedAgent.status]}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-zinc-500 font-mono mb-2">性格特质 (OCEAN)</p>
                <div className="space-y-2">
                  {Object.entries(selectedAgent.traits).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-16 font-mono">
                        {traitLabels[key as keyof typeof traitLabels]}
                      </span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: selectedAgent.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 font-mono w-8">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-zinc-500 font-mono mb-2">核心技能</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-lg text-xs font-mono"
                      style={{
                        backgroundColor: `${selectedAgent.color}10`,
                        border: `1px solid ${selectedAgent.color}30`,
                        color: selectedAgent.color,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
                <div className="text-center">
                  <Activity className="w-4 h-4 text-[#00FF41] mx-auto mb-1" />
                  <p className="text-lg font-['Syne'] font-bold text-white">128</p>
                  <p className="text-[10px] text-zinc-500 font-mono">决策次数</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-4 h-4 text-[#00D4FF] mx-auto mb-1" />
                  <p className="text-lg font-['Syne'] font-bold text-white">47</p>
                  <p className="text-[10px] text-zinc-500 font-mono">交互次数</p>
                </div>
                <div className="text-center">
                  <Star className="w-4 h-4 text-[#FFD700] mx-auto mb-1" />
                  <p className="text-lg font-['Syne'] font-bold text-white">92%</p>
                  <p className="text-[10px] text-zinc-500 font-mono">成功率</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF41]" />
              活跃
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
              思考
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BD00FF]" />
              交互
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              休息
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            独立个性 · 长期记忆 · 行为逻辑
          </span>
        </div>
      </div>
    </motion.div>
  );
}
