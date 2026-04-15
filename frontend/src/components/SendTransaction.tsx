import { useState, useCallback } from 'react';
import { useSendTransaction } from '../hooks/useBlockchain';

const isValidAddress = (addr: string) => /^[0-9a-fA-F]{40}$/.test(addr);
const isValidAmount = (amt: number) => amt > 0 && amt <= 1_000_000_000 && Number.isInteger(amt);

export default function SendTransaction() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { sending, txId, error, send, reset } = useSendTransaction();

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = to.trim().toLowerCase();
    const amt = parseInt(amount, 10);
    if (isValidAddress(addr) && isValidAmount(amt)) await send(addr, amt);
  }, [to, amount, send]);

  const validated = isValidAddress(to) && isValidAmount(parseInt(amount) || 0);

  return (
    <div className="card-hover">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Send EIO</h2>
      {txId ? (
        <div className="space-y-4 text-center">
          <div className="bg-[#e6ffe6] text-earthion px-4 py-3 rounded-lg flex items-center justify-center">✓ Sent!</div>
          <div className="bg-bone-100 p-3 rounded"><p className="text-xs text-gray-500 mb-1">TxID</p><code className="text-xs font-mono break-all">{txId}</code></div>
          <button onClick={reset} className="btn btn-secondary w-full">Send Another</button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Recipient</label>
            <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="40 hex chars" className="input font-mono text-sm" required />
            {to && !isValidAddress(to) && <p className="text-xs text-red-500 mt-1">Invalid address</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input type="text" value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Amount" className="input" required />
          </div>
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">{error}</div>}
          <button type="submit" disabled={sending || !validated} className="btn btn-primary w-full">{sending ? 'Sending...' : 'Send EIO'}</button>
        </form>
      )}
    </div>
  );
}