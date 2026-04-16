const express = require('express');
const router = express.Router();

const { getMarketData, getAllMarketData } = require('../services/marketData');
const { analyzeMarket } = require('../services/aiService');

router.post('/', async (req, res) => {
  try {
    const { query = "Market analysis", symbol = "nifty" } = req.body;

    const marketData = await getMarketData(symbol);
    const allData = await getAllMarketData();

    const aiResponse = await analyzeMarket({
      userQuery: query,
      marketData,
    });

    res.json({
      success: true,
      analysis: aiResponse,
      marketSnapshot: {
        ltp: marketData.ltp,
        change: marketData.change,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;