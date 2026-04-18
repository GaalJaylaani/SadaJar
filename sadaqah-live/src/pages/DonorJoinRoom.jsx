import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DonorJoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/room/mock123/give');
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
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-widest text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            autoFocus
          />

          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Join →
          </button>
        </form>
      </div>
    </div>
  );
}
