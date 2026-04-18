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

  const progress = Math.min((room.totalRaised / room.goalAmount) * 100, 100);
  const roomCode = room.roomCode || roomId.slice(0, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">{room.campaignName}</h1>
          {room.description && (
            <p className="text-green-300 mt-1 text-lg">{room.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-green-400 text-sm uppercase tracking-widest font-medium">Room Code</p>
          <p className="text-5xl font-bold tracking-widest mt-1">{roomCode}</p>
          <p className="text-green-400 text-sm mt-1">sadaqah.live/join</p>
        </div>
      </div>

      {/* Total raised */}
      <div className="text-center mb-8">
        <p className="text-green-400 text-xl uppercase tracking-widest font-medium mb-2">Total Raised</p>
        <p className="text-8xl font-bold tracking-tight">
          ${room.totalRaised.toLocaleString()}
        </p>
        <p className="text-green-400 text-2xl mt-2">of ${room.goalAmount.toLocaleString()} goal</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-green-800 rounded-full h-6 mb-10">
        <div
          className="bg-white rounded-full h-6 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Donations list */}
      <div className="flex-1">
        <h2 className="text-green-400 text-lg uppercase tracking-widest font-medium mb-4">
          {donations.length} {donations.length === 1 ? 'Gift' : 'Gifts'}
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {donations.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between bg-green-800 rounded-2xl px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.isAnonymous ? '🌿' : '✨'}</span>
                <span className="text-xl font-medium">
                  {d.isAnonymous ? 'Anonymous' : d.displayName}
                </span>
                {d.pledgeOnly && (
                  <span className="text-xs bg-green-700 text-green-300 px-2 py-0.5 rounded-full">
                    Pledge
                  </span>
                )}
              </div>
              {!d.isAnonymous && (
                <span className="text-xl font-bold">${d.amount.toLocaleString()}</span>
              )}
              {d.isAnonymous && (
                <span className="text-green-500 text-sm italic">amount private</span>
              )}
            </div>
          ))}
          {donations.length === 0 && (
            <p className="text-green-500 text-center py-8">
              Waiting for donations... Share the room code above!
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-green-600 text-sm">
          🕌 Sadaqah Live — giving for the sake of Allah alone
        </p>
      </div>
    </div>
  );
}
