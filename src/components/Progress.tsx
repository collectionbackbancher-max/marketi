import { TrendingUp, Target, Zap, BarChart3 } from 'lucide-react';

export const Progress = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress</h1>
        <p className="text-gray-600">Track your marketing performance and growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium text-sm">Strategies Created</h3>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-2">Coming this week</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium text-sm">Tasks Completed</h3>
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-2">Track your actions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium text-sm">Growth Rate</h3>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0%</p>
          <p className="text-xs text-gray-500 mt-2">Month over month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium text-sm">Engagement</h3>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-2">Interactions tracked</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-blue-600 mt-2 shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Account created</p>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">More activities will appear as you use the app</p>
          </div>
        </div>
      </div>
    </div>
  );
};
