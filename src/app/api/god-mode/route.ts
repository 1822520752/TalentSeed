import { NextRequest, NextResponse } from "next/server";

/**
 * API 配置
 */
const API_CONFIG = {
  baseURL: "https://api.longcat.chat/openai",
  apiKey: process.env.OPENAI_API_KEY || "ak_2KO0NC2Mo49t4lG1dt3246JB0d04A",
  model: "LongCat-Flash-Chat",
};

/**
 * 上帝视角模拟引擎系统提示词
 */
const SYSTEM_PROMPT = `你是TalentSwarm的上帝视角模拟引擎。你的任务是根据注入的变量，模拟智能体世界的变化。

输入数据：
- talentData: 用户天赋数据
- variables: 注入的变量（资源投入、市场波动、政策干预、突发事件）

你需要返回以下JSON格式：
{
  "alerts": [
    {
      "id": "唯一标识",
      "type": "warning|info|success",
      "message": "警报信息",
      "timestamp": 时间戳
    }
  ],
  "agentUpdates": [
    {
      "id": "智能体id",
      "status": "active|thinking|interacting|resting",
      "activityChange": 活动变化值(-100到100),
      "newInsight": "新的洞察"
    }
  ],
  "worldEvents": [
    {
      "id": "唯一标识",
      "type": "cooperation|competition|innovation|crisis",
      "description": "事件描述",
      "impact": 影响程度(0-100),
      "involvedAgents": ["智能体id"]
    }
  ],
  "predictions": {
    "shortTerm": "短期预测（1-3个月）",
    "mediumTerm": "中期预测（3-12个月）",
    "longTerm": "长期预测（1-3年）"
  }
}

模拟规则：
1. 资源投入增加 → 智能体活跃度提升，协作增加
2. 市场波动增加 → 不确定性增加，竞争加剧
3. 政策干预增加 → 规则变化，需要适应
4. 突发事件增加 → 危机或机遇，快速响应

只返回JSON，不要有任何其他文字。`;

/**
 * 上帝视角模拟 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { talentData, variables, currentTime } = body as {
      talentData: {
        coreTalent: string;
        talentDescription: string;
        stats: Record<string, number>;
      };
      variables: {
        resourceLevel: number;
        marketVolatility: number;
        policyIntervention: number;
        crisisIntensity: number;
      };
      currentTime?: number;
    };

    if (!variables) {
      return NextResponse.json(
        { success: false, error: "缺少变量数据" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_CONFIG.baseURL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify({ talentData, variables, currentTime }) },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("God Mode API Error: - route.ts:110", errorText);
      return NextResponse.json(
        { success: false, error: "AI服务暂时不可用" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    let simulationData;
    try {
      simulationData = JSON.parse(content);
    } catch {
      simulationData = generateFallbackSimulation(variables);
    }

    return NextResponse.json({
      success: true,
      data: simulationData,
    });
  } catch (error) {
    console.error("God Mode API Error: - route.ts:132", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

/**
 * 生成备用模拟数据
 */
function generateFallbackSimulation(variables: {
  resourceLevel: number;
  marketVolatility: number;
  policyIntervention: number;
  crisisIntensity: number;
}) {
  const alerts: Array<{ id: string; type: "warning" | "info" | "success"; message: string; timestamp: number }> = [];

  if (variables.resourceLevel > 70) {
    alerts.push({
      id: `alert-${Date.now()}-1`,
      type: "success",
      message: "资源充足，智能体协作效率提升",
      timestamp: Date.now(),
    });
  }

  if (variables.marketVolatility > 60) {
    alerts.push({
      id: `alert-${Date.now()}-2`,
      type: "warning",
      message: "市场波动加剧，建议调整策略",
      timestamp: Date.now(),
    });
  }

  if (variables.crisisIntensity > 50) {
    alerts.push({
      id: `alert-${Date.now()}-3`,
      type: "warning",
      message: "检测到危机信号，智能体正在响应",
      timestamp: Date.now(),
    });
  }

  if (variables.policyIntervention > 40) {
    alerts.push({
      id: `alert-${Date.now()}-4`,
      type: "info",
      message: "政策环境变化，需要适应新规则",
      timestamp: Date.now(),
    });
  }

  const agentUpdates = [
    { id: "agent-1", status: variables.resourceLevel > 50 ? "active" : "thinking", activityChange: variables.resourceLevel - 50, newInsight: "资源变化影响行动策略" },
    { id: "agent-2", status: variables.marketVolatility > 50 ? "interacting" : "active", activityChange: Math.round((variables.marketVolatility - 50) * 0.5), newInsight: "市场动态需要密切关注" },
    { id: "agent-3", status: variables.crisisIntensity > 30 ? "interacting" : "resting", activityChange: variables.crisisIntensity, newInsight: "危机应对机制启动" },
  ];

  const worldEvents: Array<{ id: string; type: "cooperation" | "competition" | "innovation" | "crisis"; description: string; impact: number; involvedAgents: string[] }> = [];

  if (variables.resourceLevel > 60 && variables.marketVolatility < 40) {
    worldEvents.push({
      id: `event-${Date.now()}-1`,
      type: "cooperation",
      description: "智能体形成协作联盟",
      impact: 70,
      involvedAgents: ["agent-1", "agent-2"],
    });
  }

  if (variables.crisisIntensity > 40) {
    worldEvents.push({
      id: `event-${Date.now()}-2`,
      type: "crisis",
      description: "突发危机事件触发",
      impact: variables.crisisIntensity,
      involvedAgents: ["agent-3", "agent-4"],
    });
  }

  return {
    alerts,
    agentUpdates,
    worldEvents,
    predictions: {
      shortTerm: variables.crisisIntensity > 50 ? "短期内需要应对危机" : "短期内保持稳定发展",
      mediumTerm: variables.marketVolatility > 60 ? "中期面临市场挑战" : "中期有望实现增长",
      longTerm: variables.resourceLevel > 70 ? "长期前景乐观" : "长期需要更多资源投入",
    },
  };
}
