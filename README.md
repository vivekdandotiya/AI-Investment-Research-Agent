# InvesTrack | AI Investment Research Agent Platform

InvesTrack is a production-grade, full-stack, multi-agent investment research web application. Given a target company name, the platform spins up a committee of autonomous AI agents utilizing **LangChain.js** and **Groq (Llama 3.1 8b)** models to collect web intelligence, review financials, analyze sentiment, inspect risks, and compile a final investment thesis with an **INVEST** or **PASS** decision.

---

## 🏗️ System Architecture

The application uses an event-driven, sequential multi-agent workflow. The server streams each agent's execution status to the client in real time using **Server-Sent Events (SSE)**.

```mermaid
graph TD
    User([User Input: Company Name]) --> Search[Search Service: Tavily / Google Search Fallback]
    
    subgraph Agents [Multi-Agent Analysis Pipeline]
        Research[Research Agent: Business Moat & Moat Strength]
        Financial[Financial Analysis Agent: Revenue, Margins & Stock Price Action]
        News[News & Sentiment Agent: Headwinds & Cataloging]
        Risk[Risk Evaluation Agent: Operational & Regulatory Risks]
        
        Search --> Research
        Research --> Financial
        Financial --> News
        News --> Risk
    end
    
    Risk --> Decision[Investment Decision Agent: CIO Portfolio Synthesis]
    
    subgraph Outputs [Structured Outputs]
        Decision --> Rec[Decision: INVEST / PASS]
        Decision --> Stock[Stock: Ticker, 1-Year Returns, Previous Year Share Drop]
        Decision --> Metrics[Gauges: Investment, Confidence, Risk Scores]
        Decision --> Bullets[Highlights & Concerns Bulletins]
    end
    
    Outputs --> UI[Premium Neobrutalist Dashboard React + Recharts]
```

---

## 📂 Project Directory Structure

```text
Insideiim/
├── package.json                   # Workspace root config (concurrent running)
├── README.md                      # Setup & documentation
├── server/                        # Node.js + Express Backend
├── transcripts/                   # LLM pair-programming chat session logs (Bonus points)
│   ├── transcript.jsonl
│   └── transcript_full.jsonl
│   ├── package.json
│   ├── .env                       # API Credentials
│   └── src/
│       ├── index.js               # Express app entry
│       ├── routes/
│       │   └── analyze.js         # API endpoints (POST & SSE)
│       └── services/
│           ├── searchService.js   # Tavily web search integration & fallbacks
│           ├── orchestrator.js    # Sequential agent coordinator with 429 rate limit retry
│           └── agents/            # LangChain Agent classes (utilizing ChatGroq)
│               ├── researchAgent.js
│               ├── financialAgent.js
│               ├── newsAgent.js
│               ├── riskAgent.js
│               └── decisionAgent.js
└── client/                        # React.js + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css              # Custom scrollbars & neobrutalism theme styles
        ├── main.jsx               # React DOM mount
        ├── App.jsx                # Main dashboard view & SSE client
        ├── utils/
        └── components/            # Visual dashboard elements
            ├── SearchBar.jsx      # Input validation & demo triggers
            ├── AgentTerminal.jsx  # Live terminal scrolling outputs
            ├── RecommendationCard.jsx # Verdict & custom aligned SVG Gauges
            ├── CompanyProfileCard.jsx # Corporate segments
            ├── StockPerformanceCard.jsx # Ticker, 1-Year returns, and Share Drop metrics
            ├── FinancialsChart.jsx    # Recharts area graph (Revenue vs Net Income)
            ├── StrengthsWeaknesses.jsx # Highlight bullets
            └── NewsSentimentCard.jsx   # Sentiment scale
```

---

## 🚀 Setup & Installation

Follow these steps to configure and run the application locally.

### Prerequisites

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)

### 1. Clone & Install Dependencies

From the project root (`Insideiim/`), run:

```bash
# Install root, client, and server dependencies
npm run install:all
```

### 2. Configure Environment Variables

Create and edit the `.env` file in the `server/` directory:

```bash
# Navigate to server
cd server
# Create from example
cp .env.example .env
```

Open `server/.env` and supply your credentials:

```text
PORT=5000
GROQ_API_KEY=gsk_... (Get from Groq Console: https://console.groq.com/)
TAVILY_API_KEY=tvly-... (Optional: Get from Tavily: https://tavily.com/)
```

> [!NOTE]
> If `GROQ_API_KEY` is not present, the server automatically defaults to **Sandbox Mode**, which returns rich mock reports for target companies searched. If `TAVILY_API_KEY` is missing but Groq is active, the agents query Groq's internal knowledge base with search queries simulated.

### 3. Launch Development Server

Go back to the root workspace directory and run:

```bash
npm run dev
```

This starts:
- **Express Backend**: http://localhost:5000
- **Vite React Frontend**: http://localhost:5173

Open your browser to **http://localhost:5173** to view the application.

---

## ⚡ API Specifications

### 1. Synchronous Analysis Route
- **Endpoint**: `POST /api/analyze`
- **Body**:
  ```json
  {
    "companyName": "NVIDIA",
    "useMockData": false
  }
  ```
- **Response**: Full synthesized JSON report containing scores, overview details, stock performance metrics, bulleted strengths/concerns, and raw markdown reports.

### 2. Streaming SSE (Server-Sent Events) Route
- **Endpoint**: `GET /api/analyze/stream?companyName=Apple&useMockData=false`
- **Behavior**: Streams progress logs during analysis. Ends with a `complete` event containing the final payload.

---

## 🧠 How It Works (Approach & Architecture)

InvesTrack uses a **pipeline-based multi-agent architecture** built on **LangChain.js** and **Express**:
1. **Triggering the Scan**: The client opens a Server-Sent Events (SSE) connection via `/api/analyze/stream`.
2. **Web Intelligence Grounding**: The search service uses the **Tavily API** to gather real-time data for the company.
3. **Sequential Committee Analysis**:
   - **Research Agent**: Crawls target industry segments to define the business model, target market, and Moat strength.
   - **Financial Agent**: Parses balance sheet metrics, gross margins, cash flows, stock price history, and 1-year returns.
   - **News Agent**: Gathers recent media announcements and determines consensus sentiment.
   - **Risk Agent**: Maps out potential competitive, financial, and regulatory vulnerabilities.
4. **CIO Decision Synthesis**: The **Investment Decision Agent** consumes all reports, calculates scores (Investment, Confidence, Risk), compiles strengths and concerns, and generates the final **INVEST** or **PASS** verdict along with structured stock metrics (`ticker`, `oneYearReturn`, `previousYearDrop`) in a JSON schema.
5. **Rate-Limit Resilience**: Due to strict token-per-minute (TPM) limits on the Groq free tier, the orchestrator implements a **retry-after cooldown timer** and a **12-second spacing interval** between agent executions, ensuring that runs finish cleanly without error.

---

## ⚖️ Key Decisions & Trade-offs

- **Sequential Pipeline with 12s Buffers**: We opted for a sequential pipeline. To prevent the server from hitting Groq's 6,000 TPM limit, we introduced a 12-second buffer between agents and built an auto-retry wrapper that listens to `retry-after` header fields.
- **Robust JSON Extraction**: Instead of relying on strict JSON-mode syntax parameters which can crash or fail depending on the LLM provider, we implemented a custom regex/substring extraction utility that locates the boundaries of `{` and `}` and parses the JSON, handling any markdown formatting.
- **Black-and-White Neobrutalist Design**: Reverted the styling theme to a bold black-and-white Neobrutalist design with solid black borders, dotted grids, and flat drop shadows.
- **Stock Performance Card Integration**: Built a custom widget that presents key price-action details (Ticker, 1-Year Returns, and Share Drop) next to the business profile.

---

## 📝 Example Runs

Here is the synthesized portfolio outputs for four target companies:
1. **Apple Inc (AAPL)** -> **INVEST** (Investment Score: 88, Confidence: 92, Risk: 35)
   - *Share Drop*: `-9.5% from 52-week high`
   - *Rationale*: Exceptional gross margins (45%+), ecosystem lock-in, and upcoming generative AI upgrade cycle offset decelerating hardware volume growth.
2. **NVIDIA Corporation (NVDA)** -> **INVEST** (Investment Score: 95, Confidence: 90, Risk: 42)
   - *Share Drop*: `-12.4% temporary profit-taking pullback`
   - *Rationale*: Absolute dominant share (85%+) in AI GPU accelerators combined with the developer lock-in of the CUDA platform.
3. **Tesla Inc (TSLA)** -> **INVEST** (Investment Score: 82, Confidence: 78, Risk: 55)
   - *Share Drop*: `-44.2% from peak drawdowns`
   - *Rationale*: Strong battery storage deployments and long-term FSD licensing offset automotive gross margin pressure from Chinese EV rivals.
4. **Intel Corporation (INTC)** -> **PASS** (Investment Score: 48, Confidence: 85, Risk: 75)
   - *Share Drop*: `-52.6% drop from its 52-week peak`
   - *Rationale*: Turnaround capital crunch, suspending dividends, and losing datacenter market share to AMD. Foundry turnaround faces execution delays.

---

## 🛠️ What We Would Improve With More Time

1. **Self-Correction Loops**: Incorporate a feedback loop where the Decision Agent can reject reports and send them back to the Research or Financial agents if specific metrics are missing.
2. **Database Cache**: Integrate MongoDB or PostgreSQL to cache previous runs, reducing API costs.
3. **Financial APIs**: Integrate AlphaVantage or Yahoo Finance APIs to pull real-time trading metrics and price-to-earnings multiples.
4. **PDF Exports**: Add a button to export the reports as PDFs.

---

## 📄 LLM Chat Session Transcripts (Bonus Points)

As requested in the assignment guidelines, this project contains the **complete conversation transcript log** detailing our pair-programming session with the LLM. 
- You can find the log files at: `transcripts/transcript.jsonl` and `transcripts/transcript_full.jsonl`.
- To refresh the log folder with the latest conversation history before zipping, run:
  ```bash
  npm run export-logs
  ```

---

## 📦 Submitting / Packaging the Project

To bundle the project into a submission-ready `.zip` file that automatically excludes `node_modules` and `.env` secrets:
```bash
# Exports the latest chat history and zips client, server, scripts, and transcripts
npm run zip
```
This generates **`InsideIIM_TakeHomeAssignment.zip`** in the project root folder.
