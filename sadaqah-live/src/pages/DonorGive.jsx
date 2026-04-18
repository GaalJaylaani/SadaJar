import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export default function DonorGive() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const room = state?.room;

  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showName, setShowName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [pledgeOnly, setPledgeOnly] = useState(false);

  const selectedAmount = amount || customAmount;

  const handleContinue = () => {
    if (!selectedAmount || Number(selectedAmount) <= 0) return;
    navigate(`/room/${roomId}/niyyah`, {
      state: {
        room,
        donation: {
          amount: Number(selectedAmount),
          displayName: showName ? displayName : 'Anonymous',
          isAnonymous: !showName,
          pledgeOnly,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-3xl mb-2">🤲</div>
          <h1 className="text-xl font-bold text-green-900">
            {room?.campaignName || 'Fundraising Campaign'}
          </h1>
          {room && (
            <p className="text-gray-500 text-sm mt-1">
              ${room.totalRaised?.toLocaleString() || 0} raised of ${room.goalAmount?.toLocaleString()} goal
            </p>
          )}
        </div>

        {/* Preset amounts */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Choose an amount</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => { setAmount(String(preset)); setCustomAmount(''); }}
                className={`py-3 rounded-xl font-semibold text-lg border-2 transition-colors ${
                  amount === String(preset)
                    ? 'bg-green-800 border-green-800 text-white'
                    : 'bg-white border-gray-200 text-gray-800 hover:border-green-700'
                }`}
              >
                ${preset}
              </button>
            ))}
            <input
              type="number"
              min="1"
              placeholder="Custom"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
              className="py-3 px-2 rounded-xl border-2 border-gray-200 text-center text-lg font-semibold text-gray-800 focus:outline-none focus:border-green-700 col-span-3"
            />
          </div>
        </div>

        {/* Anonymity toggle */}
        <div className="mb-4 bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 text-sm">Show my name</p>
              <p className="text-xs text-gray-500">Off by default — give privately</p>
            </div>
            <button
              onClick={() => setShowName(!showName)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showName ? 'bg-green-700' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  showName ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {showName && (
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          )}
        </div>

        {/* Pledge option */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={pledgeOnly}
            onChange={(e) => setPledgeOnly(e.target.checked)}
            className="w-4 h-4 accent-green-700"
          />
          <span className="text-sm text-gray-600">
            I'll pay later <span className="text-gray-400">(pledge only)</span>
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!selectedAmount || Number(selectedAmount) <= 0}
          className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
