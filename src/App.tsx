import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { BusinessProfileForm } from './components/BusinessProfileForm';
import { Dashboard } from './components/Dashboard';
import { WeeklyStrategy } from './components/WeeklyStrategy';
import { WeeklyStrategyPage } from './components/WeeklyStrategyPage';
import { Progress } from './components/Progress';
import { ProfilePage } from './components/ProfilePage';
import { Layout } from './components/Layout';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

type Page = 'dashboard' | 'strategy' | 'weekly-strategy' | 'progress' | 'profile';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

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
      if (!data) {
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error('Error checking profile:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
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

  if (!hasProfile) {
    return <BusinessProfileForm onComplete={handleProfileComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'strategy':
        return <WeeklyStrategy />;
      case 'weekly-strategy':
        return <WeeklyStrategyPage />;
      case 'progress':
        return <Progress />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
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
