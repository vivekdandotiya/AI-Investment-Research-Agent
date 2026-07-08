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
  let marketShare = "54.6% US premium smartphone market share.";
  let bondsAndDebt = "Bonds: $109B outstanding. Yield: 4.2%. Rating: AAA (Moody's)";
  let shareGrowthDetails = "Stock price hiked from $172 to $225 (+31.8% returns over the past 12 months).";
  
  if (normalized.includes('tesla')) {
    sector = "Consumer Discretionary (Automotive / Clean Energy)";
    recommendation = "INVEST";
    invScore = 82;
    confScore = 80;
    riskScore = 55;
    bizModel = "Direct-to-consumer electric vehicles, energy storage systems, and full-self-driving subscription software.";
    moat = "Cost leadership in EV manufacturing, brand dominance, and vertical integration.";
    marketShare = "17.6% global battery EV market share.";
    bondsAndDebt = "Bonds: $3.5B. Yield: 5.5%. Rating: BBB (Investment Grade)";
    shareGrowthDetails = "Stock price hiked 24.5% net over 12 months, trading between $138 and $271.";
  } else if (normalized.includes('intel') || normalized.includes('boeing')) {
    recommendation = "PASS";
    sector = "Technology / Industrials";
    invScore = 48;
    confScore = 85;
    riskScore = 75;
    bizModel = "High capital-expenditure manufacturing facing severe market share loss and structural product quality challenges.";
    moat = "Deteriorating technological edge and high competitive pressure from nimble rivals.";
    marketShare = "x86 CPU market share declined from 80% to 65.2% (losing ground to AMD).";
    bondsAndDebt = "Bonds: $48B outstanding. Yield: 6.8%. Rating: BBB- (Downgraded)";
    shareGrowthDetails = "Stock price declined -38.2% over the last year, dropping from $44 to $20.";
  } else if (normalized.includes('nvidia') || normalized.includes('nvda')) {
    sector = "Information Technology (Semiconductors)";
    recommendation = "INVEST";
    invScore = 95;
    confScore = 95;
    riskScore = 42;
    bizModel = "Sells proprietary GPU hardware architectures bundled with the industry-standard CUDA software platform.";
    moat = "Unmatched compute performance, developers locked into CUDA ecosystem, and multi-year supply chain headstart.";
    marketShare = "88.5% global AI chip datacenter accelerator market share.";
    bondsAndDebt = "Bonds: $9.5B outstanding. Yield: 3.8%. Rating: AA- (Stable)";
    shareGrowthDetails = "Stock price hiked +182.4% over 12 months, scaling from $45 to $130 per share.";
  } else if (normalized.includes('greyorange') || normalized.includes('grey orange')) {
    sector = "Warehouse Automation & Robotics";
    recommendation = "INVEST";
    invScore = 85;
    confScore = 80;
    riskScore = 60;
    bizModel = "AI-driven warehouse automation systems, autonomous mobile robots (AMRs), and enterprise SaaS orchestration software.";
    moat = "Strong brand value, proprietary GreyMatter orchestration software, and high switching costs.";
    marketShare = "18.4% global market share in e-commerce warehouse automation robotics.";
    bondsAndDebt = "Bonds: $110M Private Debt notes. Yield: 8.5% interest. Debt Rating: Unrated (Private)";
    shareGrowthDetails = "Private share valuation rose from $950M to $1.4B in Series D round (+47.3% growth).";
  }

  return {
    recommendation,
    investmentScore: invScore,
    confidenceScore: confScore,
    riskScore,
    explanation: `The investment thesis for ${companyName} is based on its strong position in ${sector}. Our multi-agent committee confirms a solid business moat and a high probability of long-term capital preservation, though competitive risks remain a focus.`,
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
      moat: moat,
      marketShare: marketShare
    },
    financialSummary: {
      revenueGrowth: "Steady double-digit growth over the past 5 years, with service revenues offsetting cyclical hardware demand.",
      profitability: "Outstanding gross margins (exceeding 40%) and solid operating margins (around 25-30%).",
      balanceSheet: "Strong net-cash position, high quick ratio, and low debt-to-equity ratio.",
      bondsAndDebt: bondsAndDebt
    },
    sentimentSummary: {
      sentiment: invScore > 75 ? "Bullish" : "Bearish",
      highlights: `Recent product launches and quarterly earnings announcements have surpassed street estimates, reinforcing investor confidence in long-term earnings capability.`
    },
    stockPerformance: (() => {
      if (normalized.includes('tesla')) {
        return {
          ticker: "TSLA",
          recentHikeOrDecline: "Stock hiked 24.5% over the past 12 months with massive volatility, responding to FSD rollout gains and energy storage growth, offset by competitive price pressures.",
          isHikedRecently: true,
          oneYearReturn: "+24.5%",
          previousYearDrop: "-44.2% from peak drawdowns",
          shareGrowthDetails: shareGrowthDetails
        };
      } else if (normalized.includes('intel') || normalized.includes('boeing')) {
        return {
          ticker: normalized.includes('intel') ? "INTC" : "BA",
          recentHikeOrDecline: "Stock declined 38.2% over the past year due to data center market share loss, manufacturing delays, and high cash burn from foundry expansion.",
          isHikedRecently: false,
          oneYearReturn: "-38.2%",
          previousYearDrop: "-52.6% drop from its 52-week peak",
          shareGrowthDetails: shareGrowthDetails
        };
      } else if (normalized.includes('nvidia') || normalized.includes('nvda')) {
        return {
          ticker: "NVDA",
          recentHikeOrDecline: "Stock hiked 182.4% over the last 12 months, driven by explosive global demand for AI compute architectures and datacenter GPU supply dominance.",
          isHikedRecently: true,
          oneYearReturn: "+182.4%",
          previousYearDrop: "-12.4% temporary profit-taking pullback",
          shareGrowthDetails: shareGrowthDetails
        };
      } else if (normalized.includes('apple') || normalized.includes('aapl')) {
        return {
          ticker: "AAPL",
          recentHikeOrDecline: "Stock hiked 31.8% over the past year, supported by Apple Intelligence product cycle anticipation, stable premium hardware demand, and aggressive stock buybacks.",
          isHikedRecently: true,
          oneYearReturn: "+31.8%",
          previousYearDrop: "-9.5% from 52-week high",
          shareGrowthDetails: shareGrowthDetails
        };
      } else if (normalized.includes('greyorange') || normalized.includes('grey orange')) {
        return {
          ticker: "GREY (Private)",
          recentHikeOrDecline: "GreyOrange is privately held; private share valuation hiked by +47.3% to $1.4B following its Series D funding round.",
          isHikedRecently: true,
          oneYearReturn: "+47.3%",
          previousYearDrop: "-12.5% drawdown in private funding rounds",
          shareGrowthDetails: shareGrowthDetails
        };
      } else {
        return {
          ticker: companyName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, ''),
          recentHikeOrDecline: "Stock hiked 14.8% over the last year, exhibiting stable consolidation and consistent support aligning with broader sector growth.",
          isHikedRecently: true,
          oneYearReturn: "+14.8%",
          previousYearDrop: "-15.2% from peak consolidation level",
          shareGrowthDetails: shareGrowthDetails
        };
      }
    })(),
    researchReport: `### Business Review for ${companyName}
* **Sector**: ${sector}
* **Moat Strength**: Strong
* **Market Share**: ${marketShare}
* **Value Prop**: High premium designs and reliable automation software systems.`,
    financialReport: `### Financial Summary for ${companyName}
* **Revenue growth**: +12% YoY
* **Margins**: Gross 44.5%, Operating 30.2%
* **Bonds & Debt Profile**: ${bondsAndDebt}
* **Cash**: Strong cash position with positive net cash flow.`,
    newsReport: `### Market & Media Sentiment for ${companyName}
* **Sentiment**: Bullish
* **Headlines**: ${companyName} announces flagship AI automation partnerships; valuation/price rebounds on target upgrades.`,
    riskReport: `### Corporate Risk Assessment for ${companyName}
* **Systemic Risk**: Moderate
* **Supply Chain**: Reliance on outsourced fabrication and global logistics.
* **Regulatory**: Antitrust compliance in EU and US markets.`
  };
};

