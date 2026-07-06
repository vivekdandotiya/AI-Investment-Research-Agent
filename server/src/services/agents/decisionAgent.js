import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";

// Investment Decision Agent ke zariye human verdict compile ho rha hai
export async function runDecisionAgent({ companyName, researchReport, financialReport, newsReport, riskReport }, apiKey, onProgress = () => {}) {
  // log update sent
  onProgress({ status: 'deciding', message: 'Decision Agent: CIO panel research reports evaluate karke final score calculate kar rha hai...' });

  // gemini model initialize - JSON return mode config kiya isme
  const model = new ChatGoogle({
    model: "gemini-1.5-flash",
    apiKey: apiKey,
    temperature: 0.3,
    responseMimeType: "application/json" // Gemini ko restrict kar rahe hain taaki strictly clean JSON return kare
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

  onProgress({ status: 'deciding_complete', message: 'Decision Agent: Portfolio verdict report compile ho gayi hai!' });
  
  try {
    // string response ko JSON parse kiya
    const jsonResult = JSON.parse(response.content);
    return jsonResult;
  } catch (error) {
    console.error("Gemini response parse karne me fail ho gaya. Response content tha:", response.content);
    throw new Error("Gemini response JSON standard format me nahi mila!");
  }
}
