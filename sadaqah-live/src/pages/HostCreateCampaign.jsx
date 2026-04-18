import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../firebase/firestore';

export default function HostCreateCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    campaignName: '',
    goalType: 'amount',
    goalAmount: '',
    goalHeadcount: '',
    description: '',
    donationLink: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.campaignName) {
      setError('Campaign name is required.');
      return;
    }
    if (form.goalType === 'amount' && !form.goalAmount) {
      setError('Please enter a fundraising goal amount.');
      return;
    }
    if (form.goalType === 'headcount' && !form.goalHeadcount) {
      setError('Please enter a donor count goal.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { roomId } = await createRoom(form);
      navigate(`/host/${roomId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to create campaign. Check your Firebase config and try again.');
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🕌</div>
          <h1 className="text-2xl font-bold text-green-900">Sadaqah Live</h1>
          <p className="text-gray-500 text-sm mt-1">Create a fundraising campaign</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campaign name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="e.g. Masjid Renovation Fund"
              value={form.campaignName}
              onChange={set('campaignName')}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          {/* Goal type toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, goalType: 'amount' })}
                className={`py-3 rounded-xl font-medium text-sm border-2 transition-colors ${
                  form.goalType === 'amount'
                    ? 'bg-green-800 border-green-800 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-green-700'
                }`}
              >
                💰 Raise Money
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, goalType: 'headcount' })}
                className={`py-3 rounded-xl font-medium text-sm border-2 transition-colors ${
                  form.goalType === 'headcount'
                    ? 'bg-green-800 border-green-800 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-green-700'
                }`}
              >
                👥 Donor Count
              </button>
            </div>
          </div>

          {/* Goal value — swaps based on type */}
          {form.goalType === 'amount' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fundraising Goal ($)
              </label>
              <input
                type="number"
                placeholder="10000"
                min="1"
                value={form.goalAmount}
                onChange={set('goalAmount')}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Number of Donors
              </label>
              <input
                type="number"
                placeholder="100"
                min="1"
                value={form.goalHeadcount}
                onChange={set('goalHeadcount')}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                The dashboard will show how many people have donated
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="What is this campaign for?"
              value={form.description}
              onChange={set('description')}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
            />
          </div>

          {/* External donation link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Donation Link{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://masjid.org/donate"
              value={form.donationLink}
              onChange={set('donationLink')}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Donors will be redirected here after confirming their intention
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Campaign →'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Donors join at sadaqah.live/join
        </p>
      </div>
    </div>
  );
}
