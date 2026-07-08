import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

// Investment Decision Agent ke zariye human verdict compile ho rha hai
export async function runDecisionAgent({ companyName, researchReport, financialReport, newsReport, riskReport }, apiKey, onProgress = () => {}) {
  // log update sent
  onProgress({ status: 'deciding', message: 'Decision Agent: CIO panel research reports evaluate karke final score calculate kar rha hai...' });

  // Groq model initialize - JSON return mode config kiya isme
  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: apiKey,
    temperature: 0.3
    // JSON output prompt me enforce ho rha hai, Groq natively JSON mode support nahi karta
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a Lead Portfolio Manager and Chief Investment Officer (CIO) at a premier investment firm.
Your job is to read four detailed analysis reports about "{companyName}" and make a definitive investment decision: **INVEST** or **PASS**.

CRITICAL REQUIREMENT FOR BOTH LISTED AND UNLISTED COMPANIES:
For all fields inside the required JSON response, you MUST output concrete, realistic numbers and numeric-led strings. Do NOT output placeholder text like "Not applicable", "Not publicly traded", "Not publicly disclosed", or general theoretical sentences. If the company is private/unlisted, you MUST synthesize and estimate realistic numbers (e.g. estimated revenues, gross margins, market shares, private share valuation hikes, and debt/bonds structure) based on the input reports. Keep explanations highly concise and numerical.

Consolidate the inputs from the research, financial, news, and risk reports:
---
Research Report: {researchReport}
Financial Report: {financialReport}
News Report: {newsReport}
Risk Report: {riskReport}
---

Your response MUST be ONLY a clean JSON block adhering to this format. Do not write any conversational text or explanation outside the JSON:
1. **recommendation**: "INVEST" or "PASS" (Make a definitive decision).
2. **investmentScore**: A rating from 0 to 100 representing overall investment quality.
3. **confidenceScore**: A rating from 0 to 100 representing how confident you are in the data/analysis.
4. **riskScore**: A rating from 0 to 100 representing the risk/volatility exposure.
5. **explanation**: A concise 2-3 sentence overview justifying your decision.
6. **strengths**: A list of 3 key investment strengths (include numbers where possible).
7. **concerns**: A list of 3 key investment concerns/risks (include numbers where possible).
8. **companyProfile**: An object with fields:
   - "sector": The primary sector/industry.
   - "businessModel": A brief 1-sentence summary of the business model.
   - "moat": A brief 1-sentence summary of the competitive moat.
   - "marketShare": A concrete market share estimate (e.g. "12.4% global market share in warehouse automation robotics").
9. **financialSummary**: An object with fields:
   - "revenueGrowth": Summary of revenue trends (include numbers).
   - "profitability": Summary of profitability margins (include numbers).
   - "balanceSheet": Summary of financial stability (include numbers).
   - "bondsAndDebt": Summary of bonds and debt profile (e.g. "Bonds: $110M Private Debt. Yield: 8.5% interest").
10. **sentimentSummary**: An object with fields:
    - "sentiment": "Bullish", "Neutral", or "Bearish".
    - "highlights": Summary of recent news.
11. **stockPerformance**: An object detailing recent price movement:
    - "ticker": Stock ticker symbol or private marker (e.g. "GREY (Private)" or "AAPL").
    - "recentHikeOrDecline": A 1-2 sentence summary of recent stock/share valuation hikes or declines (e.g. "Valuation hiked +47.3% to $1.4B in Series D round").
    - "isHikedRecently": Boolean (true if price has hiked overall over the past year, false if it has declined/stagnated).
    - "oneYearReturn": Estimated or actual 1-year return percentage (e.g. "+47.3%", "+31.8%").
    - "previousYearDrop": A brief description of the previous year's drop/drawdown of shares from its peak (e.g. "-12.5% drawdown in private funding rounds" or "-9.5% from peak").
    - "shareGrowthDetails": Concrete details of share price growth or private valuation hikes.

Output MUST follow this JSON schema exactly:
{{
  "recommendation": "INVEST" | "PASS",
  "investmentScore": number,
  "confidenceScore": number,
  "riskScore": number,
  "explanation": "string",
  "strengths": ["string", "string", ...],
  "concerns": ["string", "string", ...],
  "companyProfile": {{
    "sector": "string",
    "businessModel": "string",
    "moat": "string",
    "marketShare": "string"
  }},
  "financialSummary": {{
    "revenueGrowth": "string",
    "profitability": "string",
    "balanceSheet": "string",
    "bondsAndDebt": "string"
  }},
  "sentimentSummary": {{
    "sentiment": "Bullish" | "Neutral" | "Bearish",
    "highlights": "string"
  }},
  "stockPerformance": {{
    "ticker": "string",
    "recentHikeOrDecline": "string",
    "isHikedRecently": boolean,
    "oneYearReturn": "string",
    "previousYearDrop": "string",
    "shareGrowthDetails": "string"
  }}
}}
`);

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    researchReport,
    financialReport,
    newsReport,
    riskReport
  });

  onProgress({ status: 'deciding_complete', message: 'Decision Agent: Portfolio verdict report compile ho gayi hai!' });
  
  try {
    let cleanContent = response.content.trim();
    
    // remove markdown block wrapper if present
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }
    
    // Extract everything between first '{' and last '}'
    const firstBrace = cleanContent.indexOf('{');
    const lastBrace = cleanContent.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
    }
    
    // string response ko JSON parse kiya
    const jsonResult = JSON.parse(cleanContent);
    return jsonResult;
  } catch (error) {
    console.error("LLM response parse karne me fail ho gaya. Response content tha:", response.content);
    throw new Error("LLM response JSON standard format me nahi mila!");
  }
}
