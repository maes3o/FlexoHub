import { useState } from 'react';
import { Zap, ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function QuickTools() {
  const { t } = useLanguage();
  const [mmValue, setMmValue] = useState('');
  const [inchValue, setInchValue] = useState('');
  const [lpiValue, setLpiValue] = useState('');
  const [dpiValue, setDpiValue] = useState('');

  const convertMmToInch = (mm: string) => {
    const mmNum = parseFloat(mm);
    if (isNaN(mmNum)) {
      setInchValue('');
      return;
    }
    const inches = mmNum / 25.4;
    setInchValue(inches.toFixed(6));
  };

  const convertInchToMm = (inch: string) => {
    const inchNum = parseFloat(inch);
    if (isNaN(inchNum)) {
      setMmValue('');
      return;
    }
    const mm = inchNum * 25.4;
    setMmValue(mm.toFixed(6));
  };

  const convertLpiToDpi = (lpi: string) => {
    const lpiNum = parseFloat(lpi);
    if (isNaN(lpiNum)) {
      setDpiValue('');
      return;
    }
    const dpi = lpiNum * 16;
    setDpiValue(dpi.toFixed(0));
  };

  const convertDpiToLpi = (dpi: string) => {
    const dpiNum = parseFloat(dpi);
    if (isNaN(dpiNum)) {
      setLpiValue('');
      return;
    }
    const lpi = dpiNum / 16;
    setLpiValue(lpi.toFixed(1));
  };

  const handleMmChange = (value: string) => {
    setMmValue(value);
    convertMmToInch(value);
  };

  const handleInchChange = (value: string) => {
    setInchValue(value);
    convertInchToMm(value);
  };

  const handleLpiChange = (value: string) => {
    setLpiValue(value);
    convertLpiToDpi(value);
  };

  const handleDpiChange = (value: string) => {
    setDpiValue(value);
    convertDpiToLpi(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="bg-emerald-600 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">{t('quickTools')}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">{t('lengthConverter')}</h3>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('millimeters')}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={mmValue}
                    onChange={(e) => handleMmChange(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.000"
                  />
                </div>
                
                <div className="flex items-center justify-center pt-6">
                  <ArrowLeftRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('inches')}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={inchValue}
                    onChange={(e) => handleInchChange(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.000000"
                  />
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-400 text-center">
                1 inch = 25.4 mm
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">{t('screenConverter')}</h3>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('linesPerInch')}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lpiValue}
                    onChange={(e) => handleLpiChange(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="150"
                  />
                </div>
                
                <div className="flex items-center justify-center pt-6">
                  <ArrowLeftRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('dotsPerInch')}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={dpiValue}
                    onChange={(e) => handleDpiChange(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="2400"
                  />
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-400 text-center">
                {t('approximateConversion')}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-700 p-4 rounded-lg border border-gray-600">
          <h3 className="text-lg font-medium text-white mb-3">{t('quickReference')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">{t('commonLpi')}</h4>
              <div className="space-y-1 text-gray-300">
                <div className="flex justify-between">
                  <span>{t('newsprint')}</span>
                  <span>85-100 LPI</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('magazines')}</span>
                  <span>133-150 LPI</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('fineArt')}</span>
                  <span>175-200 LPI</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('packaging')}</span>
                  <span>120-150 LPI</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">{t('commonConversions')}</h4>
              <div className="space-y-1 text-gray-300">
                <div className="flex justify-between">
                  <span>1 mm:</span>
                  <span>0.0394 inches</span>
                </div>
                <div className="flex justify-between">
                  <span>1 inch:</span>
                  <span>25.4 mm</span>
                </div>
                <div className="flex justify-between">
                  <span>1 point:</span>
                  <span>0.3528 mm</span>
                </div>
                <div className="flex justify-between">
                  <span>1 pica:</span>
                  <span>4.233 mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
