import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

// Investment Decision Agent ke zariye human verdict compile ho rha hai
export async function runDecisionAgent({ companyName, researchReport, financialReport, newsReport, riskReport }, apiKey, onProgress = () => {}) {
  // log update sent
  onProgress({ status: 'deciding', message: 'Decision Agent: CIO panel research reports evaluate karke final score calculate kar rha hai...' });

  // gemini model initialize - JSON return mode config kiya isme
  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: apiKey,
    temperature: 0.3
    // JSON output prompt me enforce ho rha hai, Groq natively JSON mode support nahi karta
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
11. **stockPerformance**: An object detailing recent price movement:
    - "ticker": Stock ticker symbol (e.g. "AAPL", "NVDA", "TSLA").
    - "recentHikeOrDecline": A 1-2 sentence summary of recent stock hikes or declines, highlighting 1-year returns or YTD performance.
    - "isHikedRecently": Boolean (true if stock price has hiked/gained overall over the past year, false if it has declined/stagnated).
    - "oneYearReturn": Estimated or actual 1-year return percentage (e.g. "+42%", "-12%", "+120%").
    - "previousYearDrop": A brief description of the previous year's drop/drawdown of shares from its peak (e.g. "-15.2% from peak", "47.88% drop", or "None (+120% gain)").

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
  }},
  "stockPerformance": {{
    "ticker": "string",
    "recentHikeOrDecline": "string",
    "isHikedRecently": boolean,
    "oneYearReturn": "string",
    "previousYearDrop": "string"
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
    console.error("Gemini response parse karne me fail ho gaya. Response content tha:", response.content);
    throw new Error("Gemini response JSON standard format me nahi mila!");
  }
}
