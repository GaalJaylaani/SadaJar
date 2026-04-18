import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../firebase/firestore';

export default function HostCreateCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ campaignName: '', goalAmount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.campaignName || !form.goalAmount) {
      setError('Campaign name and goal are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { roomId } = await createRoom(form);
      navigate(`/host/${roomId}`);
    } catch (err) {
      setError('Failed to create campaign. Check your Firebase config.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🕌</div>
          <h1 className="text-2xl font-bold text-green-900">Sadaqah Live</h1>
          <p className="text-gray-500 text-sm mt-1">Create a fundraising campaign</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="e.g. Masjid Renovation Fund"
              value={form.campaignName}
              onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fundraising Goal ($)
            </label>
            <input
              type="number"
              placeholder="5000"
              min="1"
              value={form.goalAmount}
              onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="What is this campaign for?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
            />
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
