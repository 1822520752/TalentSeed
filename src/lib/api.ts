/**
 * 模拟结果数据接口
 */
export interface SimulationResult {
  coreTalent: string;
  talentDescription: string;
  stats: {
    survivalRate: number;
    flowIndex: number;
    adaptabilityScore: number;
    innovationIndex: number;
  };
  bestCareers: Array<{
    name: string;
    matchScore: number;
    reason: string;
  }>;
  evolutionData: Array<{
    mode: string;
    successRate: number;
    satisfaction: number;
    growth: number;
  }>;
  actionableSteps: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    estimatedTime: string;
    impact: string;
  }>;
  insight: string;
}

/**
 * API 响应接口
 */
export interface ApiResponse {
  success?: boolean;
  data?: SimulationResult;
  error?: string;
}

/**
 * 调用模拟 API
 */
export async function simulateTalent(userInput: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "请求失败",
      };
    }

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      error: result.error || "响应格式错误",
    };
  } catch (error) {
    console.error("Simulate API Error:", error);
    return {
      success: false,
      error: "网络错误，请检查网络连接",
    };
  }
}
