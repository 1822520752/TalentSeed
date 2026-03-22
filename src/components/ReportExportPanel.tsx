"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Share2, Copy, Check, X, FileText, Printer,
  Mail, Link2, Twitter, Linkedin, Facebook
} from "lucide-react";
import { SimulationResult } from "@/lib/api";

/**
 * 报告导出面板属性接口
 */
interface ReportExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult;
}

/**
 * 报告格式类型
 */
type ExportFormat = "pdf" | "json" | "image" | "share";

/**
 * 报告导出面板组件
 */
export default function ReportExportPanel({
  isOpen,
  onClose,
  result,
}: ReportExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const formats = [
    { id: "pdf", label: "PDF 报告", icon: <FileText className="w-5 h-5" />, description: "完整的专业报告文档" },
    { id: "json", label: "JSON 数据", icon: <Download className="w-5 h-5" />, description: "原始分析数据" },
    { id: "image", label: "图片分享", icon: <Share2 className="w-5 h-5" />, description: "生成分享图片" },
    { id: "share", label: "链接分享", icon: <Link2 className="w-5 h-5" />, description: "生成可分享链接" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (selectedFormat === "json") {
      const dataStr = JSON.stringify(result, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportName = `talent-report-${Date.now()}.json`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportName);
      linkElement.click();
    } else if (selectedFormat === "share") {
      setShareLink(`https://talentswarm.app/share/${btoa(JSON.stringify({ talent: result.coreTalent, timestamp: Date.now() }))}`);
    }

    setIsExporting(false);
    setExportComplete(true);
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0a0a0f]/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 0 60px rgba(0, 255, 65, 0.1)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30">
                <Download className="w-5 h-5 text-[#00FF41]" />
              </div>
              <div>
                <h3 className="text-lg font-['Syne'] font-semibold text-white">
                  导出报告
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  选择导出格式
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </motion.button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <motion.button
                  key={format.id}
                  onClick={() => {
                    setSelectedFormat(format.id as ExportFormat);
                    setExportComplete(false);
                    setShareLink("");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedFormat === format.id
                      ? "border-[#00FF41]/50 bg-[#00FF41]/5"
                      : "border-zinc-800/50 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedFormat === format.id
                          ? "bg-[#00FF41]/20 text-[#00FF41]"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {format.icon}
                    </div>
                    <span
                      className={`font-medium ${
                        selectedFormat === format.id ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {format.label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    {format.description}
                  </p>
                </motion.button>
              ))}
            </div>

            {selectedFormat === "share" && exportComplete && shareLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/50"
              >
                <p className="text-xs text-zinc-500 font-mono mb-2">分享链接已生成</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-mono truncate"
                  />
                  <motion.button
                    onClick={handleCopyLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-[#00FF41]/20 border border-[#00FF41]/30"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#00FF41]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#00FF41]" />
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    <span className="text-xs text-zinc-400 font-mono">Twitter</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-xs text-zinc-400 font-mono">LinkedIn</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                    <span className="text-xs text-zinc-400 font-mono">Facebook</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <motion.button
                onClick={handlePrint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-colors text-zinc-400 font-mono text-sm"
              >
                <Printer className="w-4 h-4" />
                打印
              </motion.button>
              <motion.button
                onClick={handleExport}
                disabled={isExporting}
                whileHover={{ scale: isExporting ? 1 : 1.02 }}
                whileTap={{ scale: isExporting ? 1 : 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF41] to-emerald-500 text-black font-['Syne'] font-semibold text-sm shadow-lg shadow-[#00FF41]/20 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.div>
                    导出中...
                  </>
                ) : exportComplete ? (
                  <>
                    <Check className="w-4 h-4" />
                    导出完成
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    导出报告
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="px-6 py-3 border-t border-zinc-800/50 bg-zinc-900/30">
            <p className="text-xs text-zinc-600 font-mono text-center">
              报告包含完整的天赋分析、职业匹配和行动建议
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
