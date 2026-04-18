import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { subscribeToRoom, subscribeToDonations, endRoom, updateRoomGoal, updateRoomName, updateRoomDonationLink, updateRoomPresets } from '../firebase/firestore';

const DEFAULT_PRESETS = [25, 50, 100, 250, 500];

export default function HostAdmin() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [donations, setDonations] = useState([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [ending, setEnding] = useState(false);

  // Goal update state
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalType, setGoalType] = useState('amount');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalHeadcount, setGoalHeadcount] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);

  const [showNameForm, setShowNameForm] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [showLinkForm, setShowLinkForm] = useState(false);
  const [donationLink, setDonationLink] = useState('');
  const [savingLink, setSavingLink] = useState(false);

  const [showPresetsForm, setShowPresetsForm] = useState(false);
  const [useDefaultPresets, setUseDefaultPresets] = useState(true);
  const [customPresets, setCustomPresets] = useState([]);
  const [allowCustomAmount, setAllowCustomAmount] = useState(true);
  const [addPresetInput, setAddPresetInput] = useState('');
  const [savingPresets, setSavingPresets] = useState(false);

  useEffect(() => {
    const unsubRoom = subscribeToRoom(roomId, (r) => {
      setRoom(r);
      setGoalType(r.goalType);
      setGoalAmount(r.goalAmount ? String(r.goalAmount) : '');
      setGoalHeadcount(r.goalHeadcount ? String(r.goalHeadcount) : '');
      setCampaignName(r.campaignName || '');
      setDonationLink(r.donationLink || '');
      setUseDefaultPresets(r.donationPresets == null);
      setCustomPresets(r.donationPresets ?? []);
      setAllowCustomAmount(r.allowCustomAmount !== false);
    });
    const unsubDonations = subscribeToDonations(roomId, setDonations);
    return () => { unsubRoom(); unsubDonations(); };
  }, [roomId]);

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const actual = donations.filter((d) => !d.pledgeOnly);
  const pledges = donations.filter((d) => d.pledgeOnly);
  const pledgeTotal = pledges.reduce((sum, d) => sum + d.amount, 0);

  async function handleEndFundraiser() {
    setEnding(true);
    await endRoom(roomId);
    navigate('/');
  }

  async function handleSaveName(e) {
    e.preventDefault();
    setSavingName(true);
    await updateRoomName(roomId, campaignName);
    setSavingName(false);
    setShowNameForm(false);
  }

  async function handleSaveLink(e) {
    e.preventDefault();
    setSavingLink(true);
    await updateRoomDonationLink(roomId, donationLink);
    setSavingLink(false);
    setShowLinkForm(false);
  }

  async function handleSavePresets() {
    setSavingPresets(true);
    await updateRoomPresets(roomId, {
      donationPresets: useDefaultPresets ? null : customPresets,
      allowCustomAmount,
    });
    setSavingPresets(false);
    setShowPresetsForm(false);
  }

  function addPreset() {
    const val = Number(addPresetInput);
    if (!val || val <= 0 || customPresets.includes(val)) return;
    setCustomPresets((p) => [...p, val].sort((a, b) => a - b));
    setAddPresetInput('');
  }

  async function handleSaveGoal(e) {
    e.preventDefault();
    setSavingGoal(true);
    await updateRoomGoal(roomId, { goalType, goalAmount, goalHeadcount });
    setSavingGoal(false);
    setShowGoalForm(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Host Admin</p>
          <h1 className="text-xl font-bold mt-0.5">{room.campaignName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${room.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
            {room.isActive ? 'Live' : 'Ended'}
          </span>
          <Link
            to={`/host/${roomId}`}
            className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition"
          >
            Projector view →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Raised" value={`$${room.totalRaised.toLocaleString()}`} />
          <StatCard label="Actual Gifts" value={actual.length} />
          <StatCard label="Pledges" value={pledges.length} />
          <StatCard label="Pledged Total" value={`$${pledgeTotal.toLocaleString()}`} />
        </div>

        {/* Goal status */}
        <div className="bg-gray-900 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-200">Current Goal</h2>
            {room.isActive && (
              <button
                onClick={() => setShowGoalForm((v) => !v)}
                className="text-sm text-green-400 hover:text-green-300 transition"
              >
                {showGoalForm ? 'Cancel' : 'Update goal'}
              </button>
            )}
          </div>
          {room.goalType === 'headcount' ? (
            <p className="text-2xl font-bold">
              {donations.length} <span className="text-gray-400 text-base font-normal">/ {room.goalHeadcount} donors</span>
            </p>
          ) : (
            <p className="text-2xl font-bold">
              ${room.totalRaised.toLocaleString()} <span className="text-gray-400 text-base font-normal">/ ${room.goalAmount.toLocaleString()}</span>
            </p>
          )}

          {showGoalForm && (
            <form onSubmit={handleSaveGoal} className="mt-5 space-y-4 border-t border-gray-800 pt-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGoalType('amount')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${goalType === 'amount' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  Dollar amount
                </button>
                <button
                  type="button"
                  onClick={() => setGoalType('headcount')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${goalType === 'headcount' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  Donor count
                </button>
              </div>
              {goalType === 'amount' ? (
                <input
                  type="number"
                  min="1"
                  required
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="New goal amount ($)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              ) : (
                <input
                  type="number"
                  min="1"
                  required
                  value={goalHeadcount}
                  onChange={(e) => setGoalHeadcount(e.target.value)}
                  placeholder="New donor count goal"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              )}
              <button
                type="submit"
                disabled={savingGoal}
                className="w-full py-2.5 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold transition"
              >
                {savingGoal ? 'Saving...' : 'Save goal'}
              </button>
            </form>
          )}
        </div>

        {/* Campaign name */}
        {room.isActive && (
          <div className="bg-gray-900 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-200">Campaign Name</h2>
              <button
                onClick={() => { setCampaignName(room.campaignName); setShowNameForm((v) => !v); }}
                className="text-sm text-green-400 hover:text-green-300 transition"
              >
                {showNameForm ? 'Cancel' : 'Rename'}
              </button>
            </div>
            <p className="text-xl font-bold">{room.campaignName}</p>
            {showNameForm && (
              <form onSubmit={handleSaveName} className="mt-5 space-y-3 border-t border-gray-800 pt-5">
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="New campaign name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
                <button
                  type="submit"
                  disabled={savingName}
                  className="w-full py-2.5 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold transition"
                >
                  {savingName ? 'Saving...' : 'Save name'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Donation link */}
        {room.isActive && (
          <div className="bg-gray-900 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-200">Donation Link</h2>
              <button
                onClick={() => { setDonationLink(room.donationLink || ''); setShowLinkForm((v) => !v); }}
                className="text-sm text-green-400 hover:text-green-300 transition"
              >
                {showLinkForm ? 'Cancel' : 'Update'}
              </button>
            </div>
            {room.donationLink ? (
              <p className="text-sm text-gray-400 truncate">{room.donationLink}</p>
            ) : (
              <p className="text-sm text-gray-600 italic">No link set</p>
            )}
            {showLinkForm && (
              <form onSubmit={handleSaveLink} className="mt-5 space-y-3 border-t border-gray-800 pt-5">
                <input
                  type="url"
                  value={donationLink}
                  onChange={(e) => setDonationLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
                <button
                  type="submit"
                  disabled={savingLink}
                  className="w-full py-2.5 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold transition"
                >
                  {savingLink ? 'Saving...' : 'Save link'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Donation amounts */}
        {room.isActive && (
          <div className="bg-gray-900 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-200">Donation Amounts</h2>
              <button
                onClick={() => setShowPresetsForm((v) => !v)}
                className="text-sm text-green-400 hover:text-green-300 transition"
              >
                {showPresetsForm ? 'Cancel' : 'Configure'}
              </button>
            </div>

            {/* Summary */}
            <p className="text-sm text-gray-400">
              {room.donationPresets == null
                ? 'Default: $25 · $50 · $100 · $250 · $500'
                : room.donationPresets.length === 0
                  ? 'No presets set'
                  : room.donationPresets.map((n) => `$${n}`).join(' · ')}
              {room.allowCustomAmount !== false && ' · custom'}
            </p>

            {showPresetsForm && (
              <div className="mt-5 space-y-5 border-t border-gray-800 pt-5">
                {/* Mode toggle */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUseDefaultPresets(true)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${useDefaultPresets ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    Default presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseDefaultPresets(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${!useDefaultPresets ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    Custom amounts
                  </button>
                </div>

                {/* Custom preset chips + add input */}
                {!useDefaultPresets && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                      {customPresets.length === 0 && (
                        <p className="text-sm text-gray-600 italic">No amounts yet</p>
                      )}
                      {customPresets.map((n) => (
                        <span key={n} className="flex items-center gap-1.5 bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-full">
                          ${n}
                          <button
                            type="button"
                            onClick={() => setCustomPresets((p) => p.filter((x) => x !== n))}
                            className="text-gray-500 hover:text-red-400 transition leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Add amount (e.g. 500)"
                        value={addPresetInput}
                        onChange={(e) => setAddPresetInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreset())}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={addPreset}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Allow custom amount toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-200">Allow any amount</p>
                    <p className="text-xs text-gray-500">Donors can type their own number</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowCustomAmount((v) => !v)}
                    className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${allowCustomAmount ? 'bg-green-700' : 'bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${allowCustomAmount ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSavePresets}
                  disabled={savingPresets}
                  className="w-full py-2.5 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold transition"
                >
                  {savingPresets ? 'Saving...' : 'Save amounts'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Donations table */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-gray-200">All Gifts</h2>
          </div>
          {donations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No gifts yet.</p>
          ) : (
            <div className="divide-y divide-gray-800">
              {donations.map((d) => (
                <div key={d.id} className="flex items-start justify-between px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{d.isAnonymous ? '🌿' : '✨'}</span>
                      <span className="font-medium">{d.isAnonymous ? 'Anonymous' : d.displayName}</span>
                      {d.pledgeOnly && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900 text-yellow-300 font-medium">pledge</span>
                      )}
                    </div>
                    {(d.email || d.phone) && (
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        {d.email && <span>{d.email}</span>}
                        {d.email && d.phone && <span> · </span>}
                        {d.phone && <span>{d.phone}</span>}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {room.goalType === 'headcount' ? (
                      <span className="text-gray-500 text-sm">counted</span>
                    ) : (
                      <span className="font-bold text-lg">${d.amount.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* End fundraiser */}
        {room.isActive && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <h2 className="font-semibold text-gray-200 mb-1">End Fundraiser</h2>
            <p className="text-sm text-gray-500 mb-4">
              This will close the room. Donors will no longer be able to join or give.
            </p>
            {!showEndConfirm ? (
              <button
                onClick={() => setShowEndConfirm(true)}
                className="px-5 py-2.5 rounded-lg bg-red-900 hover:bg-red-800 text-red-200 font-semibold transition text-sm"
              >
                End fundraiser
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleEndFundraiser}
                  disabled={ending}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold transition text-sm"
                >
                  {ending ? 'Ending...' : 'Yes, end now'}
                </button>
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
