import { Globe } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'uk')}
        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="en">{t('english')}</option>
        <option value="uk">{t('ukrainian')}</option>
      </select>
    </div>
  );
}
