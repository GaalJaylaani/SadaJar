import CornerDecor from '../components/CornerDecor';
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
    <div className="min-h-screen islamic-bg flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-sm">

        <div className="islamic-card px-8 py-10 text-center">
          <CornerDecor color="#1a5c38" size={72} inset={4} />

        {/* Ornamental top */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px flex-1 bg-gold opacity-30" />
          <span className="text-gold text-xl">✦</span>
          <span className="h-px flex-1 bg-gold opacity-30" />
        </div>

        {/* Arabic Jazakallah Khayran */}
        <p
          className="font-amiri text-3xl mb-1"
          dir="rtl"
          lang="ar"
          style={{ color: '#1a5c38' }}
        >
          جَزَاكَ اللَّهُ خَيْرًا
        </p>
        <h1 className="text-xl font-bold text-islamic-green mb-1">Jazakallah Khayran</h1>

        <div className="flex items-center justify-center gap-2 my-4">
          <span className="h-px w-10 bg-islamic-green opacity-30" />
          <span className="text-2xl">🌿</span>
          <span className="h-px w-10 bg-islamic-green opacity-30" />
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          {pledgeOnly
            ? 'Your pledge has been recorded. May Allah make it easy for you to fulfil it.'
            : 'Your donation has been recorded. May Allah accept it from you and multiply it manifold.'}
        </p>

        {amount > 0 && (
          <div className="rounded-2xl px-6 py-4 mb-6 space-y-1" style={{ background: '#f0f9f4', border: '1px solid #a7d5bc' }}>
            <p className="font-bold text-2xl" style={{ color: '#1a5c38' }}>
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
          <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: '#f0f9f4', border: '1px solid #a7d5bc', color: '#1a5c38' }}>
            You will receive a reminder to complete your payment — in shā' Allāh.
          </div>
        )}

        <button
          onClick={() => navigate('/join')}
          className="w-full text-white font-semibold py-3 rounded-xl transition-colors"
          style={{ background: 'linear-gradient(135deg, #2d6a4a, #1a3328)' }}
        >
          Join another room →
        </button>

        {/* Closing ayah */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-px flex-1 bg-gold opacity-20" />
            <span className="text-gold text-xs opacity-50">❖</span>
            <span className="h-px flex-1 bg-gold opacity-20" />
          </div>
          <p className="font-amiri text-sm text-gray-400 italic" dir="rtl" lang="ar">
            إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ
          </p>
          <p className="text-xs text-gray-400 mt-1">
            "Indeed, Allah does not waste the reward of the doers of good." — 9:120
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
