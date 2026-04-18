import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscribeToRoom, subscribeToDonations } from '../firebase/firestore';

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
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading dashboard...</p>
      </div>
    );
  }

  const isHeadcount = room.goalType === 'headcount';
  const donorCount = donations.length;

  const progress = isHeadcount
    ? Math.min((donorCount / room.goalHeadcount) * 100, 100)
    : Math.min((room.totalRaised / room.goalAmount) * 100, 100);

  return (
    <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
      {/* Header row */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">{room.campaignName}</h1>
          <p className="text-green-400 mt-1 text-lg">Live fundraising — give privately from your phone</p>
        </div>
        <div className="text-right">
          <p className="text-green-400 text-sm uppercase tracking-widest font-medium">Room Code</p>
          <p className="text-6xl font-bold tracking-widest mt-1 font-mono">{room.roomCode}</p>
          <p className="text-green-400 text-sm mt-1">sadaqah.live/join</p>
        </div>
      </div>

      {/* Main stat — huge, projector-readable */}
      <div className="text-center mb-8">
        {isHeadcount ? (
          <>
            <p className="text-green-400 text-xl uppercase tracking-widest font-medium mb-2">Donors</p>
            <p className="text-9xl font-bold tracking-tight leading-none">
              {donorCount}
            </p>
            <p className="text-green-400 text-3xl mt-3">
              of {room.goalHeadcount.toLocaleString()} goal
            </p>
          </>
        ) : (
          <>
            <p className="text-green-400 text-xl uppercase tracking-widest font-medium mb-2">Total Raised</p>
            <p className="text-9xl font-bold tracking-tight leading-none">
              ${room.totalRaised.toLocaleString()}
            </p>
            <p className="text-green-400 text-3xl mt-3">
              of ${room.goalAmount.toLocaleString()} goal
            </p>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-green-800 rounded-full h-8 mb-10 overflow-hidden">
        <div
          className="bg-white rounded-full h-8 transition-all duration-700 flex items-center justify-end pr-3"
          style={{ width: `${progress}%` }}
        >
          {progress > 8 && (
            <span className="text-green-900 text-xs font-bold">{Math.round(progress)}%</span>
          )}
        </div>
      </div>

      {/* Donations list */}
      <div className="flex-1">
        <h2 className="text-green-400 text-lg uppercase tracking-widest font-medium mb-4">
          {donorCount} {donorCount === 1 ? 'Gift' : 'Gifts'} received
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {donations.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between bg-green-800 rounded-2xl px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.isAnonymous ? '🌿' : '✨'}</span>
                <div>
                  <p className="text-xl font-semibold leading-tight">
                    {d.isAnonymous ? 'Anonymous' : d.displayName}
                  </p>
                  {d.pledgeOnly && (
                    <span className="text-xs text-green-400">pledge</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {/* In headcount mode, never show amounts — just the name matters */}
                {isHeadcount ? (
                  <p className="text-green-500 text-sm italic">counted</p>
                ) : d.isAnonymous ? (
                  <p className="text-green-500 text-sm italic">amount private</p>
                ) : (
                  <p className="text-2xl font-bold">${d.amount.toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
          {donations.length === 0 && (
            <p className="text-green-500 col-span-2 text-center py-8">
              Waiting for donations... Share the room code above!
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-green-700 text-sm">
          🕌 Sadaqah Live — giving for the sake of Allah alone
        </p>
      </div>
    </div>
  );
}
