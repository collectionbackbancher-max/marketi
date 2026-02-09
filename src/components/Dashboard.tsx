import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Sparkles, Loader2, FileText } from 'lucide-react';

interface MarketingStrategy {
  id: string;
  title: string;
  content: string;
  week_of: string;
  created_at: string;
}

interface BusinessProfile {
  business_name: string;
}

export const Dashboard = ({ onEditProfile }: { onEditProfile: () => void }) => {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<MarketingStrategy[]>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [strategiesResult, profileResult] = await Promise.all([
        supabase
          .from('marketing_strategies')
          .select('*')
          .eq('user_id', user.id)
          .order('week_of', { ascending: false }),
        supabase
          .from('business_profiles')
          .select('business_name')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (strategiesResult.data) {
        setStrategies(strategiesResult.data);
      }

      if (profileResult.data) {
        setProfile(profileResult.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.business_name ? `${profile.business_name}'s Strategies` : 'Your Marketing Strategies'}
            </h1>
            <p className="text-gray-600 mt-1">Weekly insights to grow your business</p>
          </div>
          <button
            onClick={onEditProfile}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {strategies.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12 text-center">
          <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Your first strategy is on the way
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're preparing personalized marketing strategies for your business.
            Check back soon to see your weekly insights.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-8 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {strategy.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Week of {formatDate(strategy.week_of)}</span>
                  </div>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {strategy.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
