import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// Financial Analysis Agent ka entry point function
export async function runFinancialAgent(companyName, apiKey, onProgress = () => {}) {
  // progress update sent
  onProgress({ status: 'financials', message: `Financial Agent: "${companyName}" ke revenue, margins aur balance sheet trends scan kar rahe hain...` });

  const searchQuery = `"${companyName}" financial performance revenue trends net income profit margins debt cash flow`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'financials', message: 'Financial Agent: Balance sheet aur capital structures details examine kar rahe hain...' });

  const model = new ChatGoogle({
    model: "gemini-2.0-flash",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a senior forensic accountant and investment financial analyst.
Your task is to analyze the financial health and growth trajectory of "{companyName}".

Utilize the following financial web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Provide a deep-dive financial analysis of the company. Include specific financial numbers, percentages, and growth rates where available. Your output must be in Markdown format and cover:

### Revenue & Profitability Trends
Analyze recent revenue growth (CAGR if possible), gross margin, operating margin, and net profit trends. Include specific numbers (e.g., in millions/billions USD).

### Balance Sheet Strength & Debt Profile
Evaluate their leverage, cash equivalents, working capital, and capacity to withstand economic downturns. 

### Cash Flow Analysis
Review operating cash flow, capital expenditures (CapEx), and free cash flow (FCF) generation. Are they converting net income efficiently to cash?

### Key Financial Strengths
List 2-4 critical financial strengths (e.g., rising margins, negative net debt, high return on equity).

### Key Financial Weaknesses/Risks
List 2-4 critical financial concerns (e.g., decelerating growth, margin compression, high capital intensity).
`);

  const resultsText = searchResults.results.map((r, i) => `[${i+1}] Title: ${r.title}\nUrl: ${r.url}\nSnippet: ${r.content}\n`).join('\n');

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
