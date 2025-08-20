import { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Save, FolderOpen, Package } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Preset {
  name: string;
  type: 'qr' | 'code128' | 'ean13';
  data: string;
}

export default function BarcodeGenerator() {
  const { t } = useLanguage();
  const [codeType, setCodeType] = useState<'qr' | 'code128' | 'ean13'>('qr');
  const [inputData, setInputData] = useState('');
  const [bulkData, setBulkData] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (inputData && canvasRef.current) {
      generateBarcode();
    }
  }, [inputData, codeType]);

  const generateBarcode = async () => {
    if (!inputData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (codeType === 'qr') {
        const qrDataUrl = await QRCode.toDataURL(inputData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = qrDataUrl;
      } else {
        canvas.width = 400;
        canvas.height = 100;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        try {
          JsBarcode(canvas, inputData, {
            format: codeType === 'code128' ? 'CODE128' : 'EAN13',
            width: 2,
            height: 80,
            displayValue: true,
            fontSize: 12
          });
        } catch (error) {
          console.error('Barcode generation error:', error);
          ctx.fillStyle = '#ff0000';
          ctx.font = '16px Arial';
          ctx.fillText('Invalid data for barcode type', 10, 50);
        }
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const generateSVG = () => {
    if (!inputData) return '';

    if (codeType === 'qr') {
      return '';
    } else {
      const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      try {
        JsBarcode(tempSvg, inputData, {
          format: codeType === 'code128' ? 'CODE128' : 'EAN13',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 12
        });
        return tempSvg.outerHTML;
      } catch (error) {
        console.error('SVG generation error:', error);
        return '';
      }
    }
  };

  const downloadSVG = () => {
    if (codeType === 'qr') {
      downloadQRSVG();
      return;
    }
    
    const svgContent = generateSVG();
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    saveAs(blob, `${codeType}_${Date.now()}.svg`);
  };

  const downloadQRSVG = () => {
    if (!inputData) return;
    
    // Generate QR code as SVG
    const size = 300;
    
    try {
      QRCode.toString(inputData, {
        type: 'svg',
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (err, svgString) => {
        if (err) {
          console.error('QR SVG generation error:', err);
          return;
        }
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        saveAs(blob, `qr_${Date.now()}.svg`);
      });
    } catch (error) {
      console.error('Error generating QR SVG:', error);
    }
  };

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${codeType}_${Date.now()}.png`);
      }
    });
  };

  const savePreset = () => {
    if (!presetName || !inputData) return;

    const newPreset: Preset = {
      name: presetName,
      type: codeType,
      data: inputData
    };

    setPresets([...presets, newPreset]);
    setPresetName('');
  };

  const loadPreset = (preset: Preset) => {
    setCodeType(preset.type);
    setInputData(preset.data);
  };

  const removePreset = (index: number) => {
    setPresets(presets.filter((_, i) => i !== index));
  };

  const generateBulk = async () => {
    const lines = bulkData.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;

    const zip = new JSZip();
    
    for (let i = 0; i < lines.length; i++) {
      const data = lines[i].trim();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      try {
        if (codeType === 'qr') {
          const qrDataUrl = await QRCode.toDataURL(data, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          
          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              resolve();
            };
            img.src = qrDataUrl;
          });
        } else {
          canvas.width = 400;
          canvas.height = 100;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          JsBarcode(canvas, data, {
            format: codeType === 'code128' ? 'CODE128' : 'EAN13',
            width: 2,
            height: 80,
            displayValue: true,
            fontSize: 12
          });
        }

        canvas.toBlob((blob) => {
          if (blob) {
            zip.file(`${codeType}_${i + 1}_${data.replace(/[^a-zA-Z0-9]/g, '_')}.png`, blob);
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Error generating code for ${data}:`, error);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `bulk_${codeType}_${Date.now()}.zip`);
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="bg-purple-600 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">{t('barcodeGenerator')}</h2>
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="ml-auto p-1 text-purple-100 hover:text-white transition-colors"
          >
            <Package className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('codeType')}</label>
          <select
            value={codeType}
            onChange={(e) => setCodeType(e.target.value as 'qr' | 'code128' | 'ean13')}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="qr">QR Code</option>
            <option value="code128">Code 128</option>
            <option value="ean13">EAN-13</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('dataToEncode')}</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder={t('enterData')}
          />
        </div>

        {inputData && (
          <div className="mb-6">
            <div className="flex justify-center p-4 bg-white rounded-lg mb-4">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadPNG}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PNG</span>
              </button>
              
              <button
                onClick={downloadSVG}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>SVG</span>
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-white mb-4">{t('presets')}</h3>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              placeholder={t('presetName')}
            />
            <button
              onClick={savePreset}
              disabled={!presetName || !inputData}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{t('save')}</span>
            </button>
          </div>

          <div className="space-y-2">
            {presets.map((preset, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded border border-gray-600">
                <div>
                  <div className="text-white font-medium">{preset.name}</div>
                  <div className="text-gray-400 text-sm">{preset.type.toUpperCase()} - {preset.data.substring(0, 30)}...</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => loadPreset(preset)}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removePreset(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showBulk && (
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-medium text-white mb-4">{t('bulkGeneration')}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('bulkData')}
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={8}
                placeholder={t('enterMultiple')}
              />
            </div>
            
            <button
              onClick={generateBulk}
              disabled={!bulkData.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{t('generateZip')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
