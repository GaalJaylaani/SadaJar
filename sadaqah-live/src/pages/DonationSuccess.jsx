import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function DonationSuccess() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donation } = state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-sm text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-2xl font-bold text-green-900 mb-2">JazakAllah Khayran</h1>
        <p className="text-gray-600 mb-2">
          May Allah accept your sadaqah and multiply it for you.
        </p>
        {donation && (
          <p className="text-green-800 font-semibold text-lg mt-4">
            ${donation.amount.toLocaleString()} given
          </p>
        )}
        <p className="text-gray-400 text-xs mt-2">
          {donation?.isAnonymous ? 'Given anonymously — between you and Allah.' : `Given as ${donation?.displayName}.`}
        </p>

        <button
          onClick={() => navigate(`/room/${roomId}/give`)}
          className="mt-8 w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Give Again
        </button>
      </div>
    </div>
  );
}
