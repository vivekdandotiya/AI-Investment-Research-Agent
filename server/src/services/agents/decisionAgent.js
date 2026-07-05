import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";

/**
 * Executes the Investment Decision Agent.
 * 
 * @param {Object} params - The inputs containing all agent reports
 * @param {string} params.companyName - Name of the company
 * @param {string} params.researchReport - Markdown report from Research Agent
 * @param {string} params.financialReport - Markdown report from Financial Agent
 * @param {string} params.newsReport - Markdown report from News Agent
 * @param {string} params.riskReport - Markdown report from Risk Agent
 * @param {string} apiKey - Gemini API Key
 * @param {function} onProgress - Callback to stream status updates
 * @returns {Promise<Object>} - Structured JSON investment analysis and final recommendation
 */
export async function runDecisionAgent({ companyName, researchReport, financialReport, newsReport, riskReport }, apiKey, onProgress = () => {}) {
  onProgress({ status: 'deciding', message: 'Decision Agent: Synthesizing intelligence reports and calculating scores...' });

  const model = new ChatGoogle({
    model: "gemini-1.5-flash",
    apiKey: apiKey,
    temperature: 0.3,
    responseMimeType: "application/json" // Force Gemini to return JSON
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a Lead Portfolio Manager and Chief Investment Officer (CIO) at a premier investment firm.
Your job is to read four detailed analysis reports about "{companyName}" and make a definitive investment decision: **INVEST** or **PASS**.

Here are the reports compiled by your analyst agents:

---
### RESEARCH REPORT (Overview, Industry, Moat, Growth)
{researchReport}

---
### FINANCIAL REPORT (Trends, Profitability, Strengths/Weaknesses)
{financialReport}

---
### NEWS & SENTIMENT REPORT (Headlines, Sentiment, Signals)
{newsReport}

---
### RISK REPORT (Vulnerabilities, Threats, Weaknesses)
{riskReport}
---

Based on these inputs, synthesize the analysis and write a final report in JSON format.
You must assess:
1. **recommendation**: Must be either "INVEST" or "PASS" (all caps). Choose "INVEST" only if the growth opportunities, moats, and financial strength outweigh the risks.
2. **investmentScore**: Integer from 0 to 100, representing the overall quality of the investment (e.g. business moat, financials, industry tailwinds).
3. **confidenceScore**: Integer from 0 to 100, representing your level of certainty in this decision (0-100).
4. **riskScore**: Integer from 0 to 100, representing the threat level of the identified risks (higher score means higher risk/vulnerability).
5. **explanation**: A detailed, 3-4 sentence justification of your decision, summarizing the core investment thesis.
6. **strengths**: An array of 3-5 core strengths of the company.
7. **concerns**: An array of 3-5 major concerns or threats.
8. **companyProfile**: An object with fields:
   - "sector": The primary sector/industry.
   - "businessModel": A brief 1-sentence summary of the business model.
   - "moat": A brief 1-sentence summary of the competitive moat.
9. **financialSummary**: An object with fields:
   - "revenueGrowth": Summary of revenue trends.
   - "profitability": Summary of profitability margins.
   - "balanceSheet": Summary of financial stability.
10. **sentimentSummary**: An object with fields:
    - "sentiment": "Bullish", "Neutral", or "Bearish".
    - "highlights": Summary of recent news.

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
    "moat": "string"
  }},
  "financialSummary": {{
    "revenueGrowth": "string",
    "profitability": "string",
    "balanceSheet": "string"
  }},
  "sentimentSummary": {{
    "sentiment": "Bullish" | "Neutral" | "Bearish",
    "highlights": "string"
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

  onProgress({ status: 'deciding_complete', message: 'Decision Agent: Final investment decision published.' });
  
  try {
    const jsonResult = JSON.parse(response.content);
    return jsonResult;
  } catch (error) {
    console.error("Failed to parse Decision Agent output as JSON. Output was:", response.content);
    throw new Error("Investment Decision Agent output was not in the expected JSON format.");
  }
}
