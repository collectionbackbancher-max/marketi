import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface BusinessProfile {
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

export const BusinessProfileForm = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<BusinessProfile>({
    business_name: '',
    industry: '',
    business_type: 'local',
    city: '',
    budget_range: '',
    goals: '',
  });

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

      if (data) {
        setProfile({
          business_name: data.business_name,
          industry: data.industry,
          business_type: data.business_type || 'local',
          city: data.city || '',
          budget_range: data.budget_range || '',
          goals: data.goals || '',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          business_name: profile.business_name,
          industry: profile.industry,
          business_type: profile.business_type,
          city: profile.city,
          budget_range: profile.budget_range,
          goals: profile.goals,
          description: `${profile.business_type} business in ${profile.city}`,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Let's Get Started
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Tell us about your business so we can create the perfect marketing strategy
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="business_name" className="block text-sm font-semibold text-gray-700 mb-2">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              id="business_name"
              type="text"
              value={profile.business_name}
              onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              id="business_type"
              value={profile.business_type}
              onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="local">Local (Physical Location)</option>
              <option value="online">Online (Digital)</option>
              <option value="service">Service-Based</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Your city"
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-semibold text-gray-700 mb-2">
              Main Goal <span className="text-red-500">*</span>
            </label>
            <select
              id="goals"
              value={profile.goals}
              onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-8"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Getting started...
              </>
            ) : (
              <>
                Let's Go
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
