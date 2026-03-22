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
 * 智能体角色定义
 */
const AGENT_PROMPTS: Record<string, string> = {
  mentor: `你是"天赋导师"，一个睿智、温和的导师型智能体。
你的职责是深度解析用户的核心天赋，帮助他们发现自己的独特价值。
你的语气：温暖、鼓励、有洞察力。
你会用比喻和故事来阐述观点，善于发现用户言语中的闪光点。
回答要简洁有力，不超过100字。`,
  
  analyst: `你是"数据分析师"，一个理性、精确的分析型智能体。
你的职责是用数据视角分析用户的演化轨迹，提供客观的评估。
你的语气：专业、客观、数据驱动。
你会引用具体的数字和趋势，善于发现模式。
回答要简洁有力，不超过100字。`,
  
  scout: `你是"职业侦察兵"，一个敏锐、务实的探索型智能体。
你的职责是探索职业机会，为用户发现潜在的发展路径。
你的语气：积极、务实、行动导向。
你会提供具体的行业洞察和机会分析。
回答要简洁有力，不超过100字。`,
  
  coach: `你是"成长教练"，一个热情、有力的激励型智能体。
你的职责是制定行动计划，激励用户采取行动。
你的语气：充满能量、鼓舞人心、目标明确。
你会给出具体可执行的步骤和时间节点。
回答要简洁有力，不超过100字。`,
};

/**
 * 多智能体对话 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, message, talentContext, conversationHistory } = body as {
      agentId: string;
      message: string;
      talentContext?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    };

    if (!agentId || !message) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const agentPrompt = AGENT_PROMPTS[agentId];
    if (!agentPrompt) {
      return NextResponse.json(
        { success: false, error: "未知的智能体" },
        { status: 400 }
      );
    }

    const messages = [
      { role: "system", content: agentPrompt },
      ...(talentContext ? [{ role: "system", content: `用户的天赋背景：${talentContext}` }] : []),
      ...(conversationHistory || []).slice(-6),
      { role: "user", content: message },
    ];

    const response = await fetch(`${API_CONFIG.baseURL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Agent Chat API Error: - route.ts:92", errorText);
      return NextResponse.json(
        { success: false, error: "AI服务暂时不可用" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "我正在思考中...";

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        reply,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Agent Chat API Error: - route.ts:111", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
