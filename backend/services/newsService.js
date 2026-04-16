// newsService.js — Mock financial news + sentiment for Indian markets

const MOCK_NEWS = [
  {
    headline: 'RBI holds repo rate at 6.5%, signals accommodative stance',
    source: 'Economic Times',
    sentiment: 'bullish',
    impact: 'high',
    time: '2h ago',
    symbols: ['NIFTY', 'BANKNIFTY', 'HDFC BANK', 'ICICI BANK'],
  },
  {
    headline: 'FIIs turn net buyers for third consecutive session; pour ₹6,300 crore into Indian equities',
    source: 'Moneycontrol',
    sentiment: 'bullish',
    impact: 'medium',
    time: '3h ago',
    symbols: ['NIFTY', 'BANKNIFTY'],
  },
  {
    headline: 'US Fed signals two rate cuts in 2025; Asian markets rally on easing hopes',
    source: 'Bloomberg',
    sentiment: 'bullish',
    impact: 'medium',
    time: '4h ago',
    symbols: ['NIFTY', 'BANKNIFTY'],
  },
  {
    headline: 'IT sector faces headwinds as US spending slowdown bites; TCS, Infosys warn on margins',
    source: 'Reuters',
    sentiment: 'bearish',
    impact: 'medium',
    time: '5h ago',
    symbols: ['TCS', 'INFOSYS', 'WIPRO'],
  },
  {
    headline: 'India Q3 GDP growth at 7.1%, beats estimates; domestic consumption remains robust',
    source: 'CNBC TV18',
    sentiment: 'bullish',
    impact: 'high',
    time: '6h ago',
    symbols: ['NIFTY'],
  },
  {
    headline: 'Crude oil slips below $78 on demand concerns; positive for India macro',
    source: 'Economic Times',
    sentiment: 'bullish',
    impact: 'low',
    time: '7h ago',
    symbols: ['NIFTY', 'ONGC', 'BPCL'],
  },
  {
    headline: 'Nifty Bank options show heavy call writing at 48000; resistance expected near term',
    source: 'Moneycontrol',
    sentiment: 'neutral',
    impact: 'medium',
    time: '1h ago',
    symbols: ['BANKNIFTY'],
  },
];

/**
 * Get relevant news for a symbol/query
 * @param {string} query - user query or symbol
 * @returns {Array} filtered news items
 */
function getRelevantNews(query = '') {
  const q = query.toLowerCase();
  const relevant = MOCK_NEWS.filter((n) => {
    if (q.includes('bank') || q.includes('banknifty')) {
      return n.symbols.some((s) => s.includes('BANK'));
    }
    if (q.includes('it') || q.includes('tcs') || q.includes('infosys')) {
      return n.symbols.some((s) => ['TCS', 'INFOSYS', 'WIPRO'].includes(s));
    }
    return n.symbols.includes('NIFTY');
  });

  return relevant.length ? relevant : MOCK_NEWS.slice(0, 3);
}

/**
 * Aggregate news sentiment
 * @param {Array} news
 * @returns {object} sentiment summary
 */
function aggregateSentiment(news) {
  const counts = { bullish: 0, bearish: 0, neutral: 0 };
  news.forEach((n) => counts[n.sentiment]++);

  const dominant =
    counts.bullish > counts.bearish
      ? 'bullish'
      : counts.bearish > counts.bullish
      ? 'bearish'
      : 'neutral';

  const highImpact = news.filter((n) => n.impact === 'high');

  return {
    dominant,
    counts,
    highImpactHeadlines: highImpact.map((n) => n.headline),
    overallScore: counts.bullish - counts.bearish,
  };
}

module.exports = { getRelevantNews, aggregateSentiment };
