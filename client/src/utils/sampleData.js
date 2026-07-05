export const getMockCompanyData = (companyName) => {
  const normalized = companyName.toLowerCase();
  
  if (normalized.includes('nvidia') || normalized.includes('nvda')) {
    return SAMPLE_COMPANIES["NVIDIA Corporation"];
  } else if (normalized.includes('tesla') || normalized.includes('tsla')) {
    return SAMPLE_COMPANIES["Tesla Inc"];
  } else if (normalized.includes('intel') || normalized.includes('intc') || normalized.includes('boeing')) {
    return SAMPLE_COMPANIES["Intel Corporation"];
  }
  
  // Default is Apple Inc
  return SAMPLE_COMPANIES["Apple Inc"];
};

export const SAMPLE_COMPANIES = {
  "Apple Inc": {
    recommendation: "INVEST",
    investmentScore: 88,
    confidenceScore: 92,
    riskScore: 35,
    explanation: "Apple Inc. represents a highly defensive investment with consistent cash flows, premium pricing power, and an unmatched ecosystem lock-in. While hardware growth is leveling off, high-margin service revenue (Apple Music, iCloud, Apple Pay) continues to expand, and upcoming integration of on-device Apple Intelligence presents a strong catalyst for a new device upgrade cycle.",
    strengths: [
      "Unrivaled ecosystem lock-in creating extremely high customer switching costs.",
      "Vast capital return program through continuous share buybacks and dividends.",
      "Exceptional pricing power maintaining gross margins above 44%.",
      "Services business growing at double digits with high operating margins (>70%)."
    ],
    concerns: [
      "Decelerating hardware volume growth (iPhone and iPad saturation).",
      "Heavy reliance on China for manufacturing and assembly (geopolitical threat).",
      "Increasing antitrust regulations in the EU and USA targeting the App Store monopoly."
    ],
    companyProfile: {
      sector: "Information Technology (Consumer Hardware & Services)",
      businessModel: "Designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and sells a variety of related services.",
      moat: "Strong brand value, proprietary software integration, and high switching costs across the iOS ecosystem."
    },
    financialSummary: {
      revenueGrowth: "Steady low-to-mid single-digit total growth. Services segment offset minor fluctuations in device sales.",
      profitability: "Exceptional profitability. Gross margins are stable at 45-46% and Operating Margins remain around 30%.",
      balanceSheet: "Remarkably strong balance sheet with $160B+ in total cash, offset by long-term debt but maintaining a highly secure net cash posture."
    },
    sentimentSummary: {
      sentiment: "Bullish",
      highlights: "Recent announcements around 'Apple Intelligence' (generative AI integration) have sparked bullish upgrades from Wall Street analysts who anticipate a massive upgrade cycle starting in late 2026."
    },
    researchReport: `### Research Agent Review: Apple Inc. (AAPL)

**Sector:** Consumer Technology / Hardware & Software Services
**Business Model:** Premium consumer ecosystem. Apple sells premium devices (iPhone, Mac, iPad, Watch) and monetizes the active base via services (App Store fees, subscription packages, cloud services, and advertising).

#### Moat Strength: Wide
Apple holds a wide economic moat driven by two primary factors:
1. **Switching Costs**: Once a consumer buys an iPhone, Apple Watch, and iPad, the friction of leaving the ecosystem is high. Data, apps, and cross-device integrations function seamlessly, making migration to Android highly disruptive.
2. **Brand Intangibles**: The Apple brand allows the company to command a pricing premium that competitors cannot match.

#### Growth Opportunities:
* **Generative AI Upgrade Cycle**: The introduction of 'Apple Intelligence' will only run on modern chipsets, forcing users with older models to upgrade.
* **Services Monetization**: Growing subscription revenues from Apple TV+, Music, Arcade, and iCloud, which carry higher gross margins than hardware.
* **Healthcare & Augmented Reality**: Long-term growth options in Apple Watch health sensors and spatial computing (Vision Pro).`,
    financialReport: `### Financial Analysis: Apple Inc. (AAPL)

#### Revenue & Profitability Trends
* **Gross Margins**: Consistently hovering around **45-46%**, indicating strong supply chain leverage and premium pricing capability.
* **Operating Margin**: Stable around **30-31%**, showcasing highly efficient operations.
* **EPS Growth**: Boosted by an aggressive share repurchase program, yielding consistent double-digit growth even when net income growth is flat.

#### Balance Sheet & Capital Allocation
* **Cash Position**: Holds **$162 Billion** in cash and marketable securities as of last quarter.
* **Debt Profile**: Holds **$104 Billion** in long-term debt, which is structured at low fixed interest rates. 
* **Capital Return**: Apple returns close to **$80-90 Billion** annually to shareholders via buybacks and dividends, providing an exceptional safety floor for the stock price.`,
    newsReport: `### News & Sentiment Analysis: Apple Inc. (AAPL)

#### Recent News Highlights
* **AI Integration**: Positive reviews of the upcoming iOS system upgrades featuring deep Siri integrations.
* **App Store Litigation**: European commission fines Apple for anti-competitive App Store behaviors, prompting Apple to lower commissions for EU developers.
* **Supply Chain Diversification**: Accelerating manufacturing transfers to India and Vietnam to reduce exposure to geopolitical tensions in mainland China.

#### Sentiment Summary: **BULLISH**
While regulatory hurdles represent a consistent negative headline risk, investor enthusiasm is high regarding the generative AI capabilities, driving the stock near historic highs.`,
    riskReport: `### Risk Assessment: Apple Inc. (AAPL)

#### Business & Operational Risks
* **China Exposure**: Around 85% of hardware assembly remains tied to Chinese manufacturers. Disruptions, tariffs, or geopolitical conflict would severely impact Apple's product availability.

#### Industry & Regulatory Threats
* **Antitrust Crackdowns**: Global regulatory frameworks (DOJ lawsuit in the US, DMA in Europe) targeting the App Store's 30% take-rate. Any forced opening of the operating system to third-party payment gateways threatens high-margin services income.

#### Competitive Threats
* **Android Rivalry**: Resurgent competition in premium smartphone segments, particularly from Huawei in China and Samsung globally.`
  },
  "NVIDIA Corporation": {
    recommendation: "INVEST",
    investmentScore: 95,
    confidenceScore: 90,
    riskScore: 42,
    explanation: "NVIDIA is the undisputed leader in AI computing hardware, holding a virtual monopoly (85%+) in high-performance GPU silicon. Its CUDA software ecosystem creates an massive moat that locks in developers. While valuation multiples are historically high and semiconductor cycles are inherently volatile, the hyper-scale datacenter demand for AI training and inference shows no signs of slowing down.",
    strengths: [
      "Undisputed market share leader (85%+) in GPU accelerators for AI.",
      "Unparalleled software moat via the CUDA development ecosystem.",
      "Outstanding pricing power, yielding gross margins exceeding 75%.",
      "Stellar free cash flow generation with high return on invested capital."
    ],
    concerns: [
      "Extremely high valuation multiples making it susceptible to sharp corrections.",
      "Supply chain bottleneck via dependency on a single manufacturer (TSMC).",
      "Increasing efforts from major tech customers (Google, Amazon, Microsoft) to build custom silicon."
    ],
    companyProfile: {
      sector: "Semiconductors & AI Compute Hardware",
      businessModel: "Designs and sells graphics processing units (GPUs) and integrated compute architectures for gaming, professional visualization, automotive, and high-performance computing (datacenters).",
      moat: "Unbeatable technical hardware performance combined with the CUDA developer ecosystem, creating a deep developer software moat."
    },
    financialSummary: {
      revenueGrowth: "Triple-digit year-over-year revenue expansion driven by exponential demand from cloud service providers for AI chips.",
      profitability: "Hyper-growth in profitability. Gross margins reached a record 76%, and operating margins are above 60%.",
      balanceSheet: "Extremely liquid. Minimal long-term debt ($8.4B) relative to its massive cash flows and cash reserves ($30B+)."
    },
    sentimentSummary: {
      sentiment: "Bullish",
      highlights: "Strong beat-and-raise quarters continuously wow Wall Street, with CEO Jensen Huang outlining multi-generation product roadmaps that extend their lead over AMD and Intel."
    },
    researchReport: `### Research Agent Review: NVIDIA Corporation (NVDA)

**Sector:** Semiconductors / Artificial Intelligence Infrastructures
**Business Model:** Fabless chip designer. NVIDIA designs high-performance computing hardware (GPUs, DPUs, CPUs) and bundles it with proprietary software frameworks (CUDA, Omniverse) to sell to cloud giants, enterprises, and research labs.

#### Moat Strength: Wide
* **Software Moat (CUDA)**: CUDA is the programming language that AI engineers use to compile software for GPU execution. It has been built and refined since 2006, creating a standard that developers refuse to deviate from.
* **Performance Dominance**: Their Hopper (H100/H200) and Blackwell (B200) architectures run AI training and inference tasks significantly faster and with better power efficiency than AMD's alternatives.

#### Growth Opportunities:
* **Sovereign AI**: Governments worldwide establishing local AI datacenters.
* **Autonomous Driving**: Expanding custom compute modules inside auto platforms.
* **Robotics & AI Agents**: Omniverse simulation engines supporting robotics training.`,
    financialReport: `### Financial Analysis: NVIDIA Corporation (NVDA)

#### Revenue & Profitability Trends
* **Revenue**: Increased from $27B in FY23 to over $96B in FY25, a growth curve unprecedented in tech history.
* **Margins**: Gross margins rose to **76%** due to pricing power, where a single GPU server rack can sell for hundreds of thousands of dollars.
* **Operating Efficiency**: Net margins sit above **50%**, yielding billions in monthly free cash flow.

#### Balance Sheet & Liquidity
* **Cash**: Total cash reserves are **$31.4 Billion**.
* **Debt**: Holds negligible debt, leading to an exceptionally clean credit profile.
* **ROIC**: Return on Invested Capital exceeds **70%**, proving highly efficient asset usage.`,
    newsReport: `### News & Sentiment Analysis: NVIDIA Corporation (NVDA)

#### Recent News Highlights
* **Blackwell Launch**: Successful launch of the Blackwell chip platform, with order backlog extending 12+ months.
* **TSMC Supply Expansion**: Working closely with TSMC to expand CoWoS packaging capabilities to relieve supply shortages.
* **Antitrust Inquiries**: Regulatory probes in France and the US regarding their bundled software-hardware sales models.

#### Sentiment Summary: **BULLISH**
Strong institutional support. Despite fears of an 'AI bubble,' the direct earnings translation from NVIDIA's customers supports their underlying market cap.`,
    riskReport: `### Risk Assessment: NVIDIA Corporation (NVDA)

#### Business & Operational Risks
* **TSMC Fabrication Risk**: 100% of NVIDIA's leading-edge chips are manufactured by TSMC in Taiwan. Any geopolitical action or natural disaster affecting Taiwan would stop NVIDIA's business immediately.
* **Supply Constraints**: Relies on specialized high-bandwidth memory (HBM) suppliers; packaging bottlenecks restrict delivery.

#### Industry & Regulatory Threats
* **China Tech Sanctions**: U.S. government restricts exports of high-end AI chips to China, cutting off a historically large revenue region.
* **In-House Competitors**: Major buyers (Microsoft, AWS, Google) are developing custom ASIC alternatives to save compute costs.`
  },
  "Tesla Inc": {
    recommendation: "INVEST",
    investmentScore: 82,
    confidenceScore: 78,
    riskScore: 55,
    explanation: "Tesla remains the global leader in battery electric vehicles (BEVs) and energy storage systems. Although the core automotive market is experiencing margin compression due to global pricing pressure and cheaper Chinese rivals, Tesla's long-term growth rests on its Full Self-Driving (FSD) software model, humanoid robotics development, and scale advantages in battery chemistry.",
    strengths: [
      "Unmatched cost efficiency and scale in electric vehicle manufacturing.",
      "Rapidly growing Energy Storage division (Megapack deployments).",
      "Vast Supercharger charging infrastructure network acting as a utility.",
      "Substantial cash reserves ($29B+) to fund ongoing capital expenditure."
    ],
    concerns: [
      "Automotive gross margins squeezed by aggressive global EV price cuts.",
      "Intensifying competition from Chinese EV makers (like BYD) operating at lower costs.",
      "High executive key-man risk centered around CEO Elon Musk."
    ],
    companyProfile: {
      sector: "Automotive & Energy Storage",
      businessModel: "Designs, manufactures, and leases electric vehicles, solar energy systems, and battery storage products; sells autonomous driving software packages.",
      moat: "Direct-to-consumer sales model, global charging grid ownership, and proprietary battery manufacturing technology."
    },
    financialSummary: {
      revenueGrowth: "Moderate automotive revenue growth, supplemented by explosive double-digit growth in Tesla Energy Storage deployments.",
      profitability: "Automotive margins declined from peaks of 25% down to 17-18% due to vehicle discounts, offset by cost-cutting initiatives.",
      balanceSheet: "Strong net-cash position with over $29B in cash and cash equivalents, and negligible debt."
    },
    sentimentSummary: {
      sentiment: "Neutral",
      highlights: "Investors are looking past quarterly automotive volume soft spots and are focusing on updates regarding the Robotaxi network and autonomous driving FSD beta improvements."
    },
    researchReport: `### Research Agent Review: Tesla Inc. (TSLA)

**Sector:** Electric Mobility / Energy Infrastructure / AI Software
**Business Model:** Vertically integrated hardware and software producer. Tesla manufactures electric cars, batteries, and solar tiles, and sells high-margin Full Self-Driving (FSD) subscription packages.

#### Moat Strength: Narrow-to-Wide
* **Charging Network**: The Tesla Supercharger network is the gold standard, forcing competing automakers to adopt Tesla's charging connector.
* **Manufacturing Cost**: Giga-press casting and gigafactory scale allow Tesla to manufacture cars at a lower cost-per-vehicle than traditional legacy OEMs.

#### Growth Opportunities:
* **FSD Licensing**: Licensing autonomous software to other automakers.
* **Energy Storage**: Battery packs (Powerwall/Megapack) growing at triple-digit rates.
* **Robotics**: 'Optimus' humanoid robot designed for industrial applications.`,
    financialReport: `### Financial Analysis: Tesla Inc. (TSLA)

#### Margins & Profitability
* **Gross Margin**: Squeezed to **17.5%** in recent quarters due to vehicle discounts.
* **Capex Program**: Investing **$8-10 Billion** annually to expand factories in Texas and Berlin, and scale AI training clusters.

#### Capital Structure
* **Cash Position**: Holds **$29.1 Billion** in liquid assets.
* **Long-Term Debt**: Virtually zero (under $1B, excluding vehicle financing), making it highly resilient to credit markets.`,
    newsReport: `### News & Sentiment Analysis: Tesla Inc. (TSLA)

#### Recent News Highlights
* **FSD Progress**: Launch of FSD v12 showing improved end-to-end neural network driving.
* **Global Sales Slump**: Sluggish EV adoption in Europe and China prompts factory shifts.
* **Robotaxi Event**: Unveiling of dedicated autonomous vehicle concepts.

#### Sentiment Summary: **NEUTRAL**
Market is in a transitional phase; near-term auto sales represent a challenge, but structural AI and battery storage narratives keep valuations elevated.`,
    riskReport: `### Risk Assessment: Tesla Inc. (TSLA)

#### Business & Operational Risks
* **BYD and Chinese Competition**: Chinese manufacturers offer ultra-low-cost electric vehicles, restricting Tesla's pricing power in European and Asian markets.
* **Musk Key-Man Risk**: Valuation is heavily dependent on Elon Musk's leadership and vision.

#### Financial Risks
* **Valuation Disconnect**: Tesla is valued as a software/AI company, but still gets 80% of revenue from manufacturing automotive hardware, leaving it vulnerable to valuation corrections.`
  },
  "Intel Corporation": {
    recommendation: "PASS",
    investmentScore: 48,
    confidenceScore: 85,
    riskScore: 75,
    explanation: "Intel Corporation is in the midst of a high-risk corporate turnaround. It has lost significant market share in personal compute and server datacenters to AMD, and is far behind NVIDIA in AI workloads. Its ambitious plan to build a leading foundry business requires enormous capital expenditures that are draining cash reserves, leading to high leverage and dividend cuts.",
    strengths: [
      "Strong support from the U.S. Government via CHIPS Act subsidies ($8.5B+ in grants).",
      "Large legacy market share in x86 PC client CPUs.",
      "Expanding presence in open-standards AI networking silicon."
    ],
    concerns: [
      "Decade-long loss of technological leadership to TSMC in chip fabrication.",
      "Negative free cash flow and high debt load ($48B+) causing dividend suspensions.",
      "Market share losses in high-margin datacenter CPUs to AMD."
    ],
    companyProfile: {
      sector: "Semiconductors & Foundry Services",
      businessModel: "Designs and manufactures microprocessors and chipset architectures; transitioning to an IDM 2.0 model to provide contract manufacturing services (foundries) to external chip designers.",
      moat: "Declining. Intellectual property in x86 architecture and massive domestic fabrication plants, though technological lead has eroded."
    },
    financialSummary: {
      revenueGrowth: "Negative-to-flat revenue growth, with client computing and datacenter groups showing contractions.",
      profitability: "Gross margins contracted from historical levels of 60% down to under 40% due to factory underutilization and high retooling costs.",
      balanceSheet: "Strained balance sheet with over $48B in debt, prompting ratings downgrades and restructuring measures."
    },
    sentimentSummary: {
      sentiment: "Bearish",
      highlights: "Earnings misses, workforce layoffs (15%+), and the suspension of the dividend have triggered substantial institutional selling, with investors waiting for proof of foundry execution."
    },
    researchReport: `### Research Agent Review: Intel Corporation (INTC)

**Sector:** Semiconductors / Integrated Device Manufacturer (IDM)
**Business Model:** Integrated chip designer and manufacturer. Transitioning to 'Intel Foundry Services' to act as a contract fabrication shop for third-party chip design firms.

#### Moat Strength: Narrow and Weakening
Intel's historic x86 duopoly moat has weakened:
* **AMD Execution**: AMD has outsourced manufacturing to TSMC, allowing AMD chips to beat Intel chips in power and performance.
* **Arm Transition**: Apple's M-series chips and Qualcomm's Windows ARM processors are cannibalizing Intel's PC client market.

#### Turnaround Plan: IDM 2.0
The primary thesis is that Intel will become the leading Western foundry, backed by the U.S. government to secure local semiconductor supply chains.`,
    financialReport: `### Financial Analysis: Intel Corporation (INTC)

#### Revenue & Cash Flow Strains
* **Revenue**: Declined from $79B in 2021 to around $54B, hitting margins hard.
* **Free Cash Flow**: Negative **$12-14 Billion** annually due to massive capital expenditures on new fabs in Ohio and Oregon.
* **Dividend**: Suspended in late 2024 to conserve cash.

#### Balance Sheet Leverage
* **Net Debt**: Debt has expanded to **$48.5 Billion**, while cash reserves are limited to around $11B, resulting in a credit rating downgrade.`,
    newsReport: `### News & Sentiment Analysis: Intel Corporation (INTC)

#### Recent News Highlights
* **Layoffs and Restructuring**: Intel announced plans to lay off 15,000+ workers to cut $10B in expenses.
* **CHIPS Act Funding**: Approved for up to $8.5 Billion in direct grants and $11 Billion in low-interest loans.
* **Foundry Customer Losses**: Public statements reveal that external chip designers are slow to adopt Intel's 18A process node.

#### Sentiment Summary: **BEARISH**
Extremely low investor confidence. The stock has experienced historic single-day crashes, and the board is facing pressure to spin off the manufacturing business.`,
    riskReport: `### Risk Assessment: Intel Corporation (INTC)

#### Financial & Operational Risks
* **Turnaround Execution Failure**: Fabs take 4-5 years to build. If Intel's 18A process node fails to win massive client contracts (like Apple, Qualcomm, or Nvidia), the foundry business will operate at a massive loss.

#### Competitive Threats
* **AMD datacenters**: AMD's EPYC server chips continue to take server market share, eroding Intel's primary cash cow.`
  }
};
