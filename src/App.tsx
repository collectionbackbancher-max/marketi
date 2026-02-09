import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { BusinessProfileForm } from './components/BusinessProfileForm';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

type View = 'dashboard' | 'profile';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    if (user) {
      checkProfile();
    } else {
      setCheckingProfile(false);
    }
  }, [user]);

  const checkProfile = async () => {
    if (!user) return;

    setCheckingProfile(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setHasProfile(!!data);
      setCurrentView(data ? 'dashboard' : 'profile');
    } catch (err) {
      console.error('Error checking profile:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
    setCurrentView('dashboard');
  };

  const handleEditProfile = () => {
    setCurrentView('profile');
  };

  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {currentView === 'dashboard' && hasProfile ? (
        <Dashboard onEditProfile={handleEditProfile} />
      ) : (
        <BusinessProfileForm onComplete={handleProfileComplete} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
