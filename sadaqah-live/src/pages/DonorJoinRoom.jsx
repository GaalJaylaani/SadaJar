import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findRoomByCode } from '../firebase/firestore';

export default function DonorJoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      setError('Please enter a 6-character room code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const room = await findRoomByCode(trimmed);
      if (!room) {
        setError('Room not found or no longer active. Check your code and try again.');
        setLoading(false);
        return;
      }
      navigate(`/room/${room.id}/give`, { state: { room } });
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🤲</div>
          <h1 className="text-2xl font-bold text-green-900">Join a Campaign</h1>
          <p className="text-gray-500 text-sm mt-1">Enter the room code shown by your host</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="A1B2C3"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-widest text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.trim().length !== 6}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Looking up room...' : 'Join →'}
          </button>
        </form>
      </div>
    </div>
  );
}
