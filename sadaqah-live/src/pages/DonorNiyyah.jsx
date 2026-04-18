import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { submitDonation } from '../firebase/firestore';

const MOCK_DONATION = { amount: 100, displayName: 'Anonymous', isAnonymous: true, pledgeOnly: false };
const MOCK_ROOM = { campaignName: 'Campaign' };

export default function DonorNiyyah() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const donation = state?.donation ?? MOCK_DONATION;
  const room = state?.room ?? MOCK_ROOM;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    // Pledge — go collect contact info, no payment
    if (donation.pledgeOnly) {
      navigate(`/room/${roomId}/pledge-contact`, { state: { room, donation } });
      return;
    }

    // External donation link — record intent in Firestore then redirect
    if (room.donationLink) {
      setLoading(true);
      try {
        await submitDonation(roomId, donation);
      } catch (err) {
        console.error(err);
      }
      window.location.href = room.donationLink;
      return;
    }

    // Stripe checkout
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donation.amount,
          roomId,
          displayName: donation.displayName,
          isAnonymous: donation.isAnonymous,
          pledgeOnly: donation.pledgeOnly,
          campaignName: room.campaignName,
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError('Payment setup failed. Please try again.');
      setLoading(false);
    }
  };

  const ctaLabel = () => {
    if (donation.pledgeOnly) return 'Confirm Pledge →';
    if (loading) return (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Redirecting…
      </span>
    );
    if (room.donationLink) return 'Confirm & Donate →';
    return 'Confirm & Pay';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 w-full max-w-md text-center">

        {/* Arabic ayah */}
        <div className="mb-10">
          <p
            className="text-4xl text-gray-800 leading-loose mb-4"
            dir="rtl"
            lang="ar"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ
          </p>
          <p className="text-green-800 font-semibold text-lg italic">
            "Actions are judged by intentions."
          </p>
        </div>

        {/* Body text */}
        <p className="text-gray-500 leading-relaxed text-base mb-10 max-w-sm mx-auto">
          Before you give, take a moment. You are giving for the sake of Allah alone — not to be
          seen, not to be praised. Your sadaqah is between you and Allah.
        </p>

        {/* Donation summary */}
        <div className="bg-green-50 rounded-2xl p-5 mb-10 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="font-bold text-gray-900 text-base">
              ${donation.amount.toLocaleString()}
            </span>
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
            <span className="font-medium text-gray-900">{room.campaignName}</span>
          </div>
        </div>

        {room.donationLink && !donation.pledgeOnly && (
          <p className="text-xs text-gray-400 mb-4">
            You'll be redirected to the masjid's donation page to complete your payment.
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {ctaLabel()}
          </button>
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full text-gray-400 hover:text-gray-600 py-2 text-sm transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}
