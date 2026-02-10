import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Loader2, TrendingUp, CheckCircle, Target, Clock, Award, Lightbulb } from 'lucide-react';

interface BusinessProfile {
  business_name: string;
  industry: string;
  city: string;
}

interface WeeklyRecommendation {
  id: string;
  title: string;
  why_this_works: string;
  estimated_time: string;
  expected_result: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [recommendation, setRecommendation] = useState<WeeklyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [profileResult, recommendationResult] = await Promise.all([
        supabase
          .from('business_profiles')
          .select('business_name, industry, city')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('weekly_recommendations')
          .select('id, title, why_this_works, estimated_time, expected_result')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (recommendationResult.error) throw recommendationResult.error;

      setProfile(profileResult.data);
      setRecommendation(recommendationResult.data);
    } catch (err) {
      console.error('Error loading data:', err);
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

      <div className="mb-8">
        {recommendation ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">This Week's Focus</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{recommendation.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{recommendation.why_this_works}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Estimated Time</h4>
                  </div>
                  <p className="text-gray-700">{recommendation.estimated_time}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Expected Result</h4>
                  </div>
                  <p className="text-gray-700">{recommendation.expected_result}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week's Focus</h3>
            <p className="text-gray-600">Your first weekly strategy will appear here.</p>
          </div>
        )}
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
