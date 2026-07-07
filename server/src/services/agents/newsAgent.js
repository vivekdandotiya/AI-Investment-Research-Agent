import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// News & Sentiment Agent function definition
export async function runNewsAgent(companyName, apiKey, onProgress = () => {}) {
  // log update sent
  onProgress({ status: 'news', message: `News Agent: "${companyName}" ke baare me haal hi ki headlines aur press releases fetch kar rahe hain...` });

  const searchQuery = `"${companyName}" recent news headlines developments press release market sentiment`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'news', message: 'News Agent: Positive aur negative catalysts categories classify ho rahi hain...' });

  const model = new ChatGoogle({
    model: "gemini-2.0-flash",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a sentiment analyst and market intelligence researcher.
Your task is to review recent news and assess market sentiment for "{companyName}".

Utilize the following news search data:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Write a comprehensive market sentiment report. Include actual recent headlines or events where possible. Output in Markdown format with the following sections:

### Recent News Highlights
Summarize the most significant news stories or press releases from the last 3-6 months (e.g., product launches, executive changes, litigation, earnings beats/misses).

### Positive Sentiment Signals
List 2-4 positive catalysts or signals (e.g., partnerships, upgrades, new market entry, robust sales figures).

### Negative Sentiment Signals
List 2-4 negative concerns or signals (e.g., negative press, supply chain issues, regulatory scrutiny, public controversies).

### Overall Sentiment Rating
State the overall sentiment clearly: **BULLISH**, **NEUTRAL**, or **BEARISH**. Follow up with a 2-3 sentence justification explaining the prevailing market consensus.
`);

  const resultsText = searchResults.results.map((r, i) => `[${i+1}] Title: ${r.title}\nUrl: ${r.url}\nSnippet: ${r.content}\n`).join('\n');

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
