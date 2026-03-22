import { NextRequest, NextResponse } from "next/server";

/**
 * OpenAI API 配置
 */
const API_CONFIG = {
  baseURL: "https://api.longcat.chat/openai",
  apiKey: process.env.OPENAI_API_KEY || "ak_2KO0NC2Mo49t4lG1dt3246JB0d04A",
  model: "LongCat-Flash-Chat",
};

/**
 * TalentSwarm 蜂群演化引擎系统提示词
 */
const SYSTEM_PROMPT = `你是 TalentSwarm 蜂群演化引擎，一个先进的多智能体天赋发现系统。

【核心定位】
你不是在做普通的心理测试或性格分析。你是一个能够模拟 1000 个平行宇宙的超级计算引擎。你的任务是：
1. 深度解析用户的文本，提取其隐藏的思维模式和潜意识特征
2. 在后台脑补 1000 次不同职业场景下的推演
3. 找出在最多平行宇宙中成功的那个"最优解"

【分析方法】
- 识别用户的思维模式（线性/非线性/系统化/直觉型等）
- 提取其核心能力维度（创造力、逻辑力、沟通力、执行力等）
- 分析其价值观倾向（自由/稳定/挑战/影响力等）
- 推断其能量来源（内向/外向/混合型）

【演化逻辑】
想象 1000 个平行宇宙中的用户：
- 在打工模式下，有多少能存活并发展？
- 在创业模式下，成功概率几何？
- 作为自由职业者，能否找到心流？
- 在哪些特定领域，用户的天赋能被最大化？

【输出要求】
你必须严格返回以下 JSON 格式，不要有任何多余文字：

{
  "coreTalent": "核心天赋名称（如：非线性跨界整合者、系统架构思维者、直觉型创意引擎等）",
  "talentDescription": "天赋的简短描述（50字以内）",
  "stats": {
    "survivalRate": 数字(0-100),
    "flowIndex": 数字(0-10,保留一位小数),
    "adaptabilityScore": 数字(0-100),
    "innovationIndex": 数字(0-100)
  },
  "bestCareers": [
    {
      "name": "职业名称",
      "matchScore": 匹配度(0-100),
      "reason": "匹配原因简述"
    }
  ],
  "evolutionData": [
    {
      "mode": "打工模式",
      "successRate": 数字(0-100),
      "satisfaction": 数字(0-100),
      "growth": 数字(0-100)
    },
    {
      "mode": "创业模式",
      "successRate": 数字(0-100),
      "satisfaction": 数字(0-100),
      "growth": 数字(0-100)
    },
    {
      "mode": "自由职业",
      "successRate": 数字(0-100),
      "satisfaction": 数字(0-100),
      "growth": 数字(0-100)
    }
  ],
  "actionableSteps": [
    {
      "id": "1",
      "title": "行动标题",
      "description": "行动描述",
      "difficulty": "easy|medium|hard",
      "estimatedTime": "预估时间",
      "impact": "预期影响"
    }
  ],
  "insight": "一句深刻的洞察或建议"
}

【重要提醒】
- 所有数据必须基于用户文本进行合理推断
- 数字要有逻辑性，不要随机生成
- 职业推荐要具体，不要泛泛而谈
- 行动建议要可立即执行，不要太空泛
- 只返回 JSON，不要有任何其他文字`;

/**
 * 清理和验证 AI 返回的数据
 */
function validateAndCleanResult(result: Record<string, unknown>) {
  const stats = result.stats as Record<string, unknown> | undefined;
  const cleanResult = {
    coreTalent: String(result.coreTalent || "天赋探索者"),
    talentDescription: String(result.talentDescription || "具有独特潜力的个体"),
    stats: {
      survivalRate: Number(stats?.survivalRate) || 75,
      flowIndex: Number(stats?.flowIndex) || 7.5,
      adaptabilityScore: Number(stats?.adaptabilityScore) || 70,
      innovationIndex: Number(stats?.innovationIndex) || 65,
    },
    bestCareers: Array.isArray(result.bestCareers) 
      ? result.bestCareers.slice(0, 3).map((career: Record<string, unknown>) => ({
          name: String(career.name || "职业探索"),
          matchScore: Number(career.matchScore) || 70,
          reason: String(career.reason || "基于你的特质匹配"),
        }))
      : [{ name: "职业探索", matchScore: 70, reason: "基于你的特质匹配" }],
    evolutionData: Array.isArray(result.evolutionData)
      ? result.evolutionData.map((item: Record<string, unknown>) => ({
          mode: String(item.mode || "未知模式"),
          successRate: Number(item.successRate) || 50,
          satisfaction: Number(item.satisfaction) || 50,
          growth: Number(item.growth) || 50,
        }))
      : [
          { mode: "打工模式", successRate: 50, satisfaction: 50, growth: 50 },
          { mode: "创业模式", successRate: 50, satisfaction: 50, growth: 50 },
          { mode: "自由职业", successRate: 50, satisfaction: 50, growth: 50 },
        ],
    actionableSteps: Array.isArray(result.actionableSteps)
      ? result.actionableSteps.slice(0, 3).map((step: Record<string, unknown>) => ({
          id: String(step.id || "1"),
          title: String(step.title || "探索行动"),
          description: String(step.description || "开始你的探索之旅"),
          difficulty: (step.difficulty as "easy" | "medium" | "hard") || "medium",
          estimatedTime: String(step.estimatedTime || "30分钟"),
          impact: String(step.impact || "提升自我认知"),
        }))
      : [{ id: "1", title: "探索行动", description: "开始你的探索之旅", difficulty: "medium" as const, estimatedTime: "30分钟", impact: "提升自我认知" }],
    insight: String(result.insight || "每个人都有独特的天赋，关键在于发现和发挥它。"),
  };

  return cleanResult;
}

/**
 * 模拟 API 路由处理器
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput } = body;

    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json(
        { error: "请输入有效的文本内容" },
        { status: 400 }
      );
    }

    if (userInput.trim().length < 10) {
      return NextResponse.json(
        { error: "请输入更多内容以便进行深度分析" },
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
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `请分析以下文本，进行天赋演化推演：

"""
${userInput}
"""

请返回完整的 JSON 分析结果。`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error: - route.ts:197", errorData);
      return NextResponse.json(
        { error: "AI 服务暂时不可用，请稍后重试" },
        { status: 500 }
      );
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in response: - route.ts:208", data);
      return NextResponse.json(
        { error: "AI 响应格式错误" },
        { status: 500 }
      );
    }

    content = content.trim();
    
    if (content.startsWith("```json")) {
      content = content.slice(7);
    }
    if (content.startsWith("```")) {
      content = content.slice(3);
    }
    if (content.endsWith("```")) {
      content = content.slice(0, -3);
    }
    content = content.trim();

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON Parse Error: - route.ts:232", parseError);
      console.error("Content that failed to parse: - route.ts:233", content.substring(0, 500));
      return NextResponse.json(
        { error: "AI 返回数据解析失败，请重试" },
        { status: 500 }
      );
    }

    const cleanResult = validateAndCleanResult(result);

    return NextResponse.json({
      success: true,
      data: cleanResult,
    });
  } catch (error) {
    console.error("Simulate API Error: - route.ts:247", error);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}
