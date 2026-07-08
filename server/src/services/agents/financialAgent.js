import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// Financial Analysis Agent ka entry point function
export async function runFinancialAgent(companyName, apiKey, onProgress = () => {}) {
  // progress update sent
  onProgress({ status: 'financials', message: `Financial Agent: "${companyName}" ke revenue, margins aur balance sheet trends scan kar rahe hain...` });

  const searchQuery = `"${companyName}" stock price 1-year return ticker performance financial trends net income profit margins debt cash flow`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'financials', message: 'Financial Agent: Balance sheet, capital structure, and stock price history details examining...' });

  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a senior forensic accountant and investment financial analyst.
Your task is to analyze the financial health, stock price action, and growth trajectory of "{companyName}".

CRITICAL INSTRUCTIONS:
- Do NOT write long paragraphs, generic introductions, filler words, or corporate theory.
- Every section MUST contain only 2-3 short, punchy bullet points.
- Lead with hard numbers, revenues, margins, growth rates, debt, cash, and stock values.
- If the company is private/unlisted, estimate concrete numbers (e.g. estimated revenue/margins) based on industry averages. Do not say "not publicly disclosed".

Utilize the following financial and stock web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Output format must be clean Markdown:

### Stock Price Action & Historical Trends
* Stock ticker or private marker (e.g. "GREY (Private)" or "AAPL").
* 1-Year Return and recent stock performance trends (include specific numbers).
* Share drawdown/drop percentage from peak (drawdown metrics).

### Revenue & Profitability Trends
* Latest annual revenue (USD value) and revenue CAGR.
* Gross profit margins and net margins (estimated if private).

### Balance Sheet Strength & Debt Profile
* Total outstanding debt (with specific values).
* Cash reserves and overall leverage ratios.

### Cash Flow Analysis
* Estimated operating cash flows and CapEx.
* Free cash flow (FCF) generation capability.

### Key Financial Strengths
* 2-3 specific numeric financial strengths (e.g. Net cash positive, rising margins).

### Key Financial Weaknesses/Risks
* 2-3 specific numeric financial weaknesses (e.g. rising capital expenses, interest ratios).
`);

  const resultsText = searchResults.results.slice(0, 3).map((r, i) => `[${i+1}] Title: ${r.title}\nSnippet: ${r.content}\n`).join('\n');

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    searchQuery,
    searchAnswer: searchResults.answer,
    searchResultsText: resultsText
  });

  onProgress({ status: 'financials_complete', message: 'Financial Agent: Financial health aur balance sheet analysis complete!' });
  return response.content;
}
