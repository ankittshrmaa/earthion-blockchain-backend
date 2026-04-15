import { useBlockchain } from '../hooks/useBlockchain';
import { useMining } from '../hooks/useBlockchain';

export default function MiningControls() {
  const { stats, loading } = useBlockchain();
  const { mining, error, mine } = useMining();

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-24 bg-bone-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card-hover">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Mining</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bone-100 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Height</p>
          <p className="text-xl font-bold text-gray-900">#{stats?.height || 0}</p>
        </div>
        <div className="bg-bone-100 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Difficulty</p>
          <p className="text-xl font-bold text-gray-900">{stats?.difficulty || 0}</p>
        </div>
        <div className="bg-bone-100 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Reward</p>
          <p className="text-xl font-bold text-earthion">{stats?.currentReward || 0}</p>
        </div>
        <div className="bg-bone-100 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Supply</p>
          <p className="text-xl font-bold text-gray-900">{(stats?.totalMined || 0).toLocaleString()}</p>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      <button
        onClick={mine}
        disabled={mining}
        className="btn btn-primary w-full flex items-center justify-center space-x-2"
      >
        {mining ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Mining...</span>
          </>
        ) : (
          <>
            <span>⛏️</span>
            <span>Mine Block</span>
          </>
        )}
      </button>
    </div>
  );
}