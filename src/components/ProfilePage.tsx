import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  Save,
  Loader2,
  Edit2,
  X,
  Check,
  MapPin,
  TargetIcon,
  Briefcase,
  DollarSign,
} from 'lucide-react';

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

const BUSINESS_TYPES = [
  { value: 'local', label: 'Local (Physical Location)' },
  { value: 'online', label: 'Online (Digital)' },
  { value: 'service', label: 'Service-Based' },
];

const BUDGET_RANGES = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-2500', label: '$1,000 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000-plus', label: '$5,000+' },
];

export const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<BusinessProfile | null>(null);

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
      setEditedProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editedProfile) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({
          business_name: editedProfile.business_name,
          industry: editedProfile.industry,
          business_type: editedProfile.business_type,
          city: editedProfile.city,
          budget_range: editedProfile.budget_range,
          goals: editedProfile.goals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editedProfile.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">
            Please complete your business profile first to view and edit your details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Business Profile</h1>
        <p className="text-gray-600">View and manage your business information</p>
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Business Name</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.business_name}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Industry</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.industry}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TargetIcon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Business Type</p>
              </div>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {BUSINESS_TYPES.find((bt) => bt.value === profile.business_type)?.label ||
                  profile.business_type}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">City</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.city}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <TargetIcon className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Main Goal</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.goals}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {BUDGET_RANGES.find((br) => br.value === profile.budget_range)?.label ||
                  profile.budget_range}
              </p>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          <button
            onClick={handleEdit}
            className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Edit2 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="business_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name
              </label>
              <input
                id="business_name"
                type="text"
                value={editedProfile?.business_name || ''}
                onChange={(e) =>
                  editedProfile &&
                  setEditedProfile({ ...editedProfile, business_name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                Industry
              </label>
              <select
                id="industry"
                value={editedProfile?.industry || ''}
                onChange={(e) =>
                  editedProfile && setEditedProfile({ ...editedProfile, industry: e.target.value })
                }
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
                Business Type
              </label>
              <select
                id="business_type"
                value={editedProfile?.business_type || ''}
                onChange={(e) =>
                  editedProfile &&
                  setEditedProfile({ ...editedProfile, business_type: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>
                    {bt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                id="city"
                type="text"
                value={editedProfile?.city || ''}
                onChange={(e) =>
                  editedProfile && setEditedProfile({ ...editedProfile, city: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-semibold text-gray-700 mb-2">
                Main Goal
              </label>
              <select
                id="goals"
                value={editedProfile?.goals || ''}
                onChange={(e) =>
                  editedProfile && setEditedProfile({ ...editedProfile, goals: e.target.value })
                }
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
                value={editedProfile?.budget_range || ''}
                onChange={(e) =>
                  editedProfile &&
                  setEditedProfile({ ...editedProfile, budget_range: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select budget range</option>
                {BUDGET_RANGES.map((br) => (
                  <option key={br.value} value={br.value}>
                    {br.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
