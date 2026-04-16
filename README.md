# 📊 AI Trading Assistant

A production-ready mobile app for AI-powered Indian stock market analysis (NSE/BSE). Chat interface with real-time Nifty/BankNifty insights, options strategies (Iron Condor, Straddle, Bull/Bear spreads), and news sentiment integration.

---

## 🗂 Project Structure

```
ai-trading-assistant/
├── backend/
│   ├── server.js                 # Express API server
│   ├── routes/
│   │   └── analyze.js            # POST /analyze, GET /analyze/snapshot
│   ├── services/
│   │   ├── aiService.js          # Claude AI + rule-based fallback
│   │   ├── marketData.js         # NSE market data (mock + extendable)
│   │   └── newsService.js        # Financial news + sentiment
│   ├── .env.example
│   └── package.json
│
└── mobile/
    ├── App.js                    # Root component
    ├── components/
    │   ├── ChatBubble.js         # Message bubbles (user + AI)
    │   ├── ChatInput.js          # Input bar with send button
    │   ├── TypingIndicator.js    # Animated loading dots
    │   ├── MarketTicker.js       # Scrollable top ticker
    │   └── SuggestedQueries.js   # Quick-tap query chips
    ├── hooks/
    │   └── useChat.js            # Chat state + API calls
    ├── constants/
    │   ├── theme.js              # Colors, spacing, radius
    │   └── config.js             # API URLs, suggested queries
    ├── app.json
    ├── babel.config.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy env and add your API key (optional — works without it too)
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY=sk-ant-...

# Start server
npm run dev       # with hot reload (nodemon)
# or
npm start         # production
```

Server runs at: `http://localhost:3001`

Test it:
```bash
curl http://localhost:3001/health
curl -X POST http://localhost:3001/analyze \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the Nifty trend today?"}'
```

---

### 2. Mobile App Setup

```bash
cd mobile
npm install

# Copy env
cp .env.example .env
```

**⚠️ Important: Set your backend IP**

Edit `mobile/constants/config.js` or `mobile/.env`:

| Device | URL |
|--------|-----|
| iOS Simulator | `http://localhost:3001` |
| Android Emulator | `http://10.0.2.2:3001` |
| Physical Device | `http://YOUR_LOCAL_IP:3001` |

Find your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)

```bash
# Start Expo
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone.

---

## 🤖 AI Modes

### With OpenAI API Key (Recommended)
Add `OPENAI_API_KEY` to `backend/.env` — full intelligent analysis using GPT-4o (or any other OpenAI model). Get your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

Set model via `OPENAI_MODEL` (default: `gpt-4o`). For cheaper usage use `gpt-4o-mini`.

### Without API Key (Default)
Built-in rule-based engine kicks in automatically:
- EMA crossover trend detection
- RSI + MACD momentum analysis
- IV-based volatility classification
- Automatic strategy selection
- News sentiment scoring

No API key needed to test the full app.

---

## 📱 Sample Queries

- `What is the market trend today?`
- `Suggest options strategy for Nifty`
- `Iron Condor setup for BankNifty?`
- `Is it safe to buy Nifty calls now?`
- `Best intraday trade for today?`
- `Analyze current volatility`

---

## 🔌 API Endpoints

### `POST /analyze`
```json
// Request
{ "query": "Suggest Iron Condor for Nifty", "symbol": "nifty" }

// Response
{
  "success": true,
  "query": "...",
  "symbol": "NIFTY 50",
  "analysis": "MARKET STATUS: ...\nTREND: ...\n...",
  "marketSnapshot": { "ltp": 22485.4, "rsi": 61.4, ... },
  "timestamp": "2025-01-01T10:00:00.000Z"
}
```

### `GET /analyze/snapshot`
Returns quick market overview: Nifty, BankNifty, top stocks, FII/DII data.

### `GET /health`
Server health + AI mode status.

---

## ⚠️ Disclaimer

This app is for **educational and informational purposes only**. It does not constitute financial advice. Trading in derivatives involves substantial risk of loss. Always consult a SEBI-registered financial advisor before making investment decisions.
