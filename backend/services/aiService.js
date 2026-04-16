const axios = require("axios");

// 🧠 Detect intent
function detectIntent(query) {
  query = query.toLowerCase();

  if (query.includes("what can you do") || query.includes("help")) {
    return "intro";
  }

  if (query.includes("strategy") || query.includes("trade")) {
    return "trade";
  }

  if (query.includes("trend") || query.includes("market")) {
    return "analysis";
  }

  return "general";
}

async function analyzeMarket({ userQuery, marketData }) {
  try {
    const intent = detectIntent(userQuery);

    let prompt = "";

    // 🟢 CASE 1: INTRO (human-like)
    if (intent === "intro") {
      prompt = `
You are a smart AI trading assistant.

User asked: "${userQuery}"

Respond like a human assistant.
Explain what you can do:
- Market analysis
- Option strategies
- Strike selection
- Risk management

Do NOT give any trade here.
Keep it conversational.
`;
    }

    // 🔵 CASE 2: MARKET ANALYSIS
    else if (intent === "analysis") {
      prompt = `
You are a professional trader.

Market Data:
${JSON.stringify(marketData)}

User Query:
${userQuery}

Explain:
- Market trend
- Support & resistance
- Bias

Do NOT force trade unless asked.
`;
    }

    // 🔴 CASE 3: TRADE (MAIN LOGIC)
    else {
      prompt = `
You are a professional options trader.

Market Data:
${JSON.stringify(marketData)}

User Query:
${userQuery}

STRICT RULES:

1. DO NOT use fake numbers
2. DO NOT guess premium randomly
3. If premium not available → say "approx premium range"

4. Use ATM: ${marketData.atm}
5. Use:
   - support: ${marketData.support}
   - resistance: ${marketData.resistance}
   - PCR: ${marketData.pcr}

6. Strategy selection:
- Sideways → Iron Condor
- Bullish → Bull Call Spread
- Bearish → Bear Put Spread

7. STRIKE LOGIC:
- ATM ± 100 / 200 / 300 only

8. OUTPUT FORMAT (natural, not robotic):

Example:
"Nifty looks range-bound.

Better to deploy Iron Condor:

Sell 24000 CE
Sell 23700 PE
Buy 24200 CE
Buy 23500 PE

Premium: ~₹80–₹120 (approx)
Target: 50% decay
SL: 1.5x premium

Reason: Strong resistance near 24000 and support at 23600"

IMPORTANT:
- Sound like a trader
- No template repetition
- No robotic tone
`;
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data?.choices?.[0]?.message?.content || "No response";

  } catch (error) {
    console.error("AI error:", error.response?.data || error.message);
    return "Something went wrong.";
  }
}

module.exports = { analyzeMarket };