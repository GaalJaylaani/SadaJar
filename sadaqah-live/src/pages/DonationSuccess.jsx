import { useLocation, useNavigate } from 'react-router-dom';

const MOCK_DONATION = { amount: 100, isAnonymous: true, pledgeOnly: false };

export default function DonationSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const donation = state?.donation ?? MOCK_DONATION;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 w-full max-w-sm text-center">
        <div className="text-6xl mb-6">🌿</div>

        <h1 className="text-2xl font-bold text-green-900 mb-3">Jazakallah Khayran</h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          Your donation has been recorded. May Allah accept it from you and multiply it
          manifold.
        </p>

        {donation && (
          <div className="bg-green-50 rounded-2xl px-6 py-4 mb-6 space-y-1">
            <p className="text-green-900 font-bold text-2xl">
              ${donation.amount.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">
              {donation.isAnonymous
                ? 'Given anonymously — between you and Allah.'
                : `Given as ${donation.displayName}.`}
            </p>
          </div>
        )}

        {donation?.pledgeOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
            You made a pledge. You will receive a reminder to complete your payment — in shā' Allāh.
          </div>
        )}

        <button
          onClick={() => navigate('/join')}
          className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Join another room →
        </button>
      </div>
    </div>
  );
}
