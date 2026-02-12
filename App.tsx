import React, { useState } from 'react';
import { Activity, BarChart3, PieChart, ShieldCheck } from 'lucide-react';
import { DIMENSIONS, MOCK_STOCKS } from './constants';
import { StockData } from './types';
import { IndicatorCard } from './components/IndicatorCard';
import { StockSelector } from './components/StockSelector';

const App: React.FC = () => {
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>(['luxshare', 'goertek', 'lens', 'lingyi']);

  const toggleStock = (id: string) => {
    if (selectedStockIds.includes(id)) {
      if (selectedStockIds.length > 1) {
        setSelectedStockIds(prev => prev.filter(s => s !== id));
      }
    } else {
      setSelectedStockIds(prev => [...prev, id]);
    }
  };

  const activeStocks: StockData[] = selectedStockIds
    .map(id => MOCK_STOCKS.find(s => s.id === id))
    .filter((s): s is StockData => !!s);

  // Icons mapping for dimensions
  const getDimensionIcon = (id: string) => {
    switch (id) {
      case 'profitability': return <Activity className="w-6 h-6" />;
      case 'efficiency': return <BarChart3 className="w-6 h-6" />;
      case 'safety': return <ShieldCheck className="w-6 h-6" />;
      case 'growth': return <PieChart className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">FinSight</h1>
              <p className="text-xs text-gray-500">Manufacturing Analysis</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Data Source: CNINFO (Demo)
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Analysis Dashboard</h2>
          <p className="text-gray-600 max-w-3xl">
            Comparing key financial indicators for consumer electronics manufacturing leaders across profitability, efficiency, safety, and growth dimensions.
          </p>
        </div>

        {/* Controls */}
        <StockSelector 
          availableStocks={MOCK_STOCKS} 
          selectedStockIds={selectedStockIds} 
          onToggleStock={toggleStock} 
        />

        {/* Dimensions Loop */}
        <div className="space-y-12">
          {DIMENSIONS.map((dimension) => (
            <section key={dimension.id} className="scroll-mt-20" id={dimension.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  {getDimensionIcon(dimension.id)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{dimension.title}</h2>
                  <p className="text-sm text-gray-500">{dimension.description}</p>
                </div>
              </div>

              {/* Layout: 2 columns on large screens to accommodate chart width safely */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {dimension.indicators.map((indicator) => (
                  <IndicatorCard 
                    key={indicator.key} 
                    indicator={indicator} 
                    data={activeStocks} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Navigation Footer / Quick Links */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-full px-6 py-3 hidden md:flex gap-6 z-50">
        {DIMENSIONS.map(dim => (
          <a 
            key={dim.id}
            href={`#${dim.id}`}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            {dim.title.split('：')[1].split('(')[0]}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default App;