import DistortionCalculator from '../components/DistortionCalculator';
import AreaCalculator from '../components/AreaCalculator';
import BarcodeGenerator from '../components/BarcodeGenerator';
import QuickTools from '../components/QuickTools';
import ColorConverter from '../components/ColorConverter';
import SubscriptionGate from '../components/SubscriptionGate';
import TrialBanner from '../components/TrialBanner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useAuth } from '@getmocha/users-service/react';
import { Link } from 'react-router';
import { Menu, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { t } = useLanguage();
  const { user, logout, redirectToLogin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <TrialBanner />
      
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{t('appTitle')}</h1>
                <p className="text-gray-400 text-sm">{t('appSubtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/shortcuts"
                className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span>{t('shortcuts')}</span>
              </Link>
              
              <LanguageSwitcher />
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {user.google_user_data?.picture ? (
                      <img 
                        src={user.google_user_data.picture} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-300" />
                    )}
                    <span className="text-white text-sm">{user.google_user_data?.given_name || user.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg border border-gray-600 shadow-lg min-w-48 z-50">
                      <div className="p-3 border-b border-gray-600">
                        <div className="text-white text-sm font-medium">{user.google_user_data?.name}</div>
                        <div className="text-gray-400 text-xs">{user.email}</div>
                        {(user as any).subscription && (
                          <div className="text-xs mt-1">
                            {(user as any).subscription.status === 'trial' ? (
                              <span className="text-yellow-400">Trial: {(user as any).subscription.daysLeft} days left</span>
                            ) : (user as any).subscription.status === 'active' ? (
                              <span className="text-green-400">Pro Subscriber</span>
                            ) : (
                              <span className="text-red-400">Subscription Expired</span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLogin}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div id="distortion">
            <SubscriptionGate feature="distortion">
              <DistortionCalculator />
            </SubscriptionGate>
          </div>
          
          <div id="area">
            <SubscriptionGate feature="area">
              <AreaCalculator />
            </SubscriptionGate>
          </div>
          
          <div id="barcode">
            <SubscriptionGate feature="barcode">
              <BarcodeGenerator />
            </SubscriptionGate>
          </div>
          
          <div id="color">
            <SubscriptionGate feature="color">
              <ColorConverter />
            </SubscriptionGate>
          </div>
          
          <div id="quick">
            <SubscriptionGate feature="quick">
              <QuickTools />
            </SubscriptionGate>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>{t('footerText')}</p>
            <p className="mt-2">{t('footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
