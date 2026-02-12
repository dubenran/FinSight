import React from 'react';
import { Check, Plus, X } from 'lucide-react';
import { StockData } from '../types';

interface StockSelectorProps {
  availableStocks: StockData[];
  selectedStockIds: string[];
  onToggleStock: (id: string) => void;
}

export const StockSelector: React.FC<StockSelectorProps> = ({ 
  availableStocks, 
  selectedStockIds, 
  onToggleStock 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mr-2">
          Compare Companies:
        </span>
        {availableStocks.map((stock) => {
          const isSelected = selectedStockIds.includes(stock.id);
          return (
            <button
              key={stock.id}
              onClick={() => onToggleStock(stock.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isSelected 
                  ? 'text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              style={{ 
                backgroundColor: isSelected ? stock.color : undefined 
              }}
            >
              {isSelected && <Check size={14} strokeWidth={3} />}
              {stock.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};