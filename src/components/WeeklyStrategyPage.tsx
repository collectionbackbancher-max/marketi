import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Lightbulb, Clock, Award, CheckCircle2, Copy } from 'lucide-react';
import { ProgressChecklist } from './ProgressChecklist';

interface WeeklyRecommendation {
  id: string;
  title: string;
  why_this_works: string;
  step_by_step_actions: string[];
  copy_templates: string;
  estimated_time: string;
  expected_result: string;
}

export const WeeklyStrategyPage = () => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<WeeklyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadRecommendation();
  }, [user]);

  const loadRecommendation = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weekly_recommendations')
        .select('id, title, why_this_works, step_by_step_actions, copy_templates, estimated_time, expected_result')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setRecommendation(data);
    } catch (err) {
      console.error('Error loading recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTemplates = async () => {
    if (recommendation?.copy_templates) {
      try {
        await navigator.clipboard.writeText(recommendation.copy_templates);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-16">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">This Week's Focus</h1>
          <p className="text-gray-600 text-lg">Your first weekly strategy will appear here once it's ready.</p>
        </div>
      </div>
    );
  }

  const stepsList = Array.isArray(recommendation.step_by_step_actions)
    ? recommendation.step_by_step_actions
    : typeof recommendation.step_by_step_actions === 'string'
      ? JSON.parse(recommendation.step_by_step_actions)
      : [];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">This Week's Focus</h1>
        </div>
        <p className="text-gray-600 text-lg">Your personalized strategy for maximum impact</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{recommendation.title}</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Why This Works</h3>
          <p className="text-gray-700 leading-relaxed text-lg">{recommendation.why_this_works}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Estimated Time</h4>
            </div>
            <p className="text-gray-700 text-lg">{recommendation.estimated_time}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Expected Result</h4>
            </div>
            <p className="text-gray-700 text-lg">{recommendation.expected_result}</p>
          </div>
        </div>

        {stepsList.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Actions</h3>
            <div className="space-y-3">
              {stepsList.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700 text-base leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendation.copy_templates && (
          <div className="mb-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Copy & Paste Templates</h3>
            <div className="relative">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 font-mono text-sm text-gray-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                {recommendation.copy_templates}
              </div>
              <button
                onClick={handleCopyTemplates}
                className={`absolute top-3 right-3 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {stepsList.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
          <ProgressChecklist recommendationId={recommendation.id} steps={stepsList} />
        </div>
      )}

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-900 font-semibold mb-1">Ready to get started?</p>
            <p className="text-gray-700">Follow the steps above and implement this strategy this week. You'll see results faster when you take action!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
