import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchWeb } from "../searchService.js";

/**
 * Executes the Risk Analysis Agent workflow.
 * 
 * @param {string} companyName - The company to analyze
 * @param {string} apiKey - Gemini API Key
 * @param {function} onProgress - Callback to stream status updates
 * @returns {Promise<string>} - Detailed Markdown report of corporate risks
 */
export async function runRiskAgent(companyName, apiKey, onProgress = () => {}) {
  onProgress({ status: 'risks', message: `Risk Agent: Scanning threat matrices and regulatory challenges for "${companyName}"...` });

  const searchQuery = `"${companyName}" business risks competitive threats financial risks industry challenges regulatory issues`;
  const searchResults = await searchWeb(searchQuery);

  onProgress({ status: 'risks', message: 'Risk Agent: Evaluating vulnerability severity and systemic risks...' });

  const model = new ChatGoogle({
    model: "gemini-1.5-flash",
    apiKey: apiKey,
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a senior risk officer and risk management consultant.
Your task is to analyze the operational, industrial, and financial risk profiles for "{companyName}".

Utilize the following risk-related web search data to guide your analysis:
---
Search Query: {searchQuery}
Search Answer: {searchAnswer}
Search Details: {searchResultsText}
---

Draft a rigorous risk evaluation report. Output in Markdown format with the following sections:

### Business & Operational Risks
Identify internal operational risks (e.g., key man risk, manufacturing disruptions, reliance on specific suppliers, technological disruption, cyber threats).

### Industry & Regulatory Risks
Detail external threats originating from industry shifts (e.g., changes in consumer preferences, technological cycles) and regulatory changes (e.g., antitrust investigations, environmental policies, tariff walls).

### Competitive Threats
Identify aggressive maneuvers from rivals, low barriers to entry, pricing wars, or disruptive products threatening {companyName}'s market share.

### Financial Risks
Discuss financial structure risks, cash burn rates, interest rate sensitivity, currency fluctuation exposures, and credit risks.
`);

  const resultsText = searchResults.results.map((r, i) => `[${i+1}] Title: ${r.title}\nUrl: ${r.url}\nSnippet: ${r.content}\n`).join('\n');

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    companyName,
    searchQuery,
    searchAnswer: searchResults.answer,
    searchResultsText: resultsText
  });

  onProgress({ status: 'risks_complete', message: 'Risk Agent: Threat screening and risk vulnerability matrix complete.' });
  return response.content;
}
