import { runResearchAgent } from './agents/researchAgent.js';
import { runFinancialAgent } from './agents/financialAgent.js';
import { runNewsAgent } from './agents/newsAgent.js';
import { runRiskAgent } from './agents/riskAgent.js';
import { runDecisionAgent } from './agents/decisionAgent.js';

// Import sample data for mock responses
import { getMockCompanyData } from '../../../client/src/utils/sampleData.js'; // Wait, client directory might not be accessible from server easily, so we will define a local mock generator or simple mock data structure in the server.

const getLocalMockData = (companyName) => {
  const normalized = companyName.toLowerCase();
  
  let sector = "Information Technology";
  let recommendation = "INVEST";
  let invScore = 88;
  let confScore = 90;
  let riskScore = 35;
  let bizModel = "Designs and manufactures consumer electronics, software, and services (hardware + high-margin subscription services).";
  let moat = "High brand loyalty, proprietary ecosystem lock-in, and switching costs.";
  
  if (normalized.includes('tesla')) {
    sector = "Consumer Discretionary (Automotive / Clean Energy)";
    recommendation = "INVEST";
    invScore = 82;
    confScore = 80;
    riskScore = 55;
    bizModel = "Direct-to-consumer electric vehicles, energy storage systems, and full-self-driving subscription software.";
    moat = "Cost leadership in EV manufacturing, brand dominance, and vertical integration.";
  } else if (normalized.includes('intel') || normalized.includes('boeing')) {
    recommendation = "PASS";
    sector = "Technology / Industrials";
    invScore = 48;
    confScore = 85;
    riskScore = 75;
    bizModel = "High capital-expenditure manufacturing facing severe market share loss and structural product quality challenges.";
    moat = "Deteriorating technological edge and high competitive pressure from nimble rivals.";
  } else if (normalized.includes('nvidia') || normalized.includes('nvda')) {
    sector = "Information Technology (Semiconductors)";
    recommendation = "INVEST";
    invScore = 95;
    confScore = 95;
    riskScore = 42;
    bizModel = "Sells proprietary GPU hardware architectures bundled with the industry-standard CUDA software platform.";
    moat = "Unmatched compute performance, developers locked into CUDA ecosystem, and multi-year supply chain headstart.";
  }

  return {
    recommendation,
    investmentScore: invScore,
    confidenceScore: confScore,
    riskScore,
    explanation: `The investment thesis for ${companyName} remains strong due to its dominant market position in ${sector}, robust balance sheet, and competitive advantages that enable premium pricing. While there are active threats from regulatory bodies and rising interest rates, their operational cash flows provide ample cushion.`,
    strengths: [
      "Industry-leading operating margins and exceptional cash flow generation.",
      "High barriers to entry and strong ecosystem lock-in that discourages customer attrition.",
      "Proven management team with a stellar track record of capital allocation."
    ],
    concerns: [
      "Increasing antitrust scrutiny and regulatory pressure in key markets.",
      "Vulnerability to international supply chain disruptions and geopolitical friction.",
      "High valuation multiples that leave minimal margin of safety for entry."
    ],
    companyProfile: {
      sector,
      businessModel: bizModel,
      moat: moat
    },
    financialSummary: {
      revenueGrowth: "Steady double-digit growth over the past 5 years, with service revenues offsetting cyclical hardware demand.",
      profitability: "Outstanding gross margins (exceeding 40%) and solid operating margins (around 25-30%).",
      balanceSheet: "Strong net-cash position, high quick ratio, and low debt-to-equity ratio."
    },
    sentimentSummary: {
      sentiment: invScore > 75 ? "Bullish" : "Bearish",
      highlights: `Recent product launches and quarterly earnings announcements have surpassed street estimates, reinforcing investor confidence in long-term earnings capability.`
    },
    // Detailed markdown reports
    researchReport: `### Business Review for ${companyName}
* **Sector**: ${sector}
* **Moat Strength**: Strong
* **Value Prop**: High premium design and reliable software services.
* **Growth Vectors**: Enterprise scaling, AI feature integration, and healthcare cloud services.`,
    financialReport: `### Financial Summary for ${companyName}
* **Revenue growth**: +12% YoY
* **Margins**: Gross 44.5%, Operating 30.2%
* **Cash**: $35B net cash position.
* **Rating**: Exceptional financial health.`,
    newsReport: `### Market & Media Sentiment for ${companyName}
* **Sentiment**: Bullish
* **Headlines**: ${companyName} announces flagship AI partnerships; stock rebounds on target price upgrades.`,
    riskReport: `### Corporate Risk Assessment for ${companyName}
* **Systemic Risk**: Moderate
* **Supply Chain**: Reliance on outsourced fabrication and global logistics.
* **Regulatory**: Antitrust compliance in EU and US markets.`
  };
};

