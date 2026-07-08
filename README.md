# InvesTrack - AI Investment Research Assistant

This is a multi-agent equity research assistant built for the InsideIIM x Altuni AI Labs take-home assignment. It takes a company name as input, runs web research, evaluates financial indicators, analyzes sentiment, maps risk profiles, and outputs a consensus recommendation (**INVEST** or **PASS**) with an explanation.

The application has a React frontend (Vite) and an Express backend, communicating via Server-Sent Events (SSE) to show the agent pipeline logs live.

---

## 🛠️ How to Run It

### Prerequisites
* **Node.js** (v18 or higher)
* **npm**

### 1. Installation
Run the root package script to install all frontend and backend dependencies:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
cd server
cp .env.example .env
```

Open `server/.env` and enter your credentials:
```text
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```
* *Note:* If no `GROQ_API_KEY` is present, the app automatically runs in **Sandbox Mode**, using pre-cached mock data to test the frontend dashboards offline without making API calls.

### 3. Launch Development Servers
Go back to the root workspace directory and run:
```bash
npm run dev
```
* **Frontend**: http://localhost:5173
* **Backend**: http://localhost:5000

---

## 🧠 How It Works (Approach & Architecture)

The system utilizes a sequential multi-agent architecture built on **LangChain.js**:

1. **Trigger**: The client starts a Server-Sent Events (SSE) connection.
2. **Search Grounding**: The system searches Google/Tavily for the company's business model, financials, and recent news.
3. **Sequential Pipeline**:
   * **Research Agent**: Scrapes web data to detail the business model, moat strength, and target market.
   * **Financial Agent**: Evaluates revenue growth, profitability margins, cash flows, and 1-year stock returns.
   * **News Agent**: Gathers headlines to calculate consensus market sentiment.
   * **Risk Agent**: Maps out regulatory, competitive, and operational threats.
4. **Decision Agent (CIO)**: Synthesizes all reports into a unified payload (Investment, Confidence, and Risk scores) and returns the final **INVEST** or **PASS** recommendation in a strict JSON format.

---

## ⚖️ Key Decisions & Trade-offs

* **Sequential Pipeline vs. Cyclic Graph (LangGraph)**: I chose a sequential pipeline over a cyclic graph. While LangGraph is useful for complex agent reflection loops, a sequential pipeline is more predictable, executes much faster, prevents infinite loops, and reduces API token costs.
* **Rate-Limit Resilience (Groq API)**: Groq's free tier has low Token-Per-Minute (TPM) limits. To solve this, I added a 12-second delay buffer between agent calls and built a retry wrapper (`withRetry`) that reads the `retry-after` header on HTTP 429 errors.
* **Obfuscated JSON Parsing**: Decision Agent models sometimes include conversational text before or after their JSON output. Rather than failing or relying on fragile native JSON modes, I wrote a robust regex-based parser that finds the outermost curly braces (`{ ... }`) and extracts the clean JSON string.
* **Design Aesthetic**: Replaced standard SaaS layouts with a high-contrast black-and-white neobrutalism design featuring heavy borders and flat shadows, providing a clean, developer-focused aesthetic.

---

## 📝 Example Runs

Here are the outputs returned by the decision agent:

* **Apple Inc (AAPL)** -> **INVEST** (Investment Score: 88/100, Confidence: 92/100, Risk: 35/100)
  * *Share Drop*: `-9.5% from 52-week high`
  * *Verdict*: Strong premium ecosystem and AI upgrade cycles offset hardware volume stagnation.
* **NVIDIA (NVDA)** -> **INVEST** (Investment Score: 95/100, Confidence: 90/100, Risk: 42/100)
  * *Share Drop*: `-12.4% temporary profit-taking pullback`
  * *Verdict*: Domination of AI GPU accelerator supply and developer CUDA ecosystem lock-in.
* **Tesla (TSLA)** -> **INVEST** (Investment Score: 82/100, Confidence: 78/100, Risk: 55/100)
  * *Share Drop*: `-44.2% from peak drawdowns`
  * *Verdict*: Strong energy storage growth and FSD licensing potential offset EV automotive margins.
* **Intel (INTC)** -> **PASS** (Investment Score: 48/100, Confidence: 85/100, Risk: 75/100)
  * *Share Drop*: `-52.6% drop from its 52-week peak`
  * *Verdict*: Structural market share losses, high capital expenses, and manufacturing delays.

---

## 🛠️ What I Would Improve With More Time

1. **Caching**: Store previous company analysis reports in a database (like MongoDB or Redis) to save API credits and prevent repeating identical lookups.
2. **Real-time Stock API**: Integrate a service like Yahoo Finance or AlphaVantage to fetch live trading prices and multiples instead of relying solely on crawled information.
3. **PDF Export**: Add a frontend button to compile the agent reports and export them as a PDF.

---

## 📄 LLM Chat Session Transcripts (Bonus Points)

As requested, the complete conversation logs detailing the pair-programming sessions with the LLM are included:
* **Paths**: `transcripts/transcript.jsonl` and `transcripts/transcript_full.jsonl`
* All personal credentials and secret API keys have been scrubbed using a sanitization script (`scripts/sanitize-transcripts.js`) before committing.
