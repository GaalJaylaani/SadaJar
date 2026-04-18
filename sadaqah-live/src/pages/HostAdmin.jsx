import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { subscribeToRoom, subscribeToDonations, endRoom, updateRoomGoal, updateRoomName, updateRoomDonationLink, updateRoomPresets } from '../firebase/firestore';
import CornerDecor from '../components/CornerDecor';

const GOLD = '#c9a227';
const CARD = { background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '1rem' };
const INPUT_CLS = 'w-full rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none text-sm';
const INPUT_STYLE = { background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,162,39,0.25)' };

export default function HostAdmin() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [donations, setDonations] = useState([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [ending, setEnding] = useState(false);

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
      <div className="min-h-screen islamic-bg-dark flex items-center justify-center">
        <p className="font-amiri text-2xl" style={{ color: GOLD }}>Loading...</p>
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
    <div className="min-h-screen islamic-bg-dark text-white">
      <CornerDecor isFixed color={GOLD} size={80} inset={10} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(201,162,39,0.2)', background: 'rgba(0,0,0,0.3)' }}>
        <div>
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: GOLD, opacity: 0.6 }}>Host Admin</p>
          <h1 className="text-xl font-bold mt-0.5">{room.campaignName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={room.isActive ? { background: 'rgba(201,162,39,0.15)', color: GOLD, border: '1px solid rgba(201,162,39,0.4)' } : { background: 'rgba(255,255,255,0.06)', color: '#888' }}>
            {room.isActive ? '● Live' : 'Ended'}
          </span>
          <Link
            to={`/host/${roomId}`}
            className="text-sm px-3 py-1.5 rounded-lg transition"
            style={{ color: GOLD, border: '1px solid rgba(201,162,39,0.3)' }}
          >
            Projector view →
          </Link>
        </div>
      </div>

      {/* Arabic strip */}
      <div className="relative z-10 text-center pt-6 pb-2">
        <p className="font-amiri text-lg" style={{ color: GOLD, opacity: 0.55 }} dir="rtl" lang="ar">
          وَأَنفِقُوا فِي سَبِيلِ اللَّهِ
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="h-px flex-1 max-w-[80px] opacity-20" style={{ background: GOLD }} />
          <span className="text-xs opacity-30" style={{ color: GOLD }}>✦</span>
          <span className="h-px flex-1 max-w-[80px] opacity-20" style={{ background: GOLD }} />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Raised" value={`$${room.totalRaised.toLocaleString()}`} />
          <StatCard label="Actual Gifts" value={actual.length} />
          <StatCard label="Pledges" value={pledges.length} />
          <StatCard label="Pledged Total" value={`$${pledgeTotal.toLocaleString()}`} />
        </div>

        {/* Goal */}
        <Section
          title="Current Goal"
          action={room.isActive ? (showGoalForm ? 'Cancel' : 'Update goal') : null}
          onAction={() => setShowGoalForm((v) => !v)}
        >
          {room.goalType === 'headcount' ? (
            <p className="text-2xl font-bold">
              {donations.length} <span className="text-base font-normal opacity-50">/ {room.goalHeadcount} donors</span>
            </p>
          ) : (
            <p className="text-2xl font-bold">
              ${room.totalRaised.toLocaleString()} <span className="text-base font-normal opacity-50">/ ${room.goalAmount.toLocaleString()}</span>
            </p>
          )}
          {showGoalForm && (
            <form onSubmit={handleSaveGoal} className="mt-4 space-y-3" style={{ borderTop: '1px solid rgba(201,162,39,0.15)', paddingTop: '1rem' }}>
              <div className="flex gap-2">
                <ModeBtn active={goalType === 'amount'} onClick={() => setGoalType('amount')}>Dollar amount</ModeBtn>
                <ModeBtn active={goalType === 'headcount'} onClick={() => setGoalType('headcount')}>Donor count</ModeBtn>
              </div>
              {goalType === 'amount' ? (
                <input type="number" min="1" required value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="New goal amount ($)" className={INPUT_CLS} style={INPUT_STYLE} />
              ) : (
                <input type="number" min="1" required value={goalHeadcount} onChange={(e) => setGoalHeadcount(e.target.value)} placeholder="New donor count goal" className={INPUT_CLS} style={INPUT_STYLE} />
              )}
              <SaveBtn disabled={savingGoal}>{savingGoal ? 'Saving...' : 'Save goal'}</SaveBtn>
            </form>
          )}
        </Section>

        {/* Campaign name */}
        {room.isActive && (
          <Section
            title="Campaign Name"
            action={showNameForm ? 'Cancel' : 'Rename'}
            onAction={() => { setCampaignName(room.campaignName); setShowNameForm((v) => !v); }}
          >
            <p className="text-xl font-bold">{room.campaignName}</p>
            {showNameForm && (
              <form onSubmit={handleSaveName} className="mt-4 space-y-3" style={{ borderTop: '1px solid rgba(201,162,39,0.15)', paddingTop: '1rem' }}>
                <input type="text" required value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="New campaign name" className={INPUT_CLS} style={INPUT_STYLE} />
                <SaveBtn disabled={savingName}>{savingName ? 'Saving...' : 'Save name'}</SaveBtn>
              </form>
            )}
          </Section>
        )}

        {/* Donation link */}
        {room.isActive && (
          <Section
            title="Donation Link"
            action={showLinkForm ? 'Cancel' : 'Update'}
            onAction={() => { setDonationLink(room.donationLink || ''); setShowLinkForm((v) => !v); }}
          >
            {room.donationLink
              ? <p className="text-sm opacity-50 truncate">{room.donationLink}</p>
              : <p className="text-sm italic opacity-30">No link set</p>}
            {showLinkForm && (
              <form onSubmit={handleSaveLink} className="mt-4 space-y-3" style={{ borderTop: '1px solid rgba(201,162,39,0.15)', paddingTop: '1rem' }}>
                <input type="url" value={donationLink} onChange={(e) => setDonationLink(e.target.value)} placeholder="https://..." className={INPUT_CLS} style={INPUT_STYLE} />
                <SaveBtn disabled={savingLink}>{savingLink ? 'Saving...' : 'Save link'}</SaveBtn>
              </form>
            )}
          </Section>
        )}

        {/* Donation amounts */}
        {room.isActive && (
          <Section
            title="Donation Amounts"
            action={showPresetsForm ? 'Cancel' : 'Configure'}
            onAction={() => setShowPresetsForm((v) => !v)}
          >
            <p className="text-sm opacity-50">
              {room.donationPresets == null
                ? 'Default: $25 · $50 · $100 · $250 · $500'
                : room.donationPresets.length === 0
                  ? 'No presets set'
                  : room.donationPresets.map((n) => `$${n}`).join(' · ')}
              {room.allowCustomAmount !== false && ' · custom'}
            </p>
            {showPresetsForm && (
              <div className="mt-4 space-y-4" style={{ borderTop: '1px solid rgba(201,162,39,0.15)', paddingTop: '1rem' }}>
                <div className="flex gap-2">
                  <ModeBtn active={useDefaultPresets} onClick={() => setUseDefaultPresets(true)}>Default presets</ModeBtn>
                  <ModeBtn active={!useDefaultPresets} onClick={() => setUseDefaultPresets(false)}>Custom amounts</ModeBtn>
                </div>
                {!useDefaultPresets && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                      {customPresets.length === 0 && <p className="text-sm italic opacity-30">No amounts yet</p>}
                      {customPresets.map((n) => (
                        <span key={n} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(201,162,39,0.15)', color: GOLD, border: '1px solid rgba(201,162,39,0.3)' }}>
                          ${n}
                          <button type="button" onClick={() => setCustomPresets((p) => p.filter((x) => x !== n))} className="opacity-50 hover:opacity-100 transition leading-none">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number" min="1" placeholder="Add amount (e.g. 500)"
                        value={addPresetInput} onChange={(e) => setAddPresetInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreset())}
                        className={INPUT_CLS + ' flex-1'} style={INPUT_STYLE}
                      />
                      <button type="button" onClick={addPreset} className="px-4 py-2 rounded-lg text-sm font-semibold transition" style={{ background: 'rgba(201,162,39,0.2)', color: GOLD, border: '1px solid rgba(201,162,39,0.3)' }}>
                        Add
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Allow any amount</p>
                    <p className="text-xs opacity-40">Donors can type their own number</p>
                  </div>
                  <button type="button" onClick={() => setAllowCustomAmount((v) => !v)}
                    className="relative w-12 h-6 rounded-full transition-colors focus:outline-none"
                    style={{ background: allowCustomAmount ? '#2d6a4a' : 'rgba(255,255,255,0.12)' }}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${allowCustomAmount ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                <SaveBtn disabled={savingPresets} onClick={handleSavePresets}>{savingPresets ? 'Saving...' : 'Save amounts'}</SaveBtn>
              </div>
            )}
          </Section>
        )}

        {/* All gifts */}
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(201,162,39,0.15)' }}>
            <span className="text-xs opacity-40" style={{ color: GOLD }}>❖</span>
            <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: GOLD }}>All Gifts</h2>
          </div>
          {donations.length === 0 ? (
            <p className="text-center py-8 opacity-30 text-sm italic">No gifts yet</p>
          ) : (
            <div>
              {donations.map((d) => (
                <div key={d.id} className="flex items-start justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(201,162,39,0.08)' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{d.isAnonymous ? '🌿' : '✨'}</span>
                      <span className="font-medium">{d.isAnonymous ? 'Anonymous' : d.displayName}</span>
                      {d.pledgeOnly && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(201,162,39,0.15)', color: GOLD }}>pledge</span>
                      )}
                    </div>
                    {(d.email || d.phone) && (
                      <p className="text-xs opacity-40 mt-1 ml-6">
                        {d.email}{d.email && d.phone && ' · '}{d.phone}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {room.goalType === 'headcount'
                      ? <span className="text-sm opacity-30">counted</span>
                      : <span className="font-bold text-lg" style={{ color: GOLD }}>${d.amount.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* End fundraiser */}
        {room.isActive && (
          <div className="p-5" style={{ ...CARD, borderColor: 'rgba(220,50,50,0.25)' }}>
            <h2 className="font-semibold mb-1">End Fundraiser</h2>
            <p className="text-sm opacity-40 mb-4">This will close the room. Donors will no longer be able to join or give.</p>
            {!showEndConfirm ? (
              <button onClick={() => setShowEndConfirm(true)} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition" style={{ background: 'rgba(220,50,50,0.15)', color: '#f87171', border: '1px solid rgba(220,50,50,0.3)' }}>
                End fundraiser
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleEndFundraiser} disabled={ending} className="px-5 py-2.5 rounded-lg font-bold text-sm transition disabled:opacity-50" style={{ background: '#dc2626', color: 'white' }}>
                  {ending ? 'Ending...' : 'Yes, end now'}
                </button>
                <button onClick={() => setShowEndConfirm(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold transition opacity-50 hover:opacity-100" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pb-8 text-center">
          <p className="text-xs opacity-20">🕌 Sadaqah Live — giving for the sake of Allah alone</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, action, onAction, children }) {
  return (
    <div className="p-5" style={CARD}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: GOLD }}>{title}</h2>
        {action && (
          <button onClick={onAction} className="text-xs transition opacity-60 hover:opacity-100" style={{ color: GOLD }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4" style={CARD}>
      <p className="text-xs uppercase tracking-widest mb-1 opacity-50" style={{ color: GOLD }}>{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="flex-1 py-2 rounded-lg text-sm font-medium transition"
      style={active ? { background: '#2d6a4a', color: 'white' } : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
      {children}
    </button>
  );
}

function SaveBtn({ disabled, onClick, children }) {
  return (
    <button type={onClick ? 'button' : 'submit'} onClick={onClick} disabled={disabled}
      className="w-full py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
      style={{ background: 'linear-gradient(135deg, #2d6a4a, #1a3328)', color: 'white', border: '1px solid rgba(201,162,39,0.3)' }}>
      {children}
    </button>
  );
}