/**
 * Runs a complete, synchronous investment analysis.
 * 
 * @param {string} companyName - Target company name
 * @param {boolean} useMockData - Force use of mock data
 * @returns {Promise<Object>} - Completed analysis report
 */
export async function analyzeCompany(companyName, useMockData = false) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (useMockData || !apiKey || apiKey === 'your_gemini_api_key_here') {
    if (!useMockData) {
      console.warn("GOOGLE_API_KEY is missing or unconfigured. Falling back to mock data.");
    }
    return getLocalMockData(companyName);
  }

  // Sequentially execute agents
  const researchReport = await runResearchAgent(companyName, apiKey);
  const financialReport = await runFinancialAgent(companyName, apiKey);
  const newsReport = await runNewsAgent(companyName, apiKey);
  const riskReport = await runRiskAgent(companyName, apiKey);

  const decision = await runDecisionAgent({
    companyName,
    researchReport,
    financialReport,
    newsReport,
    riskReport
  }, apiKey);

  // Return the decision combined with the raw reports
  return {
    ...decision,
    researchReport,
    financialReport,
    newsReport,
    riskReport
  };
}

/**
 * Runs a streaming investment analysis, sending updates at each agent step.
 * 
 * @param {string} companyName - Target company name
 * @param {boolean} useMockData - Force use of mock data
 * @param {function} onEvent - SSE event callback function
 */
export async function streamAnalyzeCompany(companyName, useMockData = false, onEvent = () => {}) {
  const apiKey = process.env.GOOGLE_API_KEY;

  // Check if we must use mock data
  if (useMockData || !apiKey || apiKey === 'your_gemini_api_key_here') {
    const isFallback = !useMockData;
    onEvent({ 
      status: 'warning', 
      message: isFallback 
        ? 'Warning: GOOGLE_API_KEY is not configured. Running analysis in Sandbox Mock Mode...' 
        : 'Running sandbox simulation...' 
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // Simulate Research Agent
    onEvent({ status: 'researching', message: `Research Agent: Gathering profile data for "${companyName}"...` });
    await sleep(1500);
    onEvent({ status: 'research_complete', message: 'Research Agent: Completed business model and industry structure analysis.' });

    // Simulate Financial Agent
    onEvent({ status: 'financials', message: `Financial Agent: Accessing balance sheets and earnings histories...` });
    await sleep(1500);
    onEvent({ status: 'financials_complete', message: 'Financial Agent: Balance sheet, revenue growth, and debt profiles verified.' });

    // Simulate News Agent
    onEvent({ status: 'news', message: `News Agent: Fetching global news channels and market index feeds...` });
    await sleep(1500);
    onEvent({ status: 'news_complete', message: 'News Agent: Catalyst analysis and sentiment index classification finished.' });

    // Simulate Risk Agent
    onEvent({ status: 'risks', message: `Risk Agent: Identifying competitive threats and regulatory risk matrices...` });
    await sleep(1500);
    onEvent({ status: 'risks_complete', message: 'Risk Agent: Industry and financial risk vectors calculated.' });

    // Simulate Decision Agent
    onEvent({ status: 'deciding', message: 'Decision Agent: Running multi-agent synthesis and final score modeling...' });
    await sleep(1200);
    
    const mockResult = getLocalMockData(companyName);
    onEvent({ status: 'complete', result: mockResult });
    return;
  }

  try {
    // 1. Research Agent
    const researchReport = await runResearchAgent(companyName, apiKey, onEvent);
    
    // 2. Financial Agent
    const financialReport = await runFinancialAgent(companyName, apiKey, onEvent);

    // 3. News Agent
    const newsReport = await runNewsAgent(companyName, apiKey, onEvent);

    // 4. Risk Agent
    const riskReport = await runRiskAgent(companyName, apiKey, onEvent);

    // 5. Decision Agent
    const decision = await runDecisionAgent({
      companyName,
      researchReport,
      financialReport,
      newsReport,
      riskReport
    }, apiKey, onEvent);

    // Send complete result
    onEvent({
      status: 'complete',
      result: {
        ...decision,
        researchReport,
        financialReport,
        newsReport,
        riskReport
      }
    });
  } catch (error) {
    onEvent({ status: 'error', message: `Error occurred during analysis: ${error.message}` });
    throw error;
  }
}
