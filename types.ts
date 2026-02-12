export interface FinancialPoint {
  year: string;
  value: number;
}

export interface StockData {
  id: string;
  code: string;
  name: string;
  exchange: string;
  color: string;
  data: {
    [key in IndicatorKey]: FinancialPoint[];
  };
}

export type IndicatorKey =
  | 'grossMargin'
  | 'netProfitMargin'
  | 'roe'
  | 'inventoryDays'
  | 'arDays'
  | 'fixedAssetTurnover'
  | 'netCashToProfit'
  | 'quickRatio'
  | 'rdRatio'
  | 'cagr';

export interface IndicatorDef {
  key: IndicatorKey;
  title: string;
  subtitle: string; // The "Analysis Key Point"
  description: string;
  warning?: string; // The "Warning" or "Contrast" text
  unit: string;
  higherIsBetter: boolean;
}

export interface DimensionDef {
  id: string;
  title: string;
  description: string;
  indicators: IndicatorDef[];
}