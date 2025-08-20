import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { exchangeCodeForSessionToken } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate('/');
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/?error=auth_failed');
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-white mb-2">{t('signingIn')}</h2>
        <p className="text-gray-400">{t('pleaseWait')}</p>
      </div>
    </div>
  );
}
