"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Sliders, Zap, Target, Users, Globe, Clock,
  Play, Pause, RotateCcw, Sparkles, TrendingUp, AlertTriangle,
  Eye, Layers, Activity
} from "lucide-react";

/**
 * 变量注入接口
 */
interface InjectedVariable {
  id: string;
  name: string;
  type: "resource" | "event" | "policy" | "trend";
  value: number;
  min: number;
  max: number;
  unit: string;
  impact: string;
  color: string;
}

/**
 * 预设变量
 */
const DEFAULT_VARIABLES: InjectedVariable[] = [
  {
    id: "var-1",
    name: "资源投入",
    type: "resource",
    value: 50,
    min: 0,
    max: 100,
    unit: "%",
    impact: "影响所有智能体的行动能力",
    color: "#00FF41",
  },
  {
    id: "var-2",
    name: "市场波动",
    type: "trend",
    value: 30,
    min: 0,
    max: 100,
    unit: "指数",
    impact: "影响经济类决策的成功率",
    color: "#00D4FF",
  },
  {
    id: "var-3",
    name: "政策干预",
    type: "policy",
    value: 20,
    min: 0,
    max: 100,
    unit: "%",
    impact: "改变规则约束强度",
    color: "#BD00FF",
  },
  {
    id: "var-4",
    name: "突发事件",
    type: "event",
    value: 0,
    min: 0,
    max: 100,
    unit: "强度",
    impact: "触发随机危机或机遇",
    color: "#FF6B6B",
  },
];

/**
 * 上帝视角控制面板组件
 */
export default function GodModePanel() {
  const [variables, setVariables] = useState<InjectedVariable[]>(DEFAULT_VARIABLES);
  const [isRunning, setIsRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [activeScenarios, setActiveScenarios] = useState<string[]>(["baseline"]);
  const [alerts, setAlerts] = useState<{ id: string; message: string; type: "warning" | "info" | "success" }[]>([]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const alertTypes: ("warning" | "info" | "success")[] = ["warning", "info", "success"];
        const messages = [
          "检测到智能体协作模式变化",
          "资源分配效率提升 15%",
          "涌现出新的行为策略",
          "市场波动影响扩散中",
          "政策干预产生连锁反应",
        ];
        const newAlert = {
          id: `alert-${Date.now()}`,
          message: messages[Math.floor(Math.random() * messages.length)],
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        };
        setAlerts((prev) => [...prev.slice(-4), newAlert]);
      }
    }, 3000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  const handleVariableChange = (id: string, value: number) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value } : v))
    );
  };

  const handleInjectCrisis = () => {
    setVariables((prev) =>
      prev.map((v) =>
        v.id === "var-4" ? { ...v, value: Math.min(v.value + 30, 100) } : v
      )
    );
    setAlerts((prev) => [
      ...prev,
      {
        id: `crisis-${Date.now()}`,
        message: "🚨 危机事件已注入！智能体正在响应...",
        type: "warning",
      },
    ]);
  };

  const handleReset = () => {
    setVariables(DEFAULT_VARIABLES);
    setAlerts([]);
    setActiveScenarios(["baseline"]);
  };

  const scenarioOptions = [
    { id: "baseline", label: "基准情景", color: "#00FF41" },
    { id: "optimistic", label: "乐观情景", color: "#00D4FF" },
    { id: "pessimistic", label: "悲观情景", color: "#FF6B6B" },
    { id: "custom", label: "自定义", color: "#BD00FF" },
  ];

  const alertColors = {
    warning: "#FFD700",
    info: "#00D4FF",
    success: "#00FF41",
  };

  const typeIcons = {
    resource: <Layers className="w-4 h-4" />,
    event: <Zap className="w-4 h-4" />,
    policy: <Settings className="w-4 h-4" />,
    trend: <TrendingUp className="w-4 h-4" />,
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
            <div className="p-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
              <Eye className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                上帝视角
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                动态变量注入 · 精准投影
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <span className="text-xs text-zinc-400 font-mono">速度: {simulationSpeed}x</span>
            </div>
            <motion.button
              onClick={() => setIsRunning(!isRunning)}
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
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-zinc-500 font-mono mb-3">情景模式</p>
          <div className="flex items-center gap-2">
            {scenarioOptions.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => {
                  if (activeScenarios.includes(scenario.id)) {
                    setActiveScenarios((prev) => prev.filter((s) => s !== scenario.id));
                  } else {
                    setActiveScenarios((prev) => [...prev, scenario.id]);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeScenarios.includes(scenario.id)
                    ? "border"
                    : "border border-zinc-800 hover:border-zinc-700"
                }`}
                style={{
                  backgroundColor: activeScenarios.includes(scenario.id)
                    ? `${scenario.color}15`
                    : undefined,
                  borderColor: activeScenarios.includes(scenario.id)
                    ? `${scenario.color}50`
                    : undefined,
                  color: activeScenarios.includes(scenario.id)
                    ? scenario.color
                    : "#71717a",
                }}
              >
                {scenario.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 font-mono">变量控制</p>
            {variables.map((variable) => (
              <motion.div
                key={variable.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: variable.color }}>{typeIcons[variable.type]}</span>
                    <span className="text-sm text-white">{variable.name}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${variable.color}20`,
                      color: variable.color,
                    }}
                  >
                    {variable.value} {variable.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={variable.min}
                  max={variable.max}
                  value={variable.value}
                  onChange={(e) => handleVariableChange(variable.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: variable.color,
                  }}
                />
                <p className="text-[10px] text-zinc-600 font-mono mt-2">{variable.impact}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-xs text-zinc-500 font-mono">实时警报</p>
            <div className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 h-[280px] overflow-y-auto">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <p className="text-xs text-zinc-600 font-mono text-center py-8">
                    系统运行正常，暂无警报...
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-2 p-2 rounded-lg mb-2"
                      style={{
                        backgroundColor: `${alertColors[alert.type]}10`,
                        borderLeft: `3px solid ${alertColors[alert.type]}`,
                      }}
                    >
                      {alert.type === "warning" ? (
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: alertColors[alert.type] }} />
                      ) : alert.type === "success" ? (
                        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: alertColors[alert.type] }} />
                      ) : (
                        <Activity className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: alertColors[alert.type] }} />
                      )}
                      <span className="text-xs text-zinc-300">{alert.message}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleInjectCrisis}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 transition-colors"
            >
              <Zap className="w-4 h-4 text-[#FF6B6B]" />
              <span className="text-sm text-[#FF6B6B] font-mono">注入危机事件</span>
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono">模拟速度:</span>
              <div className="flex items-center gap-1">
                {[0.5, 1, 2, 4].map((speed) => (
                  <motion.button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                      simulationSpeed === speed
                        ? "bg-[#00FF41]/20 text-[#00FF41]"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {speed}x
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span>上帝视角已激活</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
