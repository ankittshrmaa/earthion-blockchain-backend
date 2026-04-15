import { useState, useEffect, useCallback, useRef } from 'react';
import { blockchainAPI, type ChainStats, type Block, type WalletInfo } from '../services/api';

export interface ConnectionState {
  isOnline: boolean;
  isReconnecting: boolean;
  lastError: string | null;
}

export function useBlockchain() {
  const [stats, setStats] = useState<ChainStats | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<ConnectionState>({
    isOnline: true, isReconnecting: false, lastError: null
  });
  const retryRef = useRef(0);

  const loadAll = useCallback(async () => {
    try {
      const [s, b, w, bal] = await Promise.all([
        blockchainAPI.getStats(),
        blockchainAPI.getBlocks(10),
        blockchainAPI.getAddress(),
        blockchainAPI.getBalance(),
      ]);
      setStats(s.data.data || s.data);
      setBlocks(b.data.blocks || []);
      setWallet(w.data);
      setBalance(bal.data.balance);
      setConnection({ isOnline: true, isReconnecting: false, lastError: null });
      setLoading(false);
      retryRef.current = 0;
    } catch (e) {
      const err = e as Error;
      retryRef.current++;
      setConnection(prev => ({
        ...prev,
        isOnline: retryRef.current >= 3 ? false : true,
        isReconnecting: retryRef.current < 3,
        lastError: err.message,
      }));
    }
  }, []);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 5000);
    return () => clearInterval(id);
  }, [loadAll]);

  const refresh = useCallback(() => { setLoading(true); loadAll(); }, [loadAll]);

  return { stats, blocks, wallet, balance, loading, connection, refresh };
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [w, b] = await Promise.all([blockchainAPI.getAddress(), blockchainAPI.getBalance()]);
        setWallet(w.data);
        setBalance(b.data.balance);
      } catch (e) {
        console.error('Wallet load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  const copyAddress = useCallback(() => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      return true;
    }
    return false;
  }, [wallet]);

  return { wallet, balance, loading, copyAddress };
}

export function useMining() {
  const [mining, setMining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mine = useCallback(async () => {
    if (mining) return;
    setMining(true);
    setError(null);
    try {
      await blockchainAPI.mine();
    } catch (e) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || 'Mining failed');
    } finally {
      setMining(false);
    }
  }, [mining]);

  return { mining, error, mine };
}

export function useSendTransaction() {
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (to: string, amount: number) => {
    setSending(true);
    setError(null);
    setTxId(null);
    try {
      const r = await blockchainAPI.send(to, amount);
      setTxId(r.data.txid);
    } catch (e) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setSending(false);
    }
  }, []);

  const reset = useCallback(() => { setTxId(null); setError(null); }, []);

  return { sending, txId, error, send, reset };
}

export function useOffline() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return offline;
}