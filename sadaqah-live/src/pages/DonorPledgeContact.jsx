import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { submitDonation } from '../firebase/firestore';

export default function DonorPledgeContact() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const donation = state?.donation ?? {};
  const room = state?.room ?? { campaignName: 'Campaign' };

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitDonation(roomId, { ...donation, email, phone });
      navigate(`/room/${roomId}/success`, { state: { room, donation } });
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">📋</div>
          <h1 className="text-xl font-bold text-green-900">Record Your Pledge</h1>
          <p className="text-gray-500 text-sm mt-1">
            Leave your contact so we can remind you to complete your gift
          </p>
        </div>

        {/* Pledge summary */}
        <div className="bg-green-50 rounded-2xl px-5 py-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Pledge amount</p>
            <p className="text-2xl font-bold text-green-900">${donation.amount?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Giving as</p>
            <p className="font-medium text-gray-800 text-sm">
              {donation.isAnonymous ? '🌿 Anonymous' : `✨ ${donation.displayName}`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          <p className="text-xs text-gray-400 text-center">
            Both fields are optional. Your contact info is only used to remind you about your pledge.
          </p>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Recording pledge...' : 'Record My Pledge →'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full text-gray-400 hover:text-gray-600 py-2 text-sm transition-colors"
          >
            ← Go back
          </button>
        </form>
      </div>
    </div>
  );
}
