import { useState } from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { formatHash, formatTime } from '../services/api';

interface Props { limit?: number; }
export default function BlockList({ limit = 10 }: Props) {
  const { blocks, loading } = useBlockchain();
  const [showAll, setShowAll] = useState(false);

  // Sort blocks by index descending (newest first) - API should already return sorted
  const sortedBlocks = [...blocks].sort((a, b) => b.index - a.index);
  
  // Display 3 blocks by default, or 10 when "View All" is clicked
  const displayBlocks = showAll ? sortedBlocks.slice(0, limit) : sortedBlocks.slice(0, 3);

  if (loading) return <div className="card animate-pulse"><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-bone-200 rounded"></div>)}</div></div>;

  return (
    <div className="card-hover">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Blocks</h2>
        {blocks.length > 3 && !showAll && (
          <button 
            onClick={() => setShowAll(true)}
            className="text-sm text-earthion hover:underline font-medium"
          >
            View All ({blocks.length})
          </button>
        )}
      </div>
      
      {blocks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No blocks yet</p>
      ) : (
        <div className="space-y-2">
          {displayBlocks.map(b => (
            <div key={b.hash} className="flex justify-between p-3 bg-bone-100 rounded-lg hover:bg-bone-200 transition-colors">
              <div className="flex items-center space-x-4">
                <span className="font-mono text-gray-500">#{b.index}</span>
                <div>
                  <p className="font-mono text-sm text-gray-900">{formatHash(b.hash)}</p>
                  <p className="text-xs text-gray-500">{formatTime(b.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{b.txCount} txns</p>
                <p className="text-xs text-gray-500">Diff: {b.difficulty}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show less option when viewing all */}
      {showAll && blocks.length > 3 && (
        <button 
          onClick={() => setShowAll(false)}
          className="w-full text-center text-sm text-earthion hover:underline font-medium mt-4 py-2"
        >
          Show Less
        </button>
      )}
    </div>
  );
}