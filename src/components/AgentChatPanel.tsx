"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, User, X, Minimize2, Maximize2,
  Loader2
} from "lucide-react";

/**
 * 智能体接口定义
 */
interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
}

/**
 * 消息接口定义
 */
interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

/**
 * 预设智能体列表
 */
const AGENTS: Agent[] = [
  { id: "mentor", name: "天赋导师", role: "Talent Mentor", avatar: "🧙", color: "#00FF41", description: "深度解析你的核心天赋，发现独特价值" },
  { id: "analyst", name: "数据分析师", role: "Data Analyst", avatar: "📊", color: "#00D4FF", description: "分析你的演化数据，提供客观评估" },
  { id: "scout", name: "职业侦察兵", role: "Career Scout", avatar: "🔍", color: "#BD00FF", description: "探索职业机会，发现发展路径" },
  { id: "coach", name: "成长教练", role: "Growth Coach", avatar: "🎯", color: "#FF00E5", description: "制定行动计划，激励你采取行动" },
];

/**
 * AgentChatPanel 属性接口
 */
interface AgentChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  talentLabel: string;
  talentDescription?: string;
}

/**
 * 多智能体对话面板组件 - 连接真实AI API
 */
export default function AgentChatPanel({
  isOpen,
  onClose,
  talentLabel,
  talentDescription,
}: AgentChatPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          agentId: selectedAgent.id,
          content: `你好！我是${selectedAgent.name}。我看到你的核心天赋是「${talentLabel}」。有什么想了解的吗？`,
          timestamp: new Date(),
          isUser: false,
        },
      ]);
    }
  }, [isOpen, selectedAgent.id, selectedAgent.name, talentLabel, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  /**
   * 发送消息到AI API
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      agentId: selectedAgent.id,
      content: inputValue,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          message: inputValue,
          talentContext: `核心天赋：${talentLabel}。描述：${talentDescription || ""}`,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.isUser ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.reply) {
        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          agentId: selectedAgent.id,
          content: data.data.reply,
          timestamp: new Date(),
          isUser: false,
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        throw new Error(data.error || "请求失败");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        agentId: selectedAgent.id,
        content: "抱歉，我暂时无法回应。请稍后再试。",
        timestamp: new Date(),
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentChange = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages([
      {
        id: `switch-${Date.now()}`,
        agentId: agent.id,
        content: `你好！我是${agent.name}，${agent.description}。有什么我可以帮助你的？`,
        timestamp: new Date(),
        isUser: false,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className={`fixed z-50 ${
          isMinimized
            ? "bottom-4 right-4 w-80"
            : "bottom-4 right-4 w-[400px] max-w-[calc(100vw-2rem)]"
        }`}
      >
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: "rgba(10, 10, 15, 0.95)",
            borderColor: `${selectedAgent.color}30`,
            boxShadow: `0 0 40px ${selectedAgent.color}20`,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: `${selectedAgent.color}20` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{
                  backgroundColor: `${selectedAgent.color}20`,
                  border: `1px solid ${selectedAgent.color}40`,
                }}
              >
                {selectedAgent.avatar}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{selectedAgent.name}</h4>
                <p className="text-xs text-zinc-500 font-mono">{selectedAgent.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => setIsMinimized(!isMinimized)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-zinc-400" />
                )}
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </motion.button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-800/50 overflow-x-auto">
                {AGENTS.map((agent) => (
                  <motion.button
                    key={agent.id}
                    onClick={() => handleAgentChange(agent)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                      selectedAgent.id === agent.id ? "border" : "border border-transparent hover:border-zinc-700"
                    }`}
                    style={{
                      backgroundColor: selectedAgent.id === agent.id ? `${agent.color}15` : "transparent",
                      borderColor: selectedAgent.id === agent.id ? `${agent.color}40` : undefined,
                      color: selectedAgent.id === agent.id ? agent.color : "#71717a",
                    }}
                  >
                    <span>{agent.avatar}</span>
                    <span>{agent.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="h-[300px] overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.isUser ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: message.isUser ? "#27272a" : `${selectedAgent.color}20`,
                      }}
                    >
                      {message.isUser ? (
                        <User className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <span className="text-sm">{selectedAgent.avatar}</span>
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        message.isUser
                          ? "bg-[#00FF41]/10 border border-[#00FF41]/20 text-white"
                          : "bg-zinc-800/50 text-zinc-300"
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-zinc-500"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>思考中...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="输入你的问题..."
                    className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    whileHover={{ scale: inputValue.trim() && !isLoading ? 1.05 : 1 }}
                    whileTap={{ scale: inputValue.trim() && !isLoading ? 0.95 : 1 }}
                    className="p-2 rounded-xl transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: inputValue.trim() ? `${selectedAgent.color}20` : "#27272a",
                      border: `1px solid ${inputValue.trim() ? `${selectedAgent.color}40` : "#3f3f46"}`,
                    }}
                  >
                    <Send className="w-4 h-4" style={{ color: inputValue.trim() ? selectedAgent.color : "#71717a" }} />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
