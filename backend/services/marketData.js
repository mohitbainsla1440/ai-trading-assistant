const axios = require("axios");
const { getOptionsData } = require("./optionsService");

// Helper: Round to nearest 50 (ATM)
function getATM(price) {
  return Math.round(price / 50) * 50;
}

// Fetch Nifty Data
async function fetchNiftyData() {
  try {
    const res = await axios.get(
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    const data = res.data.data[0];
    const ltp = data.lastPrice;

    // 🔥 Fetch Options Data
    const options = await getOptionsData(ltp);

    return {
      symbol: "NIFTY 50",
      ltp,
      change: data.change,
      changePct: data.pChange,
      high: data.dayHigh,
      low: data.dayLow,
      open: data.open,

      // 🧠 Technicals (temporary logic)
      ema20: ltp - 150,
      ema50: ltp - 300,
      rsi: 55 + Math.random() * 10,

      // 🔥 Options Data (REAL)
      pcr: options.pcr,
      support: options.support,
      resistance: options.resistance,

      // Volatility (temporary)
      iv: 14 + Math.random() * 3,

      // ATM strike
      atm: getATM(ltp),
    };

  } catch (err) {
    console.error("NSE fetch error:", err.message);

    // fallback data
    return {
      symbol: "NIFTY 50",
      ltp: 22485,
      change: 100,
      changePct: 0.5,
      ema20: 22300,
      ema50: 22000,
      rsi: 55,
      iv: 14,
      pcr: 1.1,
      support: 22300,
      resistance: 22600,
      atm: 22450,
    };
  }
}

// Main function
async function getMarketData(symbol = "nifty") {
  return await fetchNiftyData();
}

// Snapshot (for dashboard)
async function getAllMarketData() {
  const nifty = await fetchNiftyData();

  return {
    nifty50: nifty,

    banknifty: {
      ltp: 47800,
      change: 120,
      changePct: 0.3,
      pcr: 1.05,
    },

    sensex: {
      ltp: 78000,
      change: 200,
      changePct: 0.25,
    },

    marketSentiment: {
      vix: 14,
      fiiActivity: { net: 500 },
    },

    topStocks: [],
  };
}

module.exports = { getMarketData, getAllMarketData };