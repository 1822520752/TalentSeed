/**
 * TalentSwarm 仿真引擎核心
 * 实现真正的多智能体仿真系统
 */

/**
 * 智能体个性特征 (OCEAN模型)
 */
export interface AgentTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

/**
 * 记忆项
 */
export interface MemoryItem {
  id: string;
  type: "fact" | "event" | "emotion" | "decision" | "interaction";
  content: string;
  importance: number;
  timestamp: number;
  decay: number;
  relatedAgents: string[];
  emotionalImpact: number;
}

/**
 * 智能体状态
 */
export type AgentStatus = "active" | "thinking" | "interacting" | "resting" | "deciding" | "learning";

/**
 * 智能体接口
 */
export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  traits: AgentTraits;
  skills: Map<string, number>;
  memory: MemoryItem[];
  status: AgentStatus;
  energy: number;
  motivation: number;
  relationships: Map<string, number>;
  currentPosition: { x: number; y: number };
  velocity: { x: number; y: number };
}

/**
 * 世界变量
 */
export interface WorldVariables {
  resourceLevel: number;
  marketVolatility: number;
  policyIntervention: number;
  crisisIntensity: number;
  timeSpeed: number;
}

/**
 * 世界事件
 */
export interface WorldEvent {
  id: string;
  type: "cooperation" | "competition" | "innovation" | "crisis" | "policy";
  description: string;
  impact: number;
  timestamp: number;
  involvedAgents: string[];
  duration: number;
  resolved: boolean;
}

/**
 * 涌现行为
 */
export interface EmergentBehavior {
  id: string;
  type: "swarm" | "polarization" | "innovation" | "collapse" | "alliance";
  description: string;
  agents: string[];
  strength: number;
  detected: number;
  predicted: boolean;
}

/**
 * 仿真统计
 */
export interface SimulationStatistics {
  totalInteractions: number;
  successfulDecisions: number;
  failedDecisions: number;
  emergentEventsDetected: number;
  averageAgentEnergy: number;
  averageAgentMotivation: number;
  cooperationIndex: number;
  competitionIndex: number;
  innovationIndex: number;
}

/**
 * 仿真状态
 */
export interface SimulationState {
  time: number;
  agents: Map<string, Agent>;
  variables: WorldVariables;
  events: WorldEvent[];
  emergentBehaviors: EmergentBehavior[];
  statistics: SimulationStatistics;
}

/**
 * 仿真引擎类
 */
export class SimulationEngine {
  private state: SimulationState;
  private isRunning: boolean = false;
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(state: SimulationState) => void> = new Set();

  constructor(initialVariables?: Partial<WorldVariables>) {
    this.state = {
      time: 0,
      agents: new Map(),
      variables: {
        resourceLevel: initialVariables?.resourceLevel ?? 50,
        marketVolatility: initialVariables?.marketVolatility ?? 30,
        policyIntervention: initialVariables?.policyIntervention ?? 20,
        crisisIntensity: initialVariables?.crisisIntensity ?? 0,
        timeSpeed: initialVariables?.timeSpeed ?? 1,
      },
      events: [],
      emergentBehaviors: [],
      statistics: this.createEmptyStatistics(),
    };
  }

  private createEmptyStatistics(): SimulationStatistics {
    return {
      totalInteractions: 0,
      successfulDecisions: 0,
      failedDecisions: 0,
      emergentEventsDetected: 0,
      averageAgentEnergy: 100,
      averageAgentMotivation: 100,
      cooperationIndex: 50,
      competitionIndex: 50,
      innovationIndex: 50,
    };
  }

  /**
   * 添加智能体
   */
  addAgent(agentData: Partial<Agent>): Agent {
    const agent: Agent = {
      id: agentData.id || `agent-${Date.now()}`,
      name: agentData.name || "Unknown",
      role: agentData.role || "Agent",
      avatar: agentData.avatar || "🤖",
      color: agentData.color || "#00FF41",
      traits: agentData.traits || { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 },
      skills: agentData.skills || new Map(),
      memory: agentData.memory || [],
      status: agentData.status || "active",
      energy: agentData.energy ?? 100,
      motivation: agentData.motivation ?? 100,
      relationships: agentData.relationships || new Map(),
      currentPosition: agentData.currentPosition || { x: Math.random() * 500 + 50, y: Math.random() * 300 + 50 },
      velocity: { x: 0, y: 0 },
    };

    this.state.agents.set(agent.id, agent);
    this.updateStatistics();
    this.notifyListeners();
    return agent;
  }

  /**
   * 更新变量
   */
  updateVariables(variables: Partial<WorldVariables>): void {
    this.state.variables = { ...this.state.variables, ...variables };
    this.processVariableChanges();
    this.notifyListeners();
  }

  /**
   * 处理变量变化对智能体的影响
   */
  private processVariableChanges(): void {
    const { resourceLevel, marketVolatility, crisisIntensity } = this.state.variables;

    this.state.agents.forEach((agent) => {
      if (resourceLevel < 30) {
        agent.energy = Math.max(0, agent.energy - 5);
        agent.motivation = Math.max(0, agent.motivation - 3);
      } else if (resourceLevel > 70) {
        agent.energy = Math.min(100, agent.energy + 2);
        agent.motivation = Math.min(100, agent.motivation + 1);
      }

      if (marketVolatility > 60) {
        agent.traits.neuroticism = Math.min(100, agent.traits.neuroticism + 0.5);
      }

      if (crisisIntensity > 50) {
        if (agent.traits.conscientiousness > 60) {
          agent.status = "deciding";
        } else if (agent.traits.extraversion > 60) {
          agent.status = "interacting";
        }
        this.addMemory(agent.id, "event", `危机爆发! 强度: ${crisisIntensity}%`, 90, -20);
      }
    });
  }

  /**
   * 添加记忆
   */
  private addMemory(
    agentId: string,
    type: MemoryItem["type"],
    content: string,
    importance: number,
    emotionalImpact: number
  ): void {
    const agent = this.state.agents.get(agentId);
    if (!agent) return;

    agent.memory.push({
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      importance,
      timestamp: this.state.time,
      decay: 0.05,
      relatedAgents: [],
      emotionalImpact,
    });

    if (agent.memory.length > 100) {
      agent.memory.sort((a, b) => b.importance - a.importance);
      agent.memory = agent.memory.slice(0, 100);
    }
  }

