import { NextRequest, NextResponse } from "next/server";

/**
 * API 配置
 */
const API_CONFIG = {
  baseURL: process.env.OPENAI_BASE_URL || "https://api.longcat.chat/openai",
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_MODEL || "LongCat-Flash-Chat",
};

/**
 * 平行宇宙模拟系统提示词
 */
const SYSTEM_PROMPT = `你是一个平行宇宙模拟引擎。你的任务是基于用户的天赋数据，模拟12个平行宇宙中的不同发展轨迹。

你需要返回以下JSON格式：
{
  "universes": [
    {
      "id": "universe-1",
      "name": "宇宙名称（如：科技创业宇宙）",
      "scenario": "场景描述（如：在硅谷创办AI公司）",
      "status": "success|partial|failed",
      "successRate": 0-100,
      "keyFactors": ["关键因素1", "关键因素2"],
      "outcome": "最终结果描述",
      "lessons": ["经验教训1", "经验教训2"]
    }
  ],
  "summary": {
    "successCount": 成功宇宙数,
    "partialCount": 部分成功数,
    "failedCount": 失败数,
    "bestPath": "最佳发展路径建议",
    "riskFactors": ["风险因素1", "风险因素2"]
  }
}

模拟规则：
1. 创建12个不同的平行宇宙
2. 每个宇宙代表不同的职业/生活选择
3. 基于用户天赋计算合理的成功率
4. 包含创业、打工、自由职业、跨行业发展等多种场景
5. 确保结果多样性和逻辑一致性
6. 状态分布：约30%成功、40%部分成功、30%失败

只返回JSON，不要有任何其他文字。`;

/**
 * 平行宇宙模拟 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { talentData, variables } = body as {
      talentData: {
        coreTalent: string;
        talentDescription: string;
        stats: {
          survivalRate: number;
          flowIndex: number;
          adaptabilityScore: number;
          innovationIndex: number;
        };
        bestCareers: Array<{ name: string; matchScore: number }>;
      };
      variables?: {
        resourceLevel?: number;
        marketVolatility?: number;
        policyIntervention?: number;
        crisisIntensity?: number;
      };
    };

    if (!talentData || !talentData.coreTalent) {
      return NextResponse.json(
        { success: false, error: "缺少天赋数据" },
        { status: 400 }
      );
    }

    const userPrompt = variables
      ? `天赋数据：${JSON.stringify(talentData)}\n\n变量注入：${JSON.stringify(variables)}`
      : JSON.stringify(talentData);

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Parallel Universe API Error: - route.ts:106", errorText);
      return NextResponse.json(
        { success: false, error: "AI服务暂时不可用" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    let universeData;
    try {
      universeData = JSON.parse(content);
    } catch {
      universeData = generateFallbackUniverses(talentData);
    }

    if (!universeData.universes || !Array.isArray(universeData.universes)) {
      universeData = generateFallbackUniverses(talentData);
    }

    return NextResponse.json({
      success: true,
      data: universeData,
    });
  } catch (error) {
    console.error("Parallel Universe API Error: - route.ts:132", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

/**
 * 生成备用平行宇宙数据
 */
function generateFallbackUniverses(talentData: {
  coreTalent: string;
  stats: { survivalRate: number; flowIndex: number; adaptabilityScore: number; innovationIndex: number };
  bestCareers: Array<{ name: string; matchScore: number }>;
}) {
  const scenarios = [
    { name: "科技创业宇宙", scenario: "在一线城市创办科技公司" },
    { name: "稳定职场宇宙", scenario: "进入大型企业稳步发展" },
    { name: "自由职业宇宙", scenario: "成为独立顾问/创作者" },
    { name: "学术研究宇宙", scenario: "深耕学术领域" },
    { name: "跨界转型宇宙", scenario: "跨行业发展" },
    { name: "远程工作宇宙", scenario: "全球远程工作" },
    { name: "社会创业宇宙", scenario: "创办社会企业" },
    { name: "内容创作宇宙", scenario: "成为全职内容创作者" },
    { name: "投资理财宇宙", scenario: "专注投资与资产管理" },
    { name: "教育培训宇宙", scenario: "从事教育培训行业" },
    { name: "国际发展宇宙", scenario: "海外发展" },
    { name: "生活平衡宇宙", scenario: "追求工作生活平衡" },
  ];

  const baseRate = talentData.stats?.survivalRate || 70;
  const innovation = talentData.stats?.innovationIndex || 50;

  const universes = scenarios.map((s, index) => {
    const variance = (Math.random() - 0.5) * 30;
    const rate = Math.min(100, Math.max(0, baseRate + variance + (innovation - 50) * 0.3));
    
    let status: "success" | "partial" | "failed";
    if (rate >= 70) status = "success";
    else if (rate >= 40) status = "partial";
    else status = "failed";

    return {
      id: `universe-${index + 1}`,
      name: s.name,
      scenario: s.scenario,
      status,
      successRate: Math.round(rate),
      keyFactors: ["天赋匹配度", "市场时机", "资源投入"],
      outcome: status === "success" ? "实现了预期目标" : status === "partial" ? "部分达成目标" : "未能达成目标",
      lessons: ["持续学习", "保持灵活"],
    };
  });

  return {
    universes,
    summary: {
      successCount: universes.filter((u) => u.status === "success").length,
      partialCount: universes.filter((u) => u.status === "partial").length,
      failedCount: universes.filter((u) => u.status === "failed").length,
      bestPath: talentData.bestCareers?.[0]?.name || "继续探索",
      riskFactors: ["市场变化", "资源限制"],
    },
  };
}
