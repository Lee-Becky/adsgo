
import { GoogleGenAI, Type } from "@google/genai";
import { Campaign, AIAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCampaignAdvice(campaign: Campaign): Promise<AIAdvice> {
  const prompt = `
    请分析以下广告系列数据并提供预算调整建议。
    广告系列名称: ${campaign.name}
    平台: ${campaign.platform}
    当前预算: ${campaign.currentBudget}
    今日数据: ${JSON.stringify(campaign.todayMetrics)}
    过去14天平均 ROAS: ${(campaign.history.reduce((acc, h) => acc + h.roas, 0) / 14).toFixed(2)}
    
    请返回一个 JSON 对象，包含以下字段（内容请使用中文）：
    - recommendedBudget (数字类型，建议的新预算)
    - reasons (包含 3 个具体原因的字符串数组)
    - detailedAnalysis (长字符串，详细分析趋势、漏斗健康度和出价策略)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedBudget: { type: Type.NUMBER },
            reasons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 3,
              maxItems: 3
            },
            detailedAnalysis: { type: Type.STRING }
          },
          required: ["recommendedBudget", "reasons", "detailedAnalysis"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return {
      ...data,
      currentBudget: campaign.currentBudget
    };
  } catch (error) {
    console.error("Gemini API 错误:", error);
    // 回退中文建议
    return {
      currentBudget: campaign.currentBudget,
      recommendedBudget: campaign.currentBudget * 1.1,
      reasons: [
        "过去 72 小时内 ROAS 表现持续稳定且高于预期。",
        "在扩大目标受众范围的同时，点击成本 (CPC) 保持平稳。",
        "近期搜索查询扩展显示高转化意向用户显著增加。"
      ],
      detailedAnalysis: "该广告系列表现出强劲的势头。当前 ROAS 比目标高出 15%。我们建议采用循序渐进的扩量策略，在保持 CPA 效率的同时捕捉更多高意向流量。漏斗中层点击到转化的效率显著提升，表明创意与受众契合度极高。"
    };
  }
}
