import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { submitDonation } from '../firebase/firestore';

export default function DonorNiyyah() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { room, donation } = state || {};

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Mock payment: 2-second delay simulating Stripe checkout
      await new Promise((r) => setTimeout(r, 2000));
      await submitDonation(roomId, donation);
      navigate(`/room/${roomId}/success`, { state: { room, donation } });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!donation) {
    navigate(`/room/${roomId}/give`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        {/* Arabic text */}
        <div className="mb-8">
          <p className="text-3xl text-gray-800 leading-relaxed font-arabic mb-3" dir="rtl">
            إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ
          </p>
          <p className="text-green-800 font-semibold text-lg italic">
            "Actions are judged by intentions."
          </p>
        </div>

        {/* Body */}
        <p className="text-gray-600 leading-relaxed mb-8">
          Before you give, take a moment. You are giving for the sake of Allah alone — not to be
          seen, not to be praised. Your sadaqah is between you and Allah.
        </p>

        {/* Donation summary */}
        <div className="bg-green-50 rounded-2xl p-5 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="font-bold text-gray-900">${donation.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Giving as</span>
            <span className="font-medium text-gray-900">
              {donation.isAnonymous ? '🌿 Anonymous' : `✨ ${donation.displayName}`}
            </span>
          </div>
          {donation.pledgeOnly && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="text-green-700 font-medium">Pledge</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Campaign</span>
            <span className="font-medium text-gray-900">{room?.campaignName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Confirm & Give'
            )}
          </button>
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors disabled:opacity-50"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}
