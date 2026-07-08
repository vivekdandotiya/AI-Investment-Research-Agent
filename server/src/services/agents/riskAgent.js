import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

// Risk Analysis Agent code function
export async function runRiskAgent(companyName, apiKey, onProgress = () => {}) {
  // log update sent
  onProgress({ status: 'risks', message: `Risk Agent: "${companyName}" ke competitors aur operational risk structures identify kar rahe hain...` });

  const searchQuery = `"${companyName}" business risks competitive threats financial risks industry challenges regulatory issues`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'risks', message: 'Risk Agent: Competitive threats aur regulatory risk indexes evaluate kar rahe hain...' });

  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a senior risk officer and risk management consultant.
Your task is to analyze the operational, industrial, and financial risk profiles for "{companyName}".

CRITICAL INSTRUCTIONS:
- Do NOT write long paragraphs, generic introductions, filler words, or corporate theory.
- Every section MUST contain only 2-3 short, punchy bullet points.
- Lead with hard numbers, concentration ratios, interest coverages, and specific competitor products/regulatory laws.

Utilize the following risk-related web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Output format must be clean Markdown:

### Business & Operational Risks
* 2-3 specific operational vulnerabilities (e.g. supplier concentration, cyber threats, key man metrics).

### Industry & Regulatory Risks
* 2-3 industry headwinds (e.g. antitrust lawsuits, custom tariff impacts, carbon tax values).

### Competitive Threats
* 2-3 aggressive moves by specific competitors (e.g. price drops, product feature launches).

### Financial Risks
* 2-3 balance sheet threats (e.g. high debt refinancing costs, cash burn rates, FX exposures).
`);

  const resultsText = searchResults.results.slice(0, 3).map((r, i) => `[${i+1}] Title: ${r.title}\nSnippet: ${r.content}\n`).join('\n');

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    searchQuery,
    searchAnswer: searchResults.answer,
    searchResultsText: resultsText
  });

  onProgress({ status: 'risks_complete', message: 'Risk Agent: Industry aur operational threat matrices scan pura ho gaya hai!' });
  return response.content;
}
