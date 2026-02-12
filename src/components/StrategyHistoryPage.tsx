import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, HistoryIcon, ChevronRight } from 'lucide-react';

interface StrategyItem {
  id: string;
  title: string;
  week_number: number;
  step_by_step_actions: string[] | string;
  completionPercentage: number;
}

interface StrategyHistoryPageProps {
  onSelectStrategy: (strategyId: string) => void;
}

export const StrategyHistoryPage = ({ onSelectStrategy }: StrategyHistoryPageProps) => {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrategies();
  }, [user]);

  const loadStrategies = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: strategiesData, error: strategiesError } = await supabase
        .from('weekly_recommendations')
        .select('id, title, week_number, step_by_step_actions')
        .eq('user_id', user.id)
        .order('week_number', { ascending: false });

      if (strategiesError) throw strategiesError;

      if (strategiesData && strategiesData.length > 0) {
        const strategiesWithProgress = await Promise.all(
          strategiesData.map(async (strategy) => {
            const steps = Array.isArray(strategy.step_by_step_actions)
              ? strategy.step_by_step_actions
              : typeof strategy.step_by_step_actions === 'string'
                ? JSON.parse(strategy.step_by_step_actions)
                : [];

            const { data: progressData, error: progressError } = await supabase
              .from('progress_tracking')
              .select('completed')
              .eq('user_id', user.id)
              .eq('recommendation_id', strategy.id);

            if (progressError) throw progressError;

            const completedCount = progressData?.filter((p) => p.completed).length || 0;
            const completionPercentage = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

            return {
              id: strategy.id,
              title: strategy.title,
              week_number: strategy.week_number,
              step_by_step_actions: steps,
              completionPercentage,
            };
          })
        );

        setStrategies(strategiesWithProgress);
      }
    } catch (err) {
      console.error('Error loading strategies:', err);
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

  if (strategies.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-16">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HistoryIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategy History</h1>
          <p className="text-gray-600 text-lg">No strategies yet. Your completed strategies will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <HistoryIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Strategy History</h1>
        </div>
        <p className="text-gray-600 text-lg">Review your past weekly strategies and progress</p>
      </div>

      <div className="space-y-3">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onSelectStrategy(strategy.id)}
            className="w-full bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    W{strategy.week_number}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {strategy.title}
                  </h3>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Completion</p>
                    <span className="text-sm font-semibold text-blue-600">{strategy.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${strategy.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0 ml-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
