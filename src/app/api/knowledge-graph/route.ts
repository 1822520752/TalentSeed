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
 * 知识图谱提取系统提示词
 */
const SYSTEM_PROMPT = `你是一个知识图谱提取引擎。你的任务是从用户的天赋分析数据中提取结构化的知识图谱。

你需要返回以下JSON格式：
{
  "nodes": [
    {
      "id": "唯一标识",
      "label": "节点名称",
      "type": "core|skill|trait|experience",
      "importance": 0-100
    }
  ],
  "edges": [
    {
      "source": "源节点id",
      "target": "目标节点id",
      "label": "关系描述",
      "strength": 0-1
    }
  ]
}

节点类型说明：
- core: 核心天赋节点（最重要的中心节点）
- skill: 技能节点
- trait: 特质节点
- experience: 经历节点

提取规则：
1. 核心天赋作为中心节点
2. 提取3-5个相关技能
3. 提取2-4个性格特质
4. 提取1-3个相关经历或背景
5. 建立节点之间的逻辑关系
6. 重要性反映节点与核心天赋的关联程度

只返回JSON，不要有任何其他文字。`;

/**
 * 知识图谱提取 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { talentData } = body as {
      talentData: {
        coreTalent: string;
        talentDescription: string;
        bestCareers: Array<{ name: string; reason: string }>;
        actionableSteps: Array<{ title: string; description: string }>;
      };
    };

    if (!talentData || !talentData.coreTalent) {
      return NextResponse.json(
        { success: false, error: "缺少天赋数据" },
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
          { role: "user", content: JSON.stringify(talentData) },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Knowledge Graph API Error: - route.ts:94", errorText);
      return NextResponse.json(
        { success: false, error: "AI服务暂时不可用" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    let graphData;
    try {
      graphData = JSON.parse(content);
    } catch {
      graphData = generateFallbackGraph(talentData);
    }

    if (!graphData.nodes || !Array.isArray(graphData.nodes)) {
      graphData = generateFallbackGraph(talentData);
    }

    return NextResponse.json({
      success: true,
      data: graphData,
    });
  } catch (error) {
    console.error("Knowledge Graph API Error: - route.ts:120", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

/**
 * 生成备用知识图谱
 */
function generateFallbackGraph(talentData: { coreTalent: string; talentDescription: string; bestCareers: Array<{ name: string; reason: string }>; actionableSteps: Array<{ title: string; description: string }> }) {
  const nodes = [
    { id: "core-1", label: talentData.coreTalent, type: "core", importance: 100 },
  ];

  const edges: Array<{ source: string; target: string; label: string; strength: number }> = [];

  talentData.bestCareers?.slice(0, 3).forEach((career, index) => {
    nodes.push({
      id: `career-${index}`,
      label: career.name,
      type: "skill",
      importance: 80 - index * 10,
    });
    edges.push({
      source: "core-1",
      target: `career-${index}`,
      label: "适合职业",
      strength: 0.8 - index * 0.1,
    });
  });

  talentData.actionableSteps?.slice(0, 3).forEach((step, index) => {
    nodes.push({
      id: `action-${index}`,
      label: step.title,
      type: "experience",
      importance: 60 - index * 10,
    });
    edges.push({
      source: "core-1",
      target: `action-${index}`,
      label: "行动建议",
      strength: 0.6 - index * 0.1,
    });
  });

  return { nodes, edges };
}
