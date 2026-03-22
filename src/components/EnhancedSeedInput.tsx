"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, FileText, Link2, Upload, MessageCircle,
  Newspaper, TrendingUp, BookOpen, Zap, X, Plus,
  ChevronRight, AlertCircle, Check, Loader2
} from "lucide-react";

/**
 * 种子材料类型
 */
type SeedType = "text" | "url" | "file" | "news" | "trend" | "story";

/**
 * 种子材料接口
 */
interface SeedMaterial {
  id: string;
  type: SeedType;
  content: string;
  title?: string;
  source?: string;
  timestamp: Date;
  processed: boolean;
  insights?: string[];
}

/**
 * 种子类型配置
 */
const SEED_TYPE_CONFIG: Record<SeedType, { label: string; icon: React.ReactNode; color: string; placeholder: string }> = {
  text: {
    label: "文本描述",
    icon: <FileText className="w-4 h-4" />,
    color: "#00FF41",
    placeholder: "粘贴或输入文本内容...",
  },
  url: {
    label: "网页链接",
    icon: <Link2 className="w-4 h-4" />,
    color: "#00D4FF",
    placeholder: "输入网页 URL，系统将自动提取关键信息...",
  },
  file: {
    label: "文件上传",
    icon: <Upload className="w-4 h-4" />,
    color: "#BD00FF",
    placeholder: "支持 PDF、Word、TXT 等格式...",
  },
  news: {
    label: "新闻事件",
    icon: <Newspaper className="w-4 h-4" />,
    color: "#FFD700",
    placeholder: "描述一个新闻事件或社会现象...",
  },
  trend: {
    label: "趋势数据",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#FF00E5",
    placeholder: "输入趋势关键词或数据描述...",
  },
  story: {
    label: "故事背景",
    icon: <BookOpen className="w-4 h-4" />,
    color: "#FF6B6B",
    placeholder: "讲述一个故事或场景背景...",
  },
};

/**
 * 增强版种子输入系统组件
 */
