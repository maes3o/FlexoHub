import { useState } from 'react';
import { Calculator, Copy, Settings } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface DistortionTableEntry {
  thickness: number;
  k: number;
  difference: number;
}

const defaultTable: DistortionTableEntry[] = [
  { thickness: 0.76, k: 3.6700, difference: 0.6554 },
  { thickness: 1.14, k: 6.0600, difference: 1.0821 },
  { thickness: 1.70, k: 9.9000, difference: 1.7679 },
  { thickness: 2.29, k: 13.5700, difference: 2.4232 },
  { thickness: 2.54, k: 15.1600, difference: 2.7071 },
  { thickness: 2.72, k: 16.2800, difference: 2.9071 },
  { thickness: 2.84, k: 17.0800, difference: 3.0500 },
  { thickness: 3.18, k: 19.1500, difference: 3.4196 },
  { thickness: 3.94, k: 23.9400, difference: 4.2750 },
  { thickness: 4.32, k: 26.3400, difference: 4.7036 },
  { thickness: 4.70, k: 28.7300, difference: 5.1304 },
  { thickness: 5.00, k: 30.6400, difference: 5.4714 },
  { thickness: 5.51, k: 33.8400, difference: 6.0429 },
  { thickness: 6.02, k: 37.0000, difference: 6.6071 },
  { thickness: 6.35, k: 39.1000, difference: 6.9821 },
  { thickness: 6.50, k: 40.0400, difference: 7.1500 },
];

export default function DistortionCalculator() {
  const { t } = useLanguage();
  const [printLength, setPrintLength] = useState('');
  const [plateThickness, setPlateThickness] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [distortionTable, setDistortionTable] = useState(defaultTable);
  const [copySuccess, setCopySuccess] = useState(false);

  const calculateDistortion = () => {
    const thickness = parseFloat(plateThickness);
    const printLengthNum = parseFloat(printLength);
    
    if (isNaN(thickness) || isNaN(printLengthNum)) {
      return { coefficient: 0, plateLength: 0, difference: 0 };
    }

    // Find entry from table
    const entry = distortionTable.find(e => e.thickness === thickness);
    if (!entry) return { coefficient: 0, plateLength: 0, difference: 0 };

    // Use the correct formula with K constant
    const z = (entry.k * 100) / printLengthNum;
    const coefficient = 100 - z;
    const plateLength = printLengthNum * coefficient / 100;
    
    return { coefficient, plateLength, difference: z };
  };

  const { coefficient, plateLength, difference } = calculateDistortion();

  const copyCoefficient = async () => {
    try {
      await navigator.clipboard.writeText(coefficient.toFixed(3));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const updateTableEntry = (index: number, field: 'thickness' | 'k' | 'difference', value: number) => {
    const newTable = [...distortionTable];
    newTable[index] = { ...newTable[index], [field]: value };
    setDistortionTable(newTable);
  };

  const addTableEntry = () => {
    setDistortionTable([...distortionTable, { thickness: 0, k: 0, difference: 0 }]);
  };

  const removeTableEntry = (index: number) => {
    if (distortionTable.length > 1) {
      setDistortionTable(distortionTable.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="bg-blue-600 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">{t('distortionCalculator')}</h2>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto p-1 text-blue-100 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('printLength')}
            </label>
            <input
              type="number"
              value={printLength}
              onChange={(e) => setPrintLength(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('enterPrintLength')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('plateThickness')}
            </label>
            <select
              value={plateThickness}
              onChange={(e) => setPlateThickness(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('selectThickness')}</option>
              {distortionTable.map((entry) => (
                <option key={entry.thickness} value={entry.thickness}>
                  {entry.thickness} mm
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {printLength && plateThickness && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">{t('difference')}</div>
                <div className="text-2xl font-bold text-orange-400">
                  {difference.toFixed(4)}%
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">{t('distortionCoefficient')}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-400">
                    {coefficient.toFixed(3)}%
                  </span>
                  <button
                    onClick={copyCoefficient}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    title={t('copyCoefficient')}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copySuccess && (
                    <span className="text-green-400 text-sm">{t('copied')}</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">{t('plateLength')}</div>
                <div className="text-2xl font-bold text-green-400">
                  {plateLength.toFixed(2)} mm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for coefficient table */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{t('distortionTable')}</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2 text-sm text-gray-300 mb-3">
                <div>{t('thickness')}</div>
                <div>K</div>
                <div>{t('difference')}</div>
                <div>{t('actions')}</div>
              </div>
              <div className="space-y-3">
                {distortionTable.map((entry, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-center">
                    <input
                      type="number"
                      step="0.01"
                      value={entry.thickness}
                      onChange={(e) => updateTableEntry(index, 'thickness', parseFloat(e.target.value) || 0)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="0.00"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={entry.k}
                      onChange={(e) => updateTableEntry(index, 'k', parseFloat(e.target.value) || 0)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="0.0000"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={entry.difference}
                      onChange={(e) => updateTableEntry(index, 'difference', parseFloat(e.target.value) || 0)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="0.0000"
                    />
                    <button
                      onClick={() => removeTableEntry(index)}
                      className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded"
                      disabled={distortionTable.length <= 1}
                    >
                      {t('remove')}
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addTableEntry}
                className="mt-3 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                {t('addEntry')}
              </button>
            </div>
            
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
