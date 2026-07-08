import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// Research Agent ko run karne ka entry function
export async function runResearchAgent(companyName, apiKey, onProgress = () => {}) {
  // frontend par progress log bheja
  onProgress({ status: 'researching', message: `Research Agent: "${companyName}" ke baare me internet par search start ho gaya hai...` });
  
  const searchQuery = `"${companyName}" business model industry competitive position moat growth opportunities`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'researching', message: 'Research Agent: Mil gayi details! Ab business model aur structural data analyze kar rahe hain...' });

  // Groq model initialize kiya
  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: apiKey,
    temperature: 0.2
  });

  // prompt templates setup kiya
  const prompt = PromptTemplate.fromTemplate(`
You are a senior equity research analyst.
Your task is to analyze the company "{companyName}" and write a concise, fact-driven business profile.

CRITICAL INSTRUCTIONS:
- Do NOT write long paragraphs, generic introductions, filler words, or corporate theory.
- Every section MUST contain only 2-3 short, punchy bullet points.
- Lead with hard numbers, market shares, growth rates, and specific products/competitors.
- If the company is private/unlisted, estimate concrete numbers (e.g. estimated market share) based on industry averages. Do not say "not publicly disclosed".

Utilize the following web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Output format must be clean Markdown:

### Company Overview
* Sector and sub-industries of operation.
* Estimated corporate size, headquarters, and geographic footprint (with numbers).
* Short summary of core business activity.

### Industry & Market Analysis
* Current global market size (USD value) and projected CAGR.
* Primary macro drivers (1-2 facts).

### Business Model & Value Proposition
* Core revenue generation channels.
* Pricing power details (high/low and why).

### Competitive Position & Moat
* Concrete market share percentage or position in sector.
* Moat source (e.g. switching costs, brand value) with specific competitor comparisons.

### Growth Opportunities
* Next product vectors or geographic expansions (with estimated timeline/numbers).
`);

  // search results ko readable string formats me assemble kiya
  const resultsText = searchResults.results.slice(0, 3).map((r, i) => `[${i+1}] Title: ${r.title}\nSnippet: ${r.content}\n`).join('\n');

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