  /**
   * 启动仿真
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tickInterval = setInterval(() => this.tick(), 1000 / this.state.variables.timeSpeed);
  }

  /**
   * 停止仿真
   */
  stop(): void {
    this.isRunning = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  /**
   * 仿真步进
   */
  private tick(): void {
    this.state.time++;

    this.state.agents.forEach((agent) => {
      this.processAgentBehavior(agent);
      this.decayMemories(agent);
      this.updateAgentPosition(agent);
    });

    this.detectEmergentBehaviors();
    this.processEvents();
    this.updateStatistics();
    this.notifyListeners();
  }

  /**
   * 处理智能体行为
   */
  private processAgentBehavior(agent: Agent): void {
    const decision = this.makeDecision(agent);

    switch (decision) {
      case "interact":
        this.initiateInteraction(agent);
        break;
      case "rest":
        agent.status = "resting";
        agent.energy = Math.min(100, agent.energy + 10);
        break;
      case "learn":
        agent.status = "learning";
        agent.energy = Math.max(0, agent.energy - 8);
        break;
      case "decide":
        agent.status = "deciding";
        this.processDecision(agent);
        break;
      default:
        agent.status = "active";
    }

    if (agent.energy < 20) {
      agent.status = "resting";
    }
  }

  /**
   * 做出决策
   */
  private makeDecision(agent: Agent): string {
    const { resourceLevel, crisisIntensity } = this.state.variables;

    const scores: Record<string, number> = {
      interact: (agent.traits.extraversion / 100) * 0.3,
      rest: ((100 - agent.energy) / 100) * 0.4,
      learn: (agent.traits.openness / 100) * 0.3,
      decide: (agent.traits.conscientiousness / 100) * 0.3,
    };

    if (resourceLevel < 30) scores.rest *= 1.5;
    if (crisisIntensity > 50) {
      scores.decide *= 1.5;
      scores.interact *= 1.3;
    }

    const maxScore = Math.max(...Object.values(scores));
    for (const [action, score] of Object.entries(scores)) {
      if (score === maxScore) return action;
    }

    return "active";
  }

  /**
   * 发起交互
   */
  private initiateInteraction(agent: Agent): void {
    const others = Array.from(this.state.agents.values()).filter(
      (a) => a.id !== agent.id && a.status !== "resting"
    );

    if (others.length === 0) return;

    const target = others[Math.floor(Math.random() * others.length)];
    agent.status = "interacting";
    target.status = "interacting";

    const relationship = agent.relationships.get(target.id) || 50;
    const success = Math.random() < (relationship / 100) * (agent.traits.agreeableness / 100);

    if (success) {
      this.state.statistics.totalInteractions++;
      this.state.statistics.successfulDecisions++;

      agent.relationships.set(target.id, Math.min(100, relationship + 5));
      target.relationships.set(agent.id, Math.min(100, (target.relationships.get(agent.id) || 50) + 5));

      this.addMemory(agent.id, "interaction", `与 ${target.name} 成功协作`, 60, 10);
      this.addMemory(target.id, "interaction", `与 ${agent.name} 成功协作`, 60, 10);

      if (Math.random() > 0.7) {
        this.createEvent("cooperation", `${agent.name} 与 ${target.name} 形成协作`, [agent.id, target.id]);
      }
    } else {
      this.state.statistics.failedDecisions++;
      agent.relationships.set(target.id, Math.max(0, relationship - 3));
    }

    agent.energy = Math.max(0, agent.energy - 5);
  }

  /**
   * 处理决策
   */
  private processDecision(agent: Agent): void {
    const { crisisIntensity, marketVolatility } = this.state.variables;

    let quality = agent.traits.conscientiousness / 100;
    if (crisisIntensity > 50) quality *= 0.7;
    if (marketVolatility > 60) quality *= 0.8;

    const success = Math.random() < quality;

    if (success) {
      this.state.statistics.successfulDecisions++;
      agent.motivation = Math.min(100, agent.motivation + 10);
      this.addMemory(agent.id, "decision", "成功决策", 80, 15);
    } else {
      this.state.statistics.failedDecisions++;
      agent.motivation = Math.max(0, agent.motivation - 5);
      agent.traits.neuroticism = Math.min(100, agent.traits.neuroticism + 2);
    }

    agent.energy = Math.max(0, agent.energy - 10);
  }

  /**
   * 记忆衰减
   */
  private decayMemories(agent: Agent): void {
    agent.memory = agent.memory
      .map((m) => ({ ...m, importance: m.importance * (1 - m.decay) }))
      .filter((m) => m.importance > 5);
  }

  /**
   * 更新智能体位置
   */
  private updateAgentPosition(agent: Agent): void {
    if (agent.status === "interacting") {
      const nearest = this.findNearestAgent(agent);
      if (nearest) {
        const dx = nearest.currentPosition.x - agent.currentPosition.x;
        const dy = nearest.currentPosition.y - agent.currentPosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 50) {
          agent.velocity.x = (dx / dist) * 2;
          agent.velocity.y = (dy / dist) * 2;
        }
      }
    } else {
      agent.velocity.x *= 0.9;
      agent.velocity.y *= 0.9;
      if (Math.random() > 0.95) {
        agent.velocity.x = (Math.random() - 0.5) * 2;
        agent.velocity.y = (Math.random() - 0.5) * 2;
      }
    }

    agent.currentPosition.x = Math.max(50, Math.min(550, agent.currentPosition.x + agent.velocity.x));
    agent.currentPosition.y = Math.max(50, Math.min(350, agent.currentPosition.y + agent.velocity.y));
  }

  /**
   * 找到最近的智能体
   */
  private findNearestAgent(agent: Agent): Agent | null {
    let nearest: Agent | null = null;
    let minDist = Infinity;

    this.state.agents.forEach((other) => {
      if (other.id === agent.id) return;
      const dx = other.currentPosition.x - agent.currentPosition.x;
      const dy = other.currentPosition.y - agent.currentPosition.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = other;
      }
    });

