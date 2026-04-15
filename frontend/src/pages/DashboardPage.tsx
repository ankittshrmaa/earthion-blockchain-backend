import { useBlockchain, useOffline } from '../hooks/useBlockchain';
import BlockList from '../components/BlockList';
import WalletCard from '../components/WalletCard';
import MiningControls from '../components/MiningControls';
import SendTransaction from '../components/SendTransaction';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { stats, loading, connection, refresh } = useBlockchain();
  const isOffline = useOffline();
  const { user, logout } = useAuth();

  if (loading && !connection.isOnline) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Connecting to blockchain...</p>
        </div>
      </div>
    );
  }

  if (!connection.isOnline) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="card-hover max-w-md text-center">
          <div className="text-4xl mb-4">📡</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Connection Lost</h1>
          <p className="text-gray-600 mb-4">{connection.lastError}</p>
          <button onClick={refresh} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-earthion rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: 'Anton, sans-serif', letterSpacing: '0.05em' }}>
                  <span className="text-earthion">EARTH</span><span className="text-gray-900">ion</span>
                </span>
              </Link>
            </div>

            {/* User & Stats */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Height: <span className="font-mono font-medium">{stats?.height || 0}</span>
              </span>
              <span className={`text-sm ${connection.isReconnecting ? 'text-yellow-600' : 'text-earthion'}`}>
                {connection.isReconnecting ? '◐ Reconnecting' : '● Live'}
              </span>
              <div className="h-6 w-px bg-bone-300"></div>
              <span className="text-sm text-gray-600">{user?.username}</span>
              <Link
                to="/"
                onClick={logout}
                className="text-sm text-earthion hover:underline"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <WalletCard />
            <MiningControls />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <BlockList limit={10} />
            <SendTransaction />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-bone-500">
            <p>Earthion Blockchain</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </footer>

      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <span>📡</span>
          <span className="text-sm">Reconnecting...</span>
        </div>
      )}
    </div>
  );
}