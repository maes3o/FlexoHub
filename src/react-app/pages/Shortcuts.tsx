import { Link } from 'react-router';
import { Calculator, QrCode, Zap, Palette } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function Shortcuts() {
  const { t } = useLanguage();

  const tools = [
    {
      id: 'distortion',
      title: t('distortionCalculator'),
      icon: Calculator,
      color: 'bg-blue-600',
      description: t('distortionDescription'),
      href: '/#distortion'
    },
    {
      id: 'area',
      title: t('areaCalculator'),
      icon: Calculator,
      color: 'bg-orange-600',
      description: t('areaDescription'),
      href: '/#area'
    },
    {
      id: 'barcode',
      title: t('barcodeGenerator'),
      icon: QrCode,
      color: 'bg-purple-600',
      description: t('barcodeDescription'),
      href: '/#barcode'
    },
    {
      id: 'quick',
      title: t('quickTools'),
      icon: Zap,
      color: 'bg-emerald-600',
      description: t('quickToolsDescription'),
      href: '/#quick'
    },
    {
      id: 'color',
      title: t('colorConverter'),
      icon: Palette,
      color: 'bg-pink-600',
      description: t('colorDescription'),
      href: '/#color'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t('shortcuts')}</h1>
          <p className="text-gray-400 text-lg">{t('shortcutsDescription')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.href}
                className="group bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <div className={`${tool.color} p-6`}>
                  <Icon className="w-12 h-12 text-white mb-4" />
                  <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-400 leading-relaxed">{tool.description}</p>
                  
                  <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">{t('openTool')}</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
