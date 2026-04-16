const axios = require("axios");

// Create axios instance
const instance = axios.create({
  headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
  },
});

// Step 1: Get NSE cookies
async function getCookies() {
  try {
    await instance.get("https://www.nseindia.com");
  } catch (err) {
    console.log("Cookie fetch error (ignored)");
  }
}

// Step 2: Fetch Options Chain
async function fetchOptionsChain() {
  try {
    await getCookies(); // important

    const res = await instance.get(
      "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY"
    );

    return res.data?.records?.data || [];

  } catch (err) {
    console.error("Options chain error:", err.message);
    return [];
  }
}

// Calculate PCR
function calculatePCR(data) {
  let totalCE = 0;
  let totalPE = 0;

  data.forEach((item) => {
    totalCE += item?.CE?.openInterest || 0;
    totalPE += item?.PE?.openInterest || 0;
  });

  return totalCE === 0 ? 1 : totalPE / totalCE;
}

// Get Support & Resistance
function getLevels(data) {
  let maxCallOI = 0;
  let maxPutOI = 0;

  let resistance = null;
  let support = null;

  data.forEach((item) => {
    if (item?.CE?.openInterest > maxCallOI) {
      maxCallOI = item.CE.openInterest;
      resistance = item.strikePrice;
    }

    if (item?.PE?.openInterest > maxPutOI) {
      maxPutOI = item.PE.openInterest;
      support = item.strikePrice;
    }
  });

  return { support, resistance };
}

// Main function
async function getOptionsData(ltp) {
  const data = await fetchOptionsChain();

  if (!data.length) {
    return {
      pcr: 1,
      support: ltp - 200,
      resistance: ltp + 200,
    };
  }

  const pcr = calculatePCR(data);
  const levels = getLevels(data);

  return {
    pcr,
    support: levels.support,
    resistance: levels.resistance,
  };
}

module.exports = { getOptionsData };