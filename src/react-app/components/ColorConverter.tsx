import { useState } from 'react';
import { Palette, Copy, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface ColorResult {
  rgb: string;
  hex: string;
  cmyk: string;
  pantoneCoated: string;
  pantoneUncoated: string;
}

export default function ColorConverter() {
  const { t } = useLanguage();
  const [inputType, setInputType] = useState<'hex' | 'rgb' | 'cmyk'>('hex');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<ColorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const convertColor = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/color/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: inputType,
          value: inputValue.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'hex': return '#FF0000';
      case 'rgb': return '255, 0, 0';
      case 'cmyk': return '0, 100, 100, 0';
      default: return '';
    }
  };

  const getPreviewColor = (): string => {
    if (!result) return '#ffffff';
    
    const rgbValues = result.rgb.split(',').map(v => parseInt(v.trim()));
    return `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="bg-pink-600 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">{t('colorConverter')}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('inputType')}
            </label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as 'hex' | 'rgb' | 'cmyk')}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="cmyk">CMYK</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('colorValue')}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder={getPlaceholder()}
              />
              <button
                onClick={convertColor}
                disabled={loading || !inputValue.trim()}
                className="px-4 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-700 rounded-lg border border-gray-600 p-6">
            <div className="flex items-center mb-6">
              <div 
                className="w-16 h-16 rounded-lg border-2 border-gray-500 mr-4"
                style={{ backgroundColor: getPreviewColor() }}
              />
              <h3 className="text-lg font-semibold text-white">{t('colorResults')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">RGB</span>
                  <button
                    onClick={() => copyToClipboard(result.rgb, 'rgb')}
                    className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-white font-mono">rgb({result.rgb})</div>
                {copySuccess === 'rgb' && (
                  <div className="text-green-400 text-xs mt-1">{t('copied')}</div>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">HEX</span>
                  <button
                    onClick={() => copyToClipboard(result.hex, 'hex')}
                    className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-white font-mono">{result.hex}</div>
                {copySuccess === 'hex' && (
                  <div className="text-green-400 text-xs mt-1">{t('copied')}</div>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">CMYK</span>
                  <button
                    onClick={() => copyToClipboard(result.cmyk, 'cmyk')}
                    className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-white font-mono">cmyk({result.cmyk})</div>
                {copySuccess === 'cmyk' && (
                  <div className="text-green-400 text-xs mt-1">{t('copied')}</div>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{t('pantoneCoated')}</span>
                  <button
                    onClick={() => copyToClipboard(result.pantoneCoated, 'pantone-c')}
                    className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-white font-mono">{result.pantoneCoated}</div>
                {copySuccess === 'pantone-c' && (
                  <div className="text-green-400 text-xs mt-1">{t('copied')}</div>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{t('pantoneUncoated')}</span>
                  <button
                    onClick={() => copyToClipboard(result.pantoneUncoated, 'pantone-u')}
                    className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-white font-mono">{result.pantoneUncoated}</div>
                {copySuccess === 'pantone-u' && (
                  <div className="text-green-400 text-xs mt-1">{t('copied')}</div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              {t('pantoneNote')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
