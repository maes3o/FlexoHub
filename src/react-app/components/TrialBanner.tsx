import { useState } from 'react';
import { Clock, X, Crown } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function TrialBanner() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!user || dismissed) return null;

  const subscription = (user as any).subscription;
  
  if (subscription?.status !== 'trial') return null;

  const daysLeft = subscription.daysLeft || 0;

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok && data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-white" />
            <div className="text-white">
              <span className="font-semibold">
                {daysLeft > 0 
                  ? t('trialDaysLeft').replace('{{days}}', daysLeft.toString())
                  : t('trialEndsToday')
                }
              </span>
              <span className="ml-2 text-blue-100">{t('upgradeToKeepAccess')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSubscribe}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>{t('upgrade')}</span>
            </button>
            
            <button
              onClick={() => setDismissed(true)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
