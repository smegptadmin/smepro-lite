
import React, { useState, useEffect, useCallback } from 'react';
import { SmeConfig, UserProfile, ChatSession, ApiConnector } from './types';
import SmeSelector from './components/SmeSelector';
import ChatWindow from './components/ChatWindow';
import LandingPage from './components/LandingPage';
import UserIdentity from './components/UserIdentity';
import HomePage from './components/HomePage';
import Vault from './components/Vault';
import EditProfileModal from './components/EditProfileModal';
import ChangeSmeModal from './components/ChangeSmeModal';
import ManageCategoriesModal from './components/ManageCategoriesModal';
import Dashboard from './components/Dashboard';
import { collaborationService } from './services/collaboration_service';
import { backend } from './services/backend';
import Header from './components/Header';
import FeaturesPage from './components/FeaturesPage';
import HowItWorksPage from './components/HowItWorksPage';
import PlansPage from './components/PlansPage';

const LAST_SESSION_ID_KEY = 'smeProLastSessionId';

export type SubscriptionPlan = 'solo' | 'business';
export type MarketingPage = 'home' | 'features' | 'how-it-works' | 'plans';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  
  const [showMarketingSite, setShowMarketingSite] = useState(true);
  const [currentPage, setCurrentPage] = useState<MarketingPage>('home');
  const [selectedPlan, setSelectedPlan] = useState<{ plan: SubscriptionPlan, billingCycle: 'monthly' | 'annual' } | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangeSmeModalOpen, setIsChangeSmeModalOpen] = useState(false);
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] = useState(false);
  
  // Vault needs to be reloaded after sync
  const [vaultReloadKey, setVaultReloadKey] = useState(Date.now());

  // Load user profile on initial mount
  useEffect(() => {
    backend.fetchUserProfile().then(profile => {
      if (profile) {
        setUserProfile(profile);
        setShowMarketingSite(false);
      } else {
        setShowMarketingSite(true);
      }
    });
  }, []);

  const handleSessionFromURL = useCallback(async () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const sessionId = params.get('sessionId');
    if (sessionId) {
        const session = await collaborationService.getSession(sessionId);
        if (session) {
            setCurrentSession(session);
            localStorage.setItem(LAST_SESSION_ID_KEY, sessionId);
        } else {
            console.warn("Session ID from URL not found, starting fresh.");
            try { window.location.hash = ''; } catch (e) { console.warn("Could not clear hash:", e); }
            loadLastSession();
        }
    } else {
        loadLastSession();
    }
  }, []);

  const loadLastSession = async () => {
    const lastSessionId = localStorage.getItem(LAST_SESSION_ID_KEY);
    if (lastSessionId) {
      const session = await collaborationService.getSession(lastSessionId);
      if(session) setCurrentSession(session);
    }
  };

  useEffect(() => {
    if (userProfile) {
        handleSessionFromURL();
    } else {
        // Clear everything if user logs out/profile removed
        localStorage.removeItem(LAST_SESSION_ID_KEY);
        setCurrentSession(null);
    }
  }, [userProfile, handleSessionFromURL]);


  const handleProfileConfirm = async (profile: Omit<UserProfile, 'billingCycle'>) => {
    const finalProfile: UserProfile = {
        ...profile,
        billingCycle: selectedPlan?.billingCycle || 'monthly',
    };
    const savedProfile = await backend.saveUserProfile(finalProfile);
    setUserProfile(savedProfile);
    setSelectedPlan(null);
    setShowMarketingSite(false);
  };

  const handleConfirmSme = async (config: SmeConfig, sessionId: string) => {
    const session = await collaborationService.getSession(sessionId, config, userProfile!.accountType);
    setCurrentSession(session);
    localStorage.setItem(LAST_SESSION_ID_KEY, sessionId);
    try { window.location.hash = `sessionId=${sessionId}`; } catch (e) { console.warn("Could not set hash:", e); }
  };
  
  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    const savedProfile = await backend.saveUserProfile(updatedProfile);
    setUserProfile(savedProfile);
    setIsEditProfileModalOpen(false);
  };
  
  const handleGetStarted = () => {
      setShowMarketingSite(false);
  }

  const handleChoosePlan = (plan: SubscriptionPlan, billingCycle: 'monthly' | 'annual') => {
      setSelectedPlan({ plan, billingCycle });
      handleGetStarted();
  };

  const handleStartFreshChat = () => {
    setCurrentSession(null);
    localStorage.removeItem(LAST_SESSION_ID_KEY);
    try { window.location.hash = ''; } catch (e) { console.warn("Could not clear hash:", e); }
    setIsChangeSmeModalOpen(false);
  };

  const handleNavigateToPlans = () => {
    setIsEditProfileModalOpen(false);
    setShowMarketingSite(true);
    setCurrentPage('plans');
  };

  const handleSyncComplete = () => {
    setVaultReloadKey(Date.now()); // This will trigger a re-render/reload of Vault
  };

  const renderChatContent = () => {
    if (isDashboardOpen) {
        return <Dashboard onClose={() => setIsDashboardOpen(false)} />;
    }
    if (isVaultOpen) {
      return <Vault key={vaultReloadKey} userProfile={userProfile!} onClose={() => setIsVaultOpen(false)} onManageCategories={() => setIsManageCategoriesModalOpen(true)} />;
    }
    if (!userProfile) {
      return <UserIdentity onConfirm={handleProfileConfirm} initialPlan={selectedPlan?.plan} />;
    }
    if (!currentSession) {
      return <SmeSelector onStartChat={handleConfirmSme} plan={userProfile.accountType} />;
    }
    
    // No subscription concept anymore for this simplified flow
    return <ChatWindow 
        key={currentSession.sessionId} // Force re-mount on session change
        session={currentSession}
        userProfile={userProfile}
        onSwitchSme={() => setIsChangeSmeModalOpen(true)} 
        onShowVault={() => setIsVaultOpen(true)} 
        onShowDashboard={() => setIsDashboardOpen(true)}
        onProfileEdit={() => setIsEditProfileModalOpen(true)}
    />;
  };
  
  if (showMarketingSite) {
      const renderCurrentPage = () => {
          switch (currentPage) {
              case 'features': return <FeaturesPage onGetStarted={handleGetStarted} />;
              case 'how-it-works': return <HowItWorksPage onGetStarted={handleGetStarted} />;
              case 'plans': return <PlansPage onChoosePlan={handleChoosePlan} />;
              case 'home':
              default:
                return <HomePage onGetStarted={handleGetStarted} />;
          }
      };
      
      return (
        <div className="bg-slate-900">
            <Header onNavigate={setCurrentPage} onGetStarted={handleGetStarted} />
            {renderCurrentPage()}
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 font-sans p-4">
      <main className="w-full max-w-4xl h-[90vh] flex flex-col bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700">
        {renderChatContent()}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>

      {isEditProfileModalOpen && userProfile && (
        <EditProfileModal
          currentUserProfile={userProfile}
          onSave={handleSaveProfile}
          onClose={() => setIsEditProfileModalOpen(false)}
          onNavigateToPlans={handleNavigateToPlans}
          onSyncComplete={handleSyncComplete}
        />
      )}
      {isChangeSmeModalOpen && currentSession && (
        <ChangeSmeModal
          onClose={() => setIsChangeSmeModalOpen(false)}
          onStartFresh={handleStartFreshChat}
          onKeepAndSwitch={() => { /* This logic is now handled by starting a new chat */ }}
          smeConfig={currentSession.smeConfig}
          isLegacyKeepOptionDisabled={true}
        />
      )}
      {isManageCategoriesModalOpen && (
        <ManageCategoriesModal
          onClose={() => setIsManageCategoriesModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
