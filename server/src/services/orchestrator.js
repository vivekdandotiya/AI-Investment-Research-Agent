import { runResearchAgent } from './agents/researchAgent.js';
import { runFinancialAgent } from './agents/financialAgent.js';
import { runNewsAgent } from './agents/newsAgent.js';
import { runRiskAgent } from './agents/riskAgent.js';
import { runDecisionAgent } from './agents/decisionAgent.js';

// mock data fallback helper function - agar sandbox mode active ho to ye load hoga
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
    // agents ke detailed markdown reports
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

// synchronous analysis execution logic (CORS/API calls)
export async function analyzeCompany(companyName, useMockData = false) {
  const apiKey = process.env.GOOGLE_API_KEY;

  // agar key missing ho to automatic mock data return karo
  if (useMockData || !apiKey || apiKey === 'your_gemini_api_key_here') {
    if (!useMockData) {
      console.warn("GOOGLE_API_KEY config me nahi mili! Automatic mock mode load kar rhe hain.");
    }
    return getLocalMockData(companyName);
  }

  // sequentially agents chala kar report compile kar rahe hain
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

  // decision object aur reports ko jodkar send kiya
  return {
    ...decision,
    researchReport,
    financialReport,
    newsReport,
    riskReport
  };
}

// streaming workflow execution logic (SSE)
export async function streamAnalyzeCompany(companyName, useMockData = false, onEvent = () => {}) {
  const apiKey = process.env.GOOGLE_API_KEY;

  // sandbox/fallback mode check
  if (useMockData || !apiKey || apiKey === 'your_gemini_api_key_here') {
    const isFallback = !useMockData;
    onEvent({ 
      status: 'warning', 
      message: isFallback 
        ? 'Aler: Gemini API Key nahi mila. Sandbox Simulation Mode active ho rha hai...' 
        : 'Sandbox simulation execute ho rahi hai...' 
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // simulated sequential logging with delays
    onEvent({ status: 'researching', message: `Research Agent: "${companyName}" ke baare me index trends extract kar rha hai...` });
    await sleep(1500);
    onEvent({ status: 'research_complete', message: 'Research Agent: Corporate profile and competitive structure index complete.' });

    onEvent({ status: 'financials', message: `Financial Agent: Balance sheet ratios aur revenue performance examine kar rha hai...` });
    await sleep(1500);
    onEvent({ status: 'financials_complete', message: 'Financial Agent: Balance sheet structural audit aur FCF evaluations finished.' });

    onEvent({ status: 'news', message: `News Agent: Global media sources aur social catalysts scrape ho rahe hain...` });
    await sleep(1500);
    onEvent({ status: 'news_complete', message: 'News Agent: Catalyst mapping aur sentiment consensus indexes calculate ho gaye hain.' });

    onEvent({ status: 'risks', message: `Risk Agent: Market volatility aur regulatory threats index compile kar rha hai...` });
    await sleep(1500);
    onEvent({ status: 'risks_complete', message: 'Risk Agent: Industry aur systemic liability metrics map ho gayi hain.' });

    onEvent({ status: 'deciding', message: 'Decision Agent: CIO panel consensus synthetic scoring apply kar rha hai...' });
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

    // full report complete data packet stream close event me bheja
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
    onEvent({ status: 'error', message: `Orchestrator error: ${error.message}` });
    throw error;
  }
}
