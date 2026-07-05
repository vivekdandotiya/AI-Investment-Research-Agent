import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

/**
 * Executes the Research Agent workflow.
 * 
 * @param {string} companyName - The company to analyze
 * @param {string} apiKey - Gemini API Key
 * @param {function} onProgress - Callback to stream status updates
 * @returns {Promise<string>} - Detailed Markdown report of company profile
 */
export async function runResearchAgent(companyName, apiKey, onProgress = () => {}) {
  onProgress({ status: 'researching', message: `Research Agent: Executing target intelligence searches for "${companyName}"...` });
  
  const searchQuery = `"${companyName}" business model industry competitive position moat growth opportunities`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'researching', message: 'Research Agent: Processing corporate profiles and competitive positioning...' });

  const model = new ChatGoogle({
    model: "gemini-1.5-flash",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a senior equity research analyst at a top-tier investment bank.
Your task is to analyze the company "{companyName}" and write a detailed, professional business overview report.

Utilize the following web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Your analysis must be detailed, granular, and free of vague statements. Cover the following sections and output them in Markdown format:

### Company Overview
Provide a concise but comprehensive profile of {companyName}, its primary sectors of operation, corporate history, and size.

### Industry & Market Analysis
Analyze the industry context. What is the market size, secular growth trends, and macroeconomic environment?

### Business Model & Value Proposition
Explain exactly how {companyName} generates revenue, its customer segments, pricing power, and cost structure.

### Competitive Position & Moat
Detail their competitive advantages (e.g., brand value, network effects, cost advantage, high switching costs) and evaluate the strength and durability of their moat. Mention key rivals.

### Growth Opportunities
Outline the primary vectors of future expansion (e.g., geographic expansion, product diversification, R&D breakthroughs, M&A activity).
`);

  const resultsText = searchResults.results.map((r, i) => `[${i+1}] Title: ${r.title}\nUrl: ${r.url}\nSnippet: ${r.content}\n`).join('\n');

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    searchQuery,
    searchAnswer: searchResults.answer,
    searchResultsText: resultsText
  });

  onProgress({ status: 'research_complete', message: 'Research Agent: Corporate overview and market position analysis complete.' });
  return response.content;
}