const isMissingLlmKey = (apiKey) => (
  !apiKey || apiKey === 'your_groq_api_key_here'
);

// Groq key validation - gsk_ se start hoti hai
const isLikelyLlmApiKey = (apiKey) => (
  typeof apiKey === 'string' && apiKey.trim().length > 10
);

const getLlmApiKey = () => (
  process.env.GROQ_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
);

const getLlmKeyError = () => new Error(
  'Invalid API key. server/.env me GROQ_API_KEY=gsk_... set karo. Free key yahan se lo: https://console.groq.com'
);

// synchronous analysis execution logic (CORS/API calls)
export async function analyzeCompany(companyName, useMockData = false) {
  const apiKey = getLlmApiKey();

  // agar key missing ho to automatic mock data return karo
  if (useMockData || isMissingLlmKey(apiKey)) {
    if (!useMockData) {
      console.warn("GROQ_API_KEY config me nahi mili! Automatic mock mode load kar rhe hain.");
    }
    return getLocalMockData(companyName);
  }

  if (!isLikelyLlmApiKey(apiKey)) {
    throw getLlmKeyError();
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
  const apiKey = getLlmApiKey();

  // sandbox/fallback mode check
  if (useMockData || isMissingLlmKey(apiKey)) {
    const isFallback = !useMockData;
    onEvent({ 
      status: 'warning', 
      message: isFallback 
        ? 'Aler: API Key nahi mila. Sandbox Simulation Mode active ho rha hai...' 
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

  if (!isLikelyLlmApiKey(apiKey)) {
    const error = getLlmKeyError();
    onEvent({ status: 'error', message: `Configuration error: ${error.message}` });
    throw error;
  }

  try {
    // rate limit se bachne ke liye delay + auto retry wrapper
    const rateLimitDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Groq free tier rate limit auto-retry wrapper
    const withRetry = async (fn, maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (err) {
          // agar 429 rate limit error hai to retry-after duration wait karo
          if (err.status === 429 && attempt < maxRetries) {
            const retryAfter = parseInt(err.headers?.get?.('retry-after') || '15', 10);
            const waitTime = (retryAfter + 2) * 1000; // extra 2 seconds buffer
            onEvent({ status: 'warning', message: `Rate limit hit — ${retryAfter}s cooldown wait, auto-retry attempt ${attempt}/${maxRetries}...` });
            await rateLimitDelay(waitTime);
          } else {
            throw err;
          }
        }
      }
    };

    // 1. Research Agent
    const researchReport = await withRetry(() => runResearchAgent(companyName, apiKey, onEvent));
    await rateLimitDelay(12000); // Groq free tier 6K TPM buffer
    
    // 2. Financial Agent
    const financialReport = await withRetry(() => runFinancialAgent(companyName, apiKey, onEvent));
    await rateLimitDelay(12000);

    // 3. News Agent
    const newsReport = await withRetry(() => runNewsAgent(companyName, apiKey, onEvent));
    await rateLimitDelay(12000);

    // 4. Risk Agent
    const riskReport = await withRetry(() => runRiskAgent(companyName, apiKey, onEvent));
    await rateLimitDelay(12000);

    // 5. Decision Agent
    const decision = await withRetry(() => runDecisionAgent({
      companyName,
      researchReport,
      financialReport,
      newsReport,
      riskReport
    }, apiKey, onEvent));

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
