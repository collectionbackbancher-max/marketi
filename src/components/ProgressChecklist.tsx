import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressChecklistProps {
  recommendationId: string;
  steps: string[];
}

interface ProgressItem {
  step_index: number;
  completed: boolean;
}

export const ProgressChecklist = ({ recommendationId, steps }: ProgressChecklistProps) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Map<number, boolean>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && recommendationId) {
      loadProgress();
    }
  }, [user, recommendationId]);

  const loadProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('progress_tracking')
        .select('step_index, completed')
        .eq('user_id', user.id)
        .eq('recommendation_id', recommendationId);

      if (error) throw error;

      const progressMap = new Map<number, boolean>();
      if (data) {
        data.forEach((item: ProgressItem) => {
          progressMap.set(item.step_index, item.completed);
        });
      }
      setProgress(progressMap);
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (stepIndex: number) => {
    if (!user) return;

    const isCurrentlyCompleted = progress.get(stepIndex) || false;
    const newCompleted = !isCurrentlyCompleted;

    const newProgress = new Map(progress);
    newProgress.set(stepIndex, newCompleted);
    setProgress(newProgress);

    try {
      const { data: existing, error: checkError } = await supabase
        .from('progress_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('recommendation_id', recommendationId)
        .eq('step_index', stepIndex)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        const { error: updateError } = await supabase
          .from('progress_tracking')
          .update({ completed: newCompleted, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('progress_tracking')
          .insert({
            user_id: user.id,
            recommendation_id: recommendationId,
            step_index: stepIndex,
            completed: newCompleted,
          });

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      setProgress(new Map(progress).set(stepIndex, isCurrentlyCompleted));
    }
  };

  const completedCount = Array.from(progress.values()).filter(Boolean).length;
  const totalSteps = steps.length;
  const percentageComplete = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  if (loading) {
    return <div className="text-center text-gray-600">Loading progress...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
          <span className="text-lg font-bold text-blue-600">{percentageComplete}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentageComplete}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedCount} of {totalSteps} steps completed
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleToggleStep(index)}
            className="w-full flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left group"
          >
            <div className="flex-shrink-0 pt-1">
              {progress.get(index) ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-base leading-relaxed ${
                  progress.get(index) ? 'text-gray-500 line-through' : 'text-gray-700'
                }`}
              >
                {step}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
