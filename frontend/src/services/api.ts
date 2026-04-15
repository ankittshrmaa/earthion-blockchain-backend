import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface Block {
  index: number;
  timestamp: number;
  prevHash: string;
  merkleRoot: string;
  hash: string;
  nonce: number;
  difficulty: number;
  txCount: number;
  transactions?: unknown[];
}

export interface ChainStats {
  height: number;
  difficulty: number;
  totalWork: number;
  currentReward: number;
  totalMined: number;
  maxSupply: number;
}

export interface WalletInfo {
  address: string;
  raw: string;
}

// Simple API client
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// API Functions
export const blockchainAPI = {
  getStats: () => api.get<{data: ChainStats}>('/api/stats'),
  getBlocks: (limit = 10) => api.get<{blocks: Block[]}>('/api/blocks', { params: { limit } }),
  getAddress: () => api.get<{address: string; raw: string}>('/api/wallet/address'),
  getBalance: () => api.get<{balance: number}>('/api/wallet/balance'),
  mine: () => api.post('/api/mining/mine'),
  send: (to: string, amount: number) => {
    if (!/^[0-9a-fA-F]{40}$/.test(to)) throw new Error('Invalid address');
    if (amount <= 0 || amount > 1_000_000_000) throw new Error('Invalid amount');
    return api.post('/api/wallet/send', { to: to.toLowerCase(), amount });
  },
};

// Utility functions
export const formatHash = (hash: string, start = 6, end = 6): string => {
  if (!hash || hash.length < start + end) return 'N/A';
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
};

export const formatTime = (ts: number): string => {
  if (!ts) return 'N/A';
  try { return new Date(ts * 1000).toLocaleString(); } catch { return 'Invalid'; }
};

export default blockchainAPI;