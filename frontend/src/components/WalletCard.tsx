import { useWallet } from '../hooks/useBlockchain';

export default function WalletCard() {
  const { wallet, balance, loading, copyAddress } = useWallet();

  if (loading) return <div className="card animate-pulse"><div className="h-24 bg-bone-200 rounded"></div></div>;

  return (
    <div className="card-hover">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">My Wallet</h2>
        <span className="text-sm text-earthion flex items-center">
          <span className="w-2 h-2 bg-earthion rounded-full mr-1"></span>
          Connected
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">Address</p>
          <button onClick={copyAddress} className="w-full bg-bone-100 px-3 py-2 rounded text-left hover:bg-bone-200 font-mono text-sm truncate transition-colors">
            {wallet?.address || 'N/A'}
          </button>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Balance</p>
          <p className="text-3xl font-bold text-gray-900">{balance.toLocaleString()}<span className="text-lg text-gray-500 ml-1">EIO</span></p>
        </div>
      </div>
    </div>
  );
}