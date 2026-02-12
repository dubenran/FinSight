import React, { useMemo } from 'react';
import { Info, AlertTriangle, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { IndicatorDef, StockData } from '../types';
import { IndicatorChart } from './IndicatorChart';

interface IndicatorCardProps {
  indicator: IndicatorDef;
  data: StockData[];
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, data }) => {
  // Determine chart type based on metric nature
  const isRatio = indicator.unit === '%' || indicator.unit === 'x';
  const chartType = isRatio ? 'line' : 'bar';

  const analysis = useMemo(() => {
    if (data.length === 0) return "Select stocks to see analysis.";

    // Get the latest common year available in data
    const lastStockData = data[0].data[indicator.key];
    if (!lastStockData || lastStockData.length === 0) return "Insufficient data.";
    
    const latestYear = lastStockData[lastStockData.length - 1].year;

    // Collect values for the latest year
    const values = data.map(stock => {
      const point = stock.data[indicator.key].find(p => p.year === latestYear);
      return { 
        name: stock.name.split('(')[0].trim(), 
        value: point ? point.value : 0 
      };
    }).filter(item => item.value !== undefined);

    if (values.length === 0) return "No data for the current period.";

    // Sort based on "Higher is Better" flag
    const sorted = [...values].sort((a, b) => b.value - a.value); // Descending by default
    
    const best = indicator.higherIsBetter ? sorted[0] : sorted[sorted.length - 1];
    const worst = indicator.higherIsBetter ? sorted[sorted.length - 1] : sorted[0];
    
    // Calculate average
    const sum = values.reduce((acc, curr) => acc + curr.value, 0);
    const avg = (sum / values.length).toFixed(1);

    const isWinnerPositive = indicator.higherIsBetter; 
    
    return (
      <span className="text-gray-700">
        In <strong>{latestYear}</strong>, <span className="font-semibold text-blue-700">{best.name}</span> leads with <strong className="text-gray-900">{best.value}{indicator.unit}</strong>, 
        performing better than the group average of {avg}{indicator.unit}. 
        {values.length > 1 && (
          <> Conversely, <span className="font-semibold text-gray-600">{worst.name}</span> ranks lowest at {worst.value}{indicator.unit}.</>
        )}
      </span>
    );
  }, [data, indicator]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {indicator.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">{indicator.subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg ${indicator.higherIsBetter ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
            {indicator.higherIsBetter ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
        </div>

        <div className="mb-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
          <div className="h-[280px] w-full">
            <IndicatorChart 
              data={data} 
              indicatorKey={indicator.key} 
              type={chartType} 
              unit={indicator.unit}
            />
          </div>
        </div>

        {/* Dynamic Analysis Section */}
        <div className="mb-5 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              {analysis}
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-gray-600 leading-relaxed">
              {indicator.description}
            </p>
          </div>
          
          {indicator.warning && (
            <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-md border border-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 leading-relaxed font-medium">
                {indicator.warning}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};