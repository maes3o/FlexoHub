import { useState } from 'react';
import { Plus, Calculator, Trash2, Copy } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface AreaRow {
  id: number;
  width: string;
  height: string;
  quantity: string;
  cleanArea: number;
  bleedArea: number;
}

export default function AreaCalculator() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<AreaRow[]>([
    { id: 1, width: '', height: '', quantity: '1', cleanArea: 0, bleedArea: 0 }
  ]);
  const [calculated, setCalculated] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const copyTotal = async (value: number, type: 'clean' | 'bleed') => {
    try {
      await navigator.clipboard.writeText(value.toFixed(3));
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addRow = () => {
    if (rows.length < 10) {
      const newId = Math.max(...rows.map(r => r.id)) + 1;
      setRows([...rows, { id: newId, width: '', height: '', quantity: '1', cleanArea: 0, bleedArea: 0 }]);
    }
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: number, field: 'width' | 'height' | 'quantity', value: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const calculateAreas = () => {
    const updatedRows = rows.map(row => {
      const width = parseFloat(row.width) || 0;
      const height = parseFloat(row.height) || 0;
      const quantity = parseFloat(row.quantity) || 0;

      // Clean area: (width * height / 1000000) * quantity
      const cleanArea = (width * height / 1000000) * quantity;
      
      // Bleed area: ((width + 12) * (height + 12) / 1000000) * quantity
      const bleedArea = ((width + 12) * (height + 12) / 1000000) * quantity;

      return { ...row, cleanArea, bleedArea };
    });

    setRows(updatedRows);
    setCalculated(true);
  };

  const clearAll = () => {
    setRows([{ id: 1, width: '', height: '', quantity: '1', cleanArea: 0, bleedArea: 0 }]);
    setCalculated(false);
  };

  const totalClean = rows.reduce((sum, row) => sum + row.cleanArea, 0);
  const totalBleed = rows.reduce((sum, row) => sum + row.bleedArea, 0);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="bg-orange-600 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-white" />
          <h2 className="text-xl font-semibold text-white">{t('areaCalculator')}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-300 border-b border-gray-600">
                <th className="pb-3 pr-4">{t('width')}</th>
                <th className="pb-3 pr-4">{t('height')}</th>
                <th className="pb-3 pr-4">{t('quantity')}</th>
                {calculated && (
                  <>
                    <th className="pb-3 pr-4">{t('cleanArea')}</th>
                    <th className="pb-3 pr-4">{t('bleedArea')}</th>
                  </>
                )}
                <th className="pb-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-700">
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      step="0.1"
                      value={row.width}
                      onChange={(e) => updateRow(row.id, 'width', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="310"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      step="0.1"
                      value={row.height}
                      onChange={(e) => updateRow(row.id, 'height', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="110"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      step="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </td>
                  {calculated && (
                    <>
                      <td className="py-3 pr-4 text-green-400 font-medium">
                        {row.cleanArea.toFixed(3)}
                      </td>
                      <td className="py-3 pr-4 text-blue-400 font-medium">
                        {row.bleedArea.toFixed(3)}
                      </td>
                    </>
                  )}
                  <td className="py-3">
                    <button
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {calculated && totalClean > 0 && (
              <tfoot>
                <tr className="border-t-2 border-orange-600 text-white font-bold">
                  <td className="pt-4 pr-4" colSpan={3}>{t('total')}</td>
                  <td className="pt-4 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">{totalClean.toFixed(3)} м²</span>
                      <button
                        onClick={() => copyTotal(totalClean, 'clean')}
                        className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                        title={t('copyCoefficient')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copySuccess === 'clean' && (
                        <span className="text-green-400 text-sm">{t('copied')}</span>
                      )}
                    </div>
                  </td>
                  <td className="pt-4 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">{totalBleed.toFixed(3)} м²</span>
                      <button
                        onClick={() => copyTotal(totalBleed, 'bleed')}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        title={t('copyCoefficient')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copySuccess === 'bleed' && (
                        <span className="text-blue-400 text-sm">{t('copied')}</span>
                      )}
                    </div>
                  </td>
                  <td className="pt-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={addRow}
            disabled={rows.length >= 10}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addRow')}</span>
          </button>

          <button
            onClick={calculateAreas}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>{t('calculate')}</span>
          </button>

          <button
            onClick={clearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clear')}</span>
          </button>
        </div>

        
      </div>
    </div>
  );
}
