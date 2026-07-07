import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// Research Agent ko run karne ka entry function
export async function runResearchAgent(companyName, apiKey, onProgress = () => {}) {
  // frontend par progress log bheja
  onProgress({ status: 'researching', message: `Research Agent: "${companyName}" ke baare me internet par search start ho gaya hai...` });
  
  const searchQuery = `"${companyName}" business model industry competitive position moat growth opportunities`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'researching', message: 'Research Agent: Mil gayi details! Ab business model aur structural data analyze kar rahe hain...' });

  // gemini model initialize kiya
  const model = new ChatGoogle({
    model: "gemini-2.0-flash",
    apiKey: apiKey,
    temperature: 0.2
  });

  // prompt templates setup kiya
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

  // search results ko readable string formats me assemble kiya
  const resultsText = searchResults.results.map((r, i) => `[${i+1}] Title: ${r.title}\nUrl: ${r.url}\nSnippet: ${r.content}\n`).join('\n');

  // Langchain Runnable pipeline run kiya human validation ke sath
  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    searchQuery,
    searchAnswer: searchResults.answer,
    searchResultsText: resultsText
  });

  onProgress({ status: 'research_complete', message: 'Research Agent: Corporate profile aur market moats analysis pura ho gaya hai!' });
  return response.content;
}