    return nearest;
  }

  /**
   * 检测涌现行为
   */
  private detectEmergentBehaviors(): void {
    const agents = Array.from(this.state.agents.values());

    const interacting = agents.filter((a) => a.status === "interacting");
    if (interacting.length >= 3) {
      const existing = this.state.emergentBehaviors.find((b) => b.type === "swarm" && !b.predicted);
      if (!existing) {
        this.state.emergentBehaviors.push({
          id: `em-${Date.now()}`,
          type: "swarm",
          description: `群体协作: ${interacting.map((a) => a.name).join(", ")}`,
          agents: interacting.map((a) => a.id),
          strength: interacting.length / agents.length,
          detected: this.state.time,
          predicted: false,
        });
        this.state.statistics.emergentEventsDetected++;
      }
    }

    const avgRel = agents.reduce((sum, a) => {
      const rels = Array.from(a.relationships.values());
      return sum + (rels.length > 0 ? rels.reduce((s, r) => s + r, 0) / rels.length : 50);
    }, 0) / agents.length;

    this.state.statistics.cooperationIndex = avgRel;
    this.state.statistics.competitionIndex = agents.reduce((s, a) => s + a.traits.neuroticism, 0) / agents.length;
    this.state.statistics.innovationIndex = agents.reduce((s, a) => s + a.traits.openness, 0) / agents.length;
  }

  /**
   * 创建事件
   */
  private createEvent(type: WorldEvent["type"], description: string, involvedAgents: string[]): void {
    this.state.events.push({
      id: `event-${Date.now()}`,
      type,
      description,
      impact: 50,
      timestamp: this.state.time,
      involvedAgents,
      duration: 5,
      resolved: false,
    });
  }

  /**
   * 处理事件
   */
  private processEvents(): void {
    this.state.events = this.state.events.filter((event) => {
      if (this.state.time - event.timestamp > event.duration) {
        event.resolved = true;
        return false;
      }
      return true;
    });
  }

  /**
   * 更新统计
   */
  private updateStatistics(): void {
    const agents = Array.from(this.state.agents.values());
    if (agents.length > 0) {
      this.state.statistics.averageAgentEnergy = agents.reduce((s, a) => s + a.energy, 0) / agents.length;
      this.state.statistics.averageAgentMotivation = agents.reduce((s, a) => s + a.motivation, 0) / agents.length;
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener: (state: SimulationState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 获取当前状态
   */
  getState(): SimulationState {
    return this.state;
  }

  /**
   * 注入危机
   */
  injectCrisis(intensity: number): void {
    this.state.variables.crisisIntensity = Math.min(100, intensity);
    this.createEvent("crisis", `突发危机! 强度: ${intensity}%`, Array.from(this.state.agents.keys()));

    this.state.agents.forEach((agent) => {
      agent.traits.neuroticism = Math.min(100, agent.traits.neuroticism + 5);
      agent.motivation = Math.max(0, agent.motivation - 10);
      this.addMemory(agent.id, "event", "危机爆发! 需要快速响应", 100, -30);
    });

    this.notifyListeners();
  }

  /**
   * 获取智能体
   */
  getAgent(id: string): Agent | undefined {
    return this.state.agents.get(id);
  }

  /**
   * 获取所有智能体
   */
  getAllAgents(): Agent[] {
    return Array.from(this.state.agents.values());
  }

  /**
   * 是否运行中
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }
}

/**
 * 创建默认智能体
 */
export function createDefaultAgents(): Partial<Agent>[] {
  return [
    {
      id: "agent-1",
      name: "艾达",
      role: "数据科学家",
      avatar: "👩‍🔬",
      color: "#00FF41",
      traits: { openness: 92, conscientiousness: 88, extraversion: 45, agreeableness: 67, neuroticism: 23 },
      skills: new Map([["数据分析", 90], ["机器学习", 85]]),
      energy: 100,
      motivation: 90,
    },
    {
      id: "agent-2",
      name: "马克",
      role: "产品经理",
      avatar: "👨‍💼",
      color: "#00D4FF",
      traits: { openness: 78, conscientiousness: 82, extraversion: 91, agreeableness: 73, neuroticism: 35 },
      skills: new Map([["战略规划", 88], ["团队协作", 92]]),
      energy: 100,
      motivation: 85,
    },
    {
      id: "agent-3",
      name: "琳达",
      role: "创意总监",
      avatar: "👩‍🎨",
      color: "#BD00FF",
      traits: { openness: 95, conscientiousness: 56, extraversion: 72, agreeableness: 81, neuroticism: 48 },
      skills: new Map([["视觉设计", 95], ["创新思维", 90]]),
      energy: 100,
      motivation: 88,
    },
    {
      id: "agent-4",
      name: "杰克",
      role: "全栈工程师",
      avatar: "👨‍💻",
      color: "#FF00E5",
      traits: { openness: 67, conscientiousness: 94, extraversion: 38, agreeableness: 52, neuroticism: 41 },
      skills: new Map([["系统架构", 90], ["编程", 95]]),
      energy: 100,
      motivation: 80,
    },
    {
      id: "agent-5",
      name: "苏菲",
      role: "教育顾问",
      avatar: "👩‍🏫",
      color: "#FFD700",
      traits: { openness: 84, conscientiousness: 79, extraversion: 88, agreeableness: 94, neuroticism: 29 },
      skills: new Map([["课程设计", 85], ["沟通技巧", 95]]),
      energy: 100,
      motivation: 92,
    },
    {
      id: "agent-6",
      name: "大卫",
      role: "心理咨询师",
      avatar: "👨‍⚕️",
      color: "#FF6B6B",
      traits: { openness: 89, conscientiousness: 73, extraversion: 65, agreeableness: 96, neuroticism: 32 },
      skills: new Map([["心理分析", 90], ["情绪管理", 95]]),
      energy: 100,
      motivation: 88,
    },
  ];
}
