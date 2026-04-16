// config.js — API config

// Replace with your machine's local IP when testing on a physical device
// For Android emulator use: http://10.0.2.2:3001
// For iOS simulator use: http://localhost:3001
// For physical device: http://<YOUR_LOCAL_IP>:3001

export const API_BASE_URL = "http://192.168.1.27:3001";

export const ENDPOINTS = {
  analyze: `${API_BASE_URL}/analyze`,
  snapshot: `${API_BASE_URL}/analyze/snapshot`,
  health: `${API_BASE_URL}/health`,
};

export const SUGGESTED_QUERIES = [
  'What is the market trend today?',
  'Suggest options strategy for Nifty',
  'Iron Condor setup for BankNifty?',
  'Is it safe to buy Nifty calls now?',
  'Analyze current volatility',
  'Best intraday trade for today?',
];
