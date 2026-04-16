// useChat.js — Chat state + API logic

import { useState, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants/config';

function formatTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `MARKET STATUS: AI Trading Assistant Ready
TREND: Awaiting your query
VOLATILITY: —
RISK LEVEL: —

BEST TRADE:
Strategy: Ask me anything about Indian markets

WHY THIS TRADE:
Specializing in NSE/BSE analysis — Nifty, BankNifty, options strategies (Iron Condor, Straddle, Bull/Bear spreads), and intraday setups.

NEWS IMPACT:
Real-time news sentiment included in every analysis.

⚠️ DISCLAIMER: Analysis for educational purposes only. Not financial advice. Trading involves risk.`,
  timestamp: formatTime(),
  isError: false,
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (query) => {
    if (!query.trim() || isLoading) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        ENDPOINTS.analyze,
        { query, symbol: extractSymbol(query) },
        { timeout: 30000, headers: { 'Content-Type': 'application/json' } }
      );

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.analysis,
        timestamp: formatTime(),
        snapshot: response.data.marketSnapshot,
        isError: false,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const isNetwork = !err.response;
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isNetwork
          ? `⚠️ Cannot connect to server.\n\nMake sure the backend is running:\ncd backend && node server.js\n\nThen check your IP in constants/config.js`
          : `⚠️ Analysis failed: ${err.response?.data?.error || err.message}`,
        timestamp: formatTime(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setError(isNetwork ? 'Network error' : 'Server error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}

// Extract symbol hint from query text
function extractSymbol(query) {
  const q = query.toLowerCase();
  if (q.includes('banknifty') || q.includes('bank nifty')) return 'banknifty';
  if (q.includes('tcs')) return 'tcs';
  if (q.includes('infosys') || q.includes('infy')) return 'infosys';
  if (q.includes('reliance')) return 'reliance';
  if (q.includes('hdfc')) return 'hdfc';
  if (q.includes('icici')) return 'icici';
  return 'nifty';
}
