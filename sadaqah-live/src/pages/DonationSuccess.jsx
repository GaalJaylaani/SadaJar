import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { submitDonation } from '../firebase/firestore';

export default function DonationSuccess() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const submitted = useRef(false);

  const params = new URLSearchParams(window.location.search);

  // Stripe redirect passes data as URL params; pledge flow passes via location state
  const amount = Number(params.get('amount')) || state?.donation?.amount || 0;
  const displayName = params.get('displayName') || state?.donation?.displayName || 'Anonymous';
  const isAnonymous = params.has('isAnonymous')
    ? params.get('isAnonymous') === 'true'
    : state?.donation?.isAnonymous ?? true;
  const pledgeOnly = params.has('pledgeOnly')
    ? params.get('pledgeOnly') === 'true'
    : state?.donation?.pledgeOnly ?? false;

  useEffect(() => {
    // Only write to Firestore for Stripe flow (URL params present) — pledge flow already wrote in PledgeContact
    if (!params.get('amount') || !amount || !roomId || submitted.current) return;
    submitted.current = true;
    submitDonation(roomId, { amount, displayName, isAnonymous, pledgeOnly }).catch(console.error);
  }, [roomId, amount, displayName, isAnonymous, pledgeOnly]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 w-full max-w-sm text-center">
        <div className="text-6xl mb-6">🌿</div>

        <h1 className="text-2xl font-bold text-green-900 mb-3">Jazakallah Khayran</h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          {pledgeOnly
            ? 'Your pledge has been recorded. May Allah make it easy for you to fulfil it.'
            : 'Your donation has been recorded. May Allah accept it from you and multiply it manifold.'}
        </p>

        {amount > 0 && (
          <div className="bg-green-50 rounded-2xl px-6 py-4 mb-6 space-y-1">
            <p className="text-green-900 font-bold text-2xl">
              ${amount.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm">
              {isAnonymous
                ? 'Given anonymously — between you and Allah.'
                : `Given as ${displayName}.`}
            </p>
          </div>
        )}

        {pledgeOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
            You will receive a reminder to complete your payment — in shā' Allāh.
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
