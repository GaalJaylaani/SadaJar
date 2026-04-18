import CornerDecor from '../components/CornerDecor';
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
    <div className="min-h-screen islamic-bg flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-sm">

        <div className="islamic-card p-8">
          <CornerDecor color="#1a5c38" size={72} inset={4} />
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-amiri text-xl text-gold mb-1" dir="rtl" lang="ar">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-px flex-1 bg-gold opacity-30" />
            <span className="text-gold text-lg">🤲</span>
            <span className="h-px flex-1 bg-gold opacity-30" />
          </div>
          <h1 className="text-2xl font-bold text-islamic-dark">Join a Campaign</h1>
          <p className="text-gray-500 text-sm mt-1">Enter the room code shown by your host</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="A1B2C3"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-widest text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.trim().length !== 6}
            className="w-full text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2d6a4a, #1a3328)' }}
          >
            {loading ? 'Looking up room...' : 'Join →'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
          <span className="h-px flex-1 bg-gold" />
          <span className="text-gold text-xs">❖</span>
          <span className="h-px flex-1 bg-gold" />
        </div>
        </div>
      </div>
    </div>
  );
}
