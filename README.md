# InvesTrack | AI Investment Research Agent Platform

InvesTrack is a production-grade, full-stack, multi-agent investment research web application. Given a target company name, the platform spins up a committee of autonomous AI agents utilizing **LangChain.js** and **Google Gemini** models to collect intelligence, review financials, analyze sentiment, inspect risks, and compile a final investment thesis with an **INVEST** or **PASS** decision.

---

## 🏗️ System Architecture

The application uses an event-driven, sequential multi-agent workflow. The server streams each agent's execution status to the client in real time using **Server-Sent Events (SSE)**.

```mermaid
graph TD
    User([User Input: Company Name]) --> Search[Search Service: Tavily / Google Search Fallback]
    
    subgraph Agents [Multi-Agent Analysis Pipeline]
        Research[Research Agent: Business Moat & Moat Strength]
        Financial[Financial Analysis Agent: Revenue Growth & Profitability]
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
        Decision --> Metrics[Gauges: Investment, Confidence, Risk Scores]
        Decision --> Bullets[Highlights & Concises Bulletins]
    end
    
    Outputs --> UI[Premium SaaS Dashboard React + Recharts]
```

---

## 📂 Project Directory Structure

```text
Insideiim/
├── package.json                   # Workspace root config (concurrent running)
├── README.md                      # Setup & documentation
├── server/                        # Node.js + Express Backend
│   ├── package.json
│   ├── .env                       # API Credentials
│   └── src/
│       ├── index.js               # Express app entry
│       ├── routes/
│       │   └── analyze.js         # API endpoints (POST & SSE)
│       └── services/
│           ├── searchService.js   # Tavily web search integration & fallbacks
│           ├── orchestrator.js    # Sequential agent execution coordinator
│           └── agents/            # LangChain Agent classes
│               ├── researchAgent.js
│               ├── financialAgent.js
│               ├── newsAgent.js
│               ├── riskAgent.js
│               └── decisionAgent.js
└── client/                        # React.js + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js         # Theme & Color setup
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── index.css              # Custom scrollbars & glassmorphism
        ├── main.jsx               # React DOM mount
        ├── App.jsx                # Main dashboard view & SSE client
        ├── utils/
        │   └── sampleData.js      # Mock company profiles (offline fallback)
        └── components/            # Visual dashboard elements
            ├── SearchBar.jsx      # Input validation & demo triggers
            ├── AgentTerminal.jsx  # Live terminal scrolling outputs
            ├── RecommendationCard.jsx # Verdict & custom SVG Gauges
            ├── CompanyProfileCard.jsx # Corporate segments
            ├── FinancialsChart.jsx    # Recharts area graph
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
GOOGLE_API_KEY=AIzaSy... (Get from Google AI Studio: https://aistudio.google.com/)
TAVILY_API_KEY=tvly-... (Optional: Get from Tavily: https://tavily.com/)
```

> [!NOTE]
> If `GOOGLE_API_KEY` is not present, the server automatically defaults to **Sandbox Mode**, which returns rich mock reports for any company searched. If `TAVILY_API_KEY` is missing but Gemini is active, the agents query Gemini's internal knowledge base with search queries simulated.

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
- **Response**: Full synthesized JSON report containing scores, overview details, bulleted strengths/concerns, and raw markdown reports.

### 2. Streaming SSE (Server-Sent Events) Route
- **Endpoint**: `GET /api/analyze/stream?companyName=Apple&useMockData=false`
- **Behavior**: Streams progress logs during analysis. Ends with a `complete` event containing the final payload.

---

## 🧠 How It Works (Approach & Architecture)

InvesTrack uses a **pipeline-based multi-agent architecture** built on **LangChain.js** and **Express**:
1. **Triggering the Scan**: The client opens a Server-Sent Events (SSE) connection via `/api/analyze/stream`.
2. **Web Intelligence Grounding**: The search service uses the **Tavily API** to gather real-time data for the company.
3. **Sequential Committee Analysis**:
   - **Research Agent**: Crawls target industry segments to define the business model, target market, and competitor Moat strength.
   - **Financial Agent**: Parses balance sheet metrics, gross margins, cash flows, and CAGR trends.
   - **News Agent**: Gathers recent media announcements and determines consensus sentiment.
   - **Risk Agent**: Maps out potential competitive, financial, and regulatory vulnerabilities.
4. **CIO Decision Synthesis**: The **Investment Decision Agent** consumes all reports, calculates scores (Investment, Confidence, Risk), compiles strengths and concerns, and generates the final **INVEST** or **PASS** verdict in a structured JSON schema using Gemini's native JSON mode.

---

## ⚖️ Key Decisions & Trade-offs

- **Sequential Pipeline vs. Cyclic Graphs (LangGraph)**: We opted for a sequential chain layout. While a cyclic graph (LangGraph) allows recursive reflection, a sequential pipeline is more deterministic, reduces API token usage, runs faster, and avoids infinite loops while maintaining high analytical rigor.
- **Graceful Search Fallbacks**: Real-time web crawlers often hit rate limits or require subscription keys. We implemented a fallback using Gemini's built-in model knowledge with simulated queries if the Tavily API key is missing. This ensures the app is always functional.
- **Gemini-Native JSON Mode**: Instead of relying on brittle regex matching to parse JSON blocks from LLM strings, we set `responseMimeType: "application/json"`. This guarantees that the Decision Agent outputs syntactically correct JSON for the dashboard.
- **Light-Mode Neobrutalist Design**: We moved away from standard Tailwind gradients to a bold light-mode Neobrutalist design with solid black borders and drop shadows. This creates a high-contrast layout that is easy to read.

---

## 📝 Example Runs

Here is the synthesized portfolio outputs for four target companies:
1. **Apple Inc (AAPL)** -> **INVEST** (Investment Score: 88, Confidence: 92, Risk: 35)
   - *Rationale*: Exceptional gross margins (45%+), ecosystem lock-in, and upcoming generative AI upgrade cycle offset decelerating hardware volume growth.
2. **NVIDIA Corporation (NVDA)** -> **INVEST** (Investment Score: 95, Confidence: 90, Risk: 42)
   - *Rationale*: Absolute dominant share (85%+) in AI GPU accelerators combined with the developer lock-in of the CUDA platform.
3. **Tesla Inc (TSLA)** -> **INVEST** (Investment Score: 82, Confidence: 78, Risk: 55)
   - *Rationale*: Strong battery storage deployments and long-term FSD licensing offset automotive gross margin pressure from Chinese EV rivals.
4. **Intel Corporation (INTC)** -> **PASS** (Investment Score: 48, Confidence: 85, Risk: 75)
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

