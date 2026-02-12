import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  
  // In a real app, this would filter based on input
  // For this demo, we just show the available mock stocks not yet selected

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mr-2">
          Comparing:
        </span>
        
        {selectedStockIds.map(id => {
          const stock = availableStocks.find(s => s.id === id);
          if (!stock) return null;
          return (
            <div 
              key={id} 
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium text-white shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: stock.color }}
            >
              <span>{stock.name}</span>
              <button 
                onClick={() => onToggleStock(id)}
                className="hover:bg-white/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Stock
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
              <div className="p-2 text-xs font-semibold text-gray-400 bg-gray-50">Available Samples</div>
              {availableStocks.filter(s => !selectedStockIds.includes(s.id)).map(stock => (
                <button
                  key={stock.id}
                  onClick={() => {
                    onToggleStock(stock.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 flex items-center justify-between group"
                >
                  <span>{stock.name}</span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400">{stock.code}</span>
                </button>
              ))}
              {availableStocks.filter(s => !selectedStockIds.includes(s.id)).length === 0 && (
                 <div className="p-4 text-center text-sm text-gray-400">No more samples available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};