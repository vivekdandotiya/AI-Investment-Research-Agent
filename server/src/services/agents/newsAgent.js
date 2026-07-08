import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// News & Sentiment Agent function definition
export async function runNewsAgent(companyName, apiKey, onProgress = () => {}) {
  // log update sent
  onProgress({ status: 'news', message: `News Agent: "${companyName}" ke baare me haal hi ki headlines aur press releases fetch kar rahe hain...` });

  const searchQuery = `"${companyName}" recent news headlines developments press release market sentiment`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'news', message: 'News Agent: Positive aur negative catalysts categories classify ho rahi hain...' });

  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a sentiment analyst and market intelligence researcher.
Your task is to review recent news and assess market sentiment for "{companyName}".

CRITICAL INSTRUCTIONS:
- Do NOT write long paragraphs, generic introductions, filler words, or corporate theory.
- Every section MUST contain only 2-3 short, punchy bullet points.
- Lead with hard numbers, specific dates, target prices, partnership values, and names of sources.

Utilize the following news search data:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Output format must be clean Markdown:

### Recent News Highlights
* 2-3 key headlines or press releases from the last 3-6 months (with specific dates/details).

### Positive Sentiment Signals
* 2-3 positive indicators (e.g. broker upgrades, target price increases, brand expansion with numbers).

### Negative Sentiment Signals
* 2-3 negative indicators (e.g. supply delays, litigation, negative catalysts with numbers).

### Overall Sentiment Rating
* Rating: **BULLISH**, **NEUTRAL**, or **BEARISH**.
* Rationale: 1-2 sentence numeric justification explaining the consensus.
`);

  const resultsText = searchResults.results.slice(0, 3).map((r, i) => `[${i+1}] Title: ${r.title}\nSnippet: ${r.content}\n`).join('\n');

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    searchQuery,
    searchAnswer: searchResults.answer,
    searchResultsText: resultsText
  });

  onProgress({ status: 'news_complete', message: 'News Agent: Sentiment mapping aur catalysts classifications complete!' });
  return response.content;
}
