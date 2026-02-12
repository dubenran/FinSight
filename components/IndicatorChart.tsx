import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { StockData, IndicatorKey } from '../types';

interface IndicatorChartProps {
  data: StockData[];
  indicatorKey: IndicatorKey;
  type?: 'line' | 'bar';
  unit: string;
}

export const IndicatorChart: React.FC<IndicatorChartProps> = ({
  data,
  indicatorKey,
  type = 'line',
  unit,
}) => {
  // Transform data for Recharts: [{ name: '2021', stockId1: val, stockId2: val }]
  const chartData = React.useMemo(() => {
    if (data.length === 0) return [];
    
    // Assume all stocks have same years for simplicity in this demo
    // In production, we'd find the union of all years
    const years = data[0].data[indicatorKey].map(d => d.year);
    
    return years.map(year => {
      const point: any = { name: year };
      data.forEach(stock => {
        const stockPoint = stock.data[indicatorKey].find(d => d.year === year);
        if (stockPoint) {
          point[stock.id] = stockPoint.value;
        }
      });
      return point;
    });
  }, [data, indicatorKey]);

  const CommonProps = {
    data: chartData,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const AxisProps = {
    stroke: '#9ca3af',
    fontSize: 12,
  };

  const TooltipFormatter = (value: number) => [`${value}${unit}`, ''];

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart {...CommonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" {...AxisProps} />
          <YAxis {...AxisProps} unit={unit} width={40} />
          <Tooltip 
            formatter={TooltipFormatter}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {data.map(stock => (
            <Bar
              key={stock.id}
              dataKey={stock.id}
              name={stock.name.split('(')[0]} // Shorten name for legend
              fill={stock.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart {...CommonProps}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="name" {...AxisProps} />
        <YAxis {...AxisProps} unit={unit} width={40} />
        <Tooltip 
          formatter={TooltipFormatter}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {data.map(stock => (
          <Line
            key={stock.id}
            type="monotone"
            dataKey={stock.id}
            name={stock.name.split('(')[0]}
            stroke={stock.color}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};