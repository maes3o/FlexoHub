import { useState } from 'react';
import { Lock, Crown, CreditCard } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: string;
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">{t('loginRequired')}</h3>
        <p className="text-gray-400 mb-6">{t('loginToAccess')}</p>
        <LoginButton />
      </div>
    );
  }

  const subscription = (user as any).subscription;
  const hasAccess = subscription?.status === 'active' || subscription?.status === 'trial';

  if (hasAccess) {
    return <>{children}</>;
  }

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok && data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      } else {
        console.error('Failed to create checkout:', data);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
      <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{t('subscriptionRequired')}</h3>
      <p className="text-gray-400 mb-6">
        {subscription?.status === 'trial' 
          ? t('trialExpired')
          : t('subscriptionExpiredMessage')
        }
      </p>
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-2">{t('flexohubPro')}</h4>
        <div className="text-3xl font-bold text-white mb-1">$5<span className="text-sm font-normal">/month</span></div>
        <p className="text-blue-100 text-sm mb-4">{t('fullAccess')}</p>
        
        <ul className="text-left text-blue-100 text-sm space-y-1 mb-4">
          <li>✓ {t('allCalculators')}</li>
          <li>✓ {t('colorConverter')}</li>
          <li>✓ {t('allBarcodeTools')}</li>
          <li>✓ {t('quickTools')}</li>
          <li>✓ {t('futureFeatures')}</li>
        </ul>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <CreditCard className="w-5 h-5" />
        <span>{loading ? t('loading') : t('subscribe')}</span>
      </button>
      
      <p className="text-gray-400 text-xs mt-4">{t('securePayment')}</p>
    </div>
  );
}

function LoginButton() {
  const { redirectToLogin } = useAuth();
  const { t } = useLanguage();

  return (
    <button
      onClick={redirectToLogin}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      {t('loginWithGoogle')}
    </button>
  );
}
