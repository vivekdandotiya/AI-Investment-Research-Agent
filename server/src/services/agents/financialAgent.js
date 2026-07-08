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

CRITICAL REQUIREMENT FOR PRIVATE/UNLISTED COMPANIES:
If "{companyName}" is a private or unlisted company, do NOT write statements like "not publicly disclosed", "not applicable", or general theoretical descriptions. Instead, you MUST synthesize and estimate realistic, concrete financial numbers and ratios (e.g. estimated revenues, gross margins, private share growth, and debt/bonds structure) based on recent funding rounds, industry averages, and market size estimates. Keep explanations very short and numerical.

Utilize the following financial and stock web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Provide a deep-dive financial and stock performance analysis of the company. Include specific financial numbers, percentages, stock price trends, and growth rates. Keep responses highly concise. Your output must be in Markdown format and cover:

### Stock Price Action & Historical Trends
Detail the recent stock or private share performance: Ticker symbol (e.g. "GREY (Private)" or similar), recent share valuation, 1-year share growth percentage, and previous year drop/drawdowns from peak valuation.

### Revenue & Profitability Trends
State specific numbers for revenue growth (CAGR), gross margins, and net profit margins (estimate realistic figures if private).

### Balance Sheet Strength & Debt Profile
State specific debt values, cash reserves, and capacity to handle liabilities.

### Cash Flow Analysis
State estimated operating cash flow, CapEx, and free cash flow (FCF).

### Key Financial Strengths
List 2-4 critical financial strengths with numbers.

### Key Financial Weaknesses/Risks
List 2-4 critical financial concerns with numbers.
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
