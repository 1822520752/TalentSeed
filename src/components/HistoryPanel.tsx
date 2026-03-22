"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, Clock, Trash2, Download, Share2, Sparkles, Crown, ChevronRight, X
} from "lucide-react";
import { SimulationResult } from "@/lib/api";

/**
 * 历史记录项接口
 */
interface HistoryRecord extends SimulationResult {
  timestamp: string;
  input: string;
}

/**
 * 历史记录面板属性
 */
interface HistoryPanelProps {
  onSelectRecord?: (record: HistoryRecord) => void;
  onClose?: () => void;
}

/**
 * 历史记录管理工具函数
 */
export const historyUtils = {
  getRecords: (): HistoryRecord[] => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("talentSwarm_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  
  saveRecord: (result: SimulationResult, input: string): HistoryRecord[] => {
    const records = historyUtils.getRecords();
    const newRecord: HistoryRecord = {
      ...result,
      timestamp: new Date().toISOString(),
      input,
    };
    const updated = [newRecord, ...records].slice(0, 10);
    localStorage.setItem("talentSwarm_history", JSON.stringify(updated));
    return updated;
  },
  
  clearRecords: () => {
    localStorage.removeItem("talentSwarm_history");
  },
  
  exportRecords: (records: HistoryRecord[]) => {
    const data = JSON.stringify(records, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talentswarm_history_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  shareRecord: async (record: HistoryRecord) => {
    const text = `我的核心天赋: ${record.coreTalent}\n\n平行宇宙存活率: ${record.stats.survivalRate}%\n心流指数: ${record.stats.flowIndex}/10\n\n由 TalentSwarm AI 分析生成`;
    if (navigator.share) {
      await navigator.share({ title: "TalentSwarm 分析结果", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  },
};

/**
 * 历史记录面板组件
 */
export default function HistoryPanel({ onSelectRecord, onClose }: HistoryPanelProps) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  
  useEffect(() => {
    setRecords(historyUtils.getRecords());
  }, []);
  
  const handleClear = () => {
    historyUtils.clearRecords();
    setRecords([]);
  };
  
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("zh-CN", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0f]/95 backdrop-blur-xl border-l border-zinc-800/50 z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#BD00FF]/10 border border-[#BD00FF]/30">
              <History className="w-5 h-5 text-[#BD00FF]" />
            </div>
            <div>
              <h2 className="text-lg font-['Syne'] font-semibold text-white">历史记录</h2>
              <p className="text-xs text-zinc-500 font-mono">{records.length} 条分析记录</p>
            </div>
          </div>
          
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </motion.button>
        </div>
        
        {records.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <motion.button
              onClick={() => historyUtils.exportRecords(records)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-[#00D4FF]/50 text-xs text-zinc-400 hover:text-[#00D4FF] font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              导出全部
            </motion.button>
            
            <motion.button
              onClick={handleClear}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-red-500/50 text-xs text-zinc-400 hover:text-red-400 font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清空
            </motion.button>
          </div>
        )}
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {records.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                  <History className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm mb-2">暂无历史记录</p>
                <p className="text-zinc-600 text-xs font-mono">完成分析后将自动保存</p>
              </motion.div>
            ) : (
              records.map((record, index) => (
                <motion.div
                  key={record.timestamp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, x: -4 }}
                  onClick={() => onSelectRecord?.(record)}
                  className="group cursor-pointer p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-[#00FF41]/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF41]/20 to-[#00D4FF]/20 border border-[#00FF41]/30 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1 truncate">
                        {record.coreTalent}
                      </h3>
                      <p className="text-xs text-zinc-500 mb-2 line-clamp-1">
                        {record.input}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-600 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(record.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#00FF41]" />
                          {record.stats.survivalRate}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          historyUtils.shareRecord(record);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                      </motion.button>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
