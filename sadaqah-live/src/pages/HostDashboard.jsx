import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subscribeToRoom, subscribeToDonations } from '../firebase/firestore';
import CornerDecor from '../components/CornerDecor';

export default function HostDashboard() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const unsubRoom = subscribeToRoom(roomId, setRoom);
    const unsubDonations = subscribeToDonations(roomId, setDonations);
    return () => {
      unsubRoom();
      unsubDonations();
    };
  }, [roomId]);

  if (!room) {
    return (
      <div className="min-h-screen islamic-bg-dark flex items-center justify-center">
        <p className="text-white text-xl font-amiri">Loading dashboard...</p>
      </div>
    );
  }

  const isHeadcount = room.goalType === 'headcount';
  const donorCount = donations.length;

  const progress = isHeadcount
    ? Math.min((donorCount / room.goalHeadcount) * 100, 100)
    : Math.min((room.totalRaised / room.goalAmount) * 100, 100);

  return (
    <div className="min-h-screen islamic-bg-dark text-white p-8 flex flex-col">
      <CornerDecor isFixed color="#c9a227" size={90} inset={14} />
      {/* Top ayah strip */}
      <div className="text-center mb-6">
        <p className="font-amiri text-2xl" style={{ color: '#c9a227' }} dir="rtl" lang="ar">
          وَمَا تُنفِقُوا مِنْ خَيْرٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ
        </p>
        <p className="text-sm mt-1 italic" style={{ color: '#c9a227', opacity: 0.65 }}>
          "Whatever good you give, Allah is All-Knowing of it." — Al-Baqarah 2:273
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="h-px flex-1 opacity-20" style={{ background: '#c9a227' }} />
          <span className="text-sm opacity-40" style={{ color: '#c9a227' }}>✦</span>
          <span className="h-px flex-1 opacity-20" style={{ background: '#c9a227' }} />
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">{room.campaignName}</h1>
          <p className="mt-1 text-lg" style={{ color: '#c9a227', opacity: 0.8 }}>
            Live fundraising — give privately from your phone
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-widest font-medium" style={{ color: '#c9a227', opacity: 0.8 }}>Room Code</p>
          <p className="text-6xl font-bold tracking-widest mt-1 font-mono">{room.roomCode}</p>
          <p className="text-sm mt-1" style={{ color: '#c9a227', opacity: 0.6 }}>sadaqah.live/join</p>
          <Link
            to={`/host/${roomId}/admin`}
            className="inline-block mt-3 text-xs px-3 py-1 rounded-lg transition"
            style={{ color: '#c9a227', border: '1px solid rgba(201,162,39,0.4)' }}
          >
            Host admin →
          </Link>
        </div>
      </div>

      {/* Main stat — huge, projector-readable */}
      <div className="text-center mb-8">
        {isHeadcount ? (
          <>
            <p className="text-xl uppercase tracking-widest font-medium mb-2" style={{ color: '#c9a227' }}>Donors</p>
            <p className="text-9xl font-bold tracking-tight leading-none">
              {donorCount}
            </p>
            <p className="text-3xl mt-3" style={{ color: '#c9a227', opacity: 0.8 }}>
              of {room.goalHeadcount.toLocaleString()} goal
            </p>
          </>
        ) : (
          <>
            <p className="text-xl uppercase tracking-widest font-medium mb-2" style={{ color: '#c9a227' }}>Total Raised</p>
            <p className="text-9xl font-bold tracking-tight leading-none">
              ${room.totalRaised.toLocaleString()}
            </p>
            <p className="text-3xl mt-3" style={{ color: '#c9a227', opacity: 0.8 }}>
              of ${room.goalAmount.toLocaleString()} goal
            </p>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full h-8 mb-10 overflow-hidden" style={{ background: 'rgba(201,162,39,0.15)' }}>
        <div
          className="rounded-full h-8 transition-all duration-700 flex items-center justify-end pr-3"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #9b7a0a, #c9a227, #f5e6b8)' }}
        >
          {progress > 8 && (
            <span className="text-xs font-bold" style={{ color: '#0f3d24' }}>{Math.round(progress)}%</span>
          )}
        </div>
      </div>

      {/* Donations list */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm opacity-50" style={{ color: '#c9a227' }}>❖</span>
          <h2 className="text-lg uppercase tracking-widest font-medium" style={{ color: '#c9a227' }}>
            {donorCount} {donorCount === 1 ? 'Gift' : 'Gifts'} received
          </h2>
          <span className="text-sm opacity-50" style={{ color: '#c9a227' }}>❖</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {donations.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-2xl px-6 py-5"
              style={{ background: 'rgba(255,255,255,0.05)', borderLeft: '2px solid rgba(201,162,39,0.3)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.isAnonymous ? '🌿' : '✨'}</span>
                <div>
                  <p className="text-xl font-semibold leading-tight">
                    {d.isAnonymous ? 'Anonymous' : d.displayName}
                  </p>
                  {d.pledgeOnly && (
                    <span className="text-xs" style={{ color: '#c9a227' }}>pledge</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {isHeadcount ? (
                  <p className="text-sm italic opacity-50">counted</p>
                ) : d.isAnonymous ? (
                  <p className="text-sm italic opacity-50">amount private</p>
                ) : (
                  <p className="text-2xl font-bold" style={{ color: '#c9a227' }}>${d.amount.toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
          {donations.length === 0 && (
            <p className="col-span-2 text-center py-8 opacity-40">
              Waiting for donations... Share the room code above!
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