export default function EnhancedSeedInput({
  onSubmit,
}: {
  onSubmit?: (seeds: SeedMaterial[]) => void;
}) {
  const [activeType, setActiveType] = useState<SeedType>("text");
  const [inputValue, setInputValue] = useState("");
  const [seeds, setSeeds] = useState<SeedMaterial[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddSeed = async () => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newSeed: SeedMaterial = {
      id: `seed-${Date.now()}`,
      type: activeType,
      content: inputValue,
      title: generateTitle(activeType, inputValue),
      source: activeType === "url" ? inputValue : undefined,
      timestamp: new Date(),
      processed: true,
      insights: generateInsights(activeType, inputValue),
    };

    setSeeds((prev) => [...prev, newSeed]);
    setInputValue("");
    setIsProcessing(false);
  };

  const handleRemoveSeed = (id: string) => {
    setSeeds((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = () => {
    if (seeds.length === 0) return;
    onSubmit?.(seeds);
  };

  const generateTitle = (type: SeedType, content: string): string => {
    const titles: Record<SeedType, string> = {
      text: "文本材料",
      url: "网页资源",
      file: "上传文件",
      news: "新闻事件",
      trend: "趋势数据",
      story: "故事背景",
    };
    return `${titles[type]} #${seeds.length + 1}`;
  };

  const generateInsights = (type: SeedType, content: string): string[] => {
    const insights: Record<SeedType, string[]> = {
      text: ["检测到关键信息", "提取核心概念", "建立语义关联"],
      url: ["解析网页结构", "提取关键内容", "识别信息来源"],
      file: ["解析文件格式", "提取文本内容", "建立索引"],
      news: ["识别事件类型", "提取时间线", "分析影响范围"],
      trend: ["识别趋势方向", "计算变化率", "预测发展"],
      story: ["提取故事要素", "识别角色关系", "构建情节线"],
    };
    return insights[type];
  };

  const typeKeys = Object.keys(SEED_TYPE_CONFIG) as SeedType[];

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
              <Sparkles className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-['Syne'] font-semibold text-white">
                种子信息输入
              </h3>
              <p className="text-xs text-zinc-500 font-mono">
                多源信息提取 · 智能解析
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 font-mono">
              {seeds.length} 个材料
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {typeKeys.map((type) => (
            <motion.button
              key={type}
              onClick={() => setActiveType(type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                activeType === type
                  ? "border"
                  : "border border-zinc-800 hover:border-zinc-700"
              }`}
              style={{
                backgroundColor: activeType === type ? `${SEED_TYPE_CONFIG[type].color}15` : undefined,
                borderColor: activeType === type ? `${SEED_TYPE_CONFIG[type].color}40` : undefined,
                color: activeType === type ? SEED_TYPE_CONFIG[type].color : "#71717a",
              }}
            >
              {SEED_TYPE_CONFIG[type].icon}
              {SEED_TYPE_CONFIG[type].label}
            </motion.button>
          ))}
        </div>

        <div className="relative mb-4">
          <div
            className="relative rounded-xl border transition-colors overflow-hidden"
            style={{
              borderColor: `${SEED_TYPE_CONFIG[activeType].color}30`,
              backgroundColor: `${SEED_TYPE_CONFIG[activeType].color}05`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50">
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <span style={{ color: SEED_TYPE_CONFIG[activeType].color }}>
                  {SEED_TYPE_CONFIG[activeType].icon}
                </span>
                <span>{SEED_TYPE_CONFIG[activeType].label}</span>
              </div>
              <span className="text-xs text-zinc-600 font-mono">
                {inputValue.length} / 5000
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={SEED_TYPE_CONFIG[activeType].placeholder}
              className="w-full h-32 bg-transparent text-zinc-200 placeholder-zinc-600 font-['Space_Grotesk'] text-sm p-4 resize-none focus:outline-none"
              maxLength={5000}
            />
          </div>

          <motion.button
            onClick={handleAddSeed}
            disabled={!inputValue.trim() || isProcessing}
            whileHover={{ scale: inputValue.trim() && !isProcessing ? 1.02 : 1 }}
            whileTap={{ scale: inputValue.trim() && !isProcessing ? 0.98 : 1 }}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all disabled:opacity-50"
            style={{
              backgroundColor: inputValue.trim() ? `${SEED_TYPE_CONFIG[activeType].color}20` : "#27272a",
              border: `1px solid ${inputValue.trim() ? `${SEED_TYPE_CONFIG[activeType].color}40` : "#3f3f46"}`,
              color: inputValue.trim() ? SEED_TYPE_CONFIG[activeType].color : "#71717a",
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                添加材料
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {seeds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <p className="text-xs text-zinc-500 font-mono mb-2">已添加材料</p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {seeds.map((seed) => (
                  <motion.div
                    key={seed.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-1.5 rounded-lg"
                        style={{
                          backgroundColor: `${SEED_TYPE_CONFIG[seed.type].color}20`,
                        }}
                      >
                        <span style={{ color: SEED_TYPE_CONFIG[seed.type].color }}>
                          {SEED_TYPE_CONFIG[seed.type].icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white">{seed.title}</p>
                        <p className="text-xs text-zinc-500 font-mono truncate max-w-[200px]">
                          {seed.content.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {seed.processed && (
                        <span className="px-2 py-0.5 rounded bg-[#00FF41]/10 text-[#00FF41] text-[10px] font-mono">
                          已解析
                        </span>
                      )}
                      <motion.button
                        onClick={() => handleRemoveSeed(seed.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded hover:bg-zinc-800 transition-colors"
                      >
                        <X className="w-4 h-4 text-zinc-500" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>材料越丰富，预测越精准</span>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={seeds.length === 0}
            whileHover={{ scale: seeds.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: seeds.length > 0 ? 0.98 : 1 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-['Syne'] font-semibold transition-all disabled:opacity-50"
            style={{
              background: seeds.length > 0
                ? `linear-gradient(135deg, #00FF41, #00D4FF)`
                : "#27272a",
              color: seeds.length > 0 ? "#000" : "#71717a",
            }}
          >
            <Zap className="w-4 h-4" />
            开始预测
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
