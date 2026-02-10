import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Save, Loader2 } from 'lucide-react';

interface BusinessProfile {
  id: string;
  business_name: string;
  industry: string;
  business_type: string;
  city: string;
  budget_range: string;
  goals: string;
}

const INDUSTRIES = [
  'Retail',
  'Food & Beverage',
  'Services',
  'E-commerce',
  'Healthcare',
  'Education',
  'Technology',
  'Real Estate',
  'Consulting',
  'Other',
];

const MAIN_GOALS = [
  'Get more customers',
  'Increase sales',
  'Build brand awareness',
  'Get more leads',
  'Engage customers online',
];

export const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({
          business_name: profile.business_name,
          industry: profile.industry,
          business_type: profile.business_type,
          city: profile.city,
          budget_range: profile.budget_range,
          goals: profile.goals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600">No profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Profile</h1>
        <p className="text-gray-600">Manage your business information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Edit Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="business_name" className="block text-sm font-semibold text-gray-700 mb-2">
              Business Name
            </label>
            <input
              id="business_name"
              type="text"
              value={profile.business_name}
              onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
              Industry
            </label>
            <select
              id="industry"
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="business_type" className="block text-sm font-semibold text-gray-700 mb-2">
              Business Type
            </label>
            <select
              id="business_type"
              value={profile.business_type}
              onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="local">Local (Physical Location)</option>
              <option value="online">Online (Digital)</option>
              <option value="service">Service-Based</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <input
              id="city"
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-semibold text-gray-700 mb-2">
              Main Goal
            </label>
            <select
              id="goals"
              value={profile.goals}
              onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">What's your main goal?</option>
              {MAIN_GOALS.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget_range" className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Marketing Budget
            </label>
            <select
              id="budget_range"
              value={profile.budget_range}
              onChange={(e) => setProfile({ ...profile, budget_range: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select budget range</option>
              <option value="under-500">Under $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500-5000">$2,500 - $5,000</option>
              <option value="5000-plus">$5,000+</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
