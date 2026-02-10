import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Loader2, TrendingUp, CheckCircle, Target } from 'lucide-react';

interface BusinessProfile {
  business_name: string;
  industry: string;
  city: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('business_name, industry, city')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {profile?.business_name ? `Welcome to ${profile.business_name}` : 'Welcome!'}
        </h1>
        <p className="text-gray-600 text-lg">
          {profile ? `${profile.industry} | ${profile.city}` : 'Let\'s grow your business together'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-600 font-medium">This Week's Strategy</h3>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">Coming Soon</p>
          <p className="text-sm text-gray-600">Your AI-powered strategy will arrive this week</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-600 font-medium">Tasks to Complete</h3>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">0</p>
          <p className="text-sm text-gray-600">Action items from your strategies</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-600 font-medium">Growth This Month</h3>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">0%</p>
          <p className="text-sm text-gray-600">Track your progress here</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profile Complete</h3>
                <p className="text-sm text-gray-600 mt-1">Your business information is set up</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">First Strategy Coming</h3>
                <p className="text-sm text-gray-600 mt-1">We're preparing your personalized strategy</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Take Action</h3>
                <p className="text-sm text-gray-600 mt-1">Implement strategies and track results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Pro Tip</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            The more detailed information you provide in your profile, the more tailored and effective your marketing strategies will be. Visit your Profile page to add more details about your target audience, goals, and budget.
          </p>
        </div>
      </div>
    </div>
  );
};
