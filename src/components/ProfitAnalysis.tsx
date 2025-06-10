import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Percent,
  Calculator,
  BarChart3
} from 'lucide-react';

interface ProfitAnalysisProps {
  jobRevenue: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  breakEvenRevenue: number;
  costPerHour: number;
  totalHours: number;
  revenuePerHour: number;
}

export default function ProfitAnalysis({
  jobRevenue,
  totalCosts,
  profit,
  profitMargin,
  breakEvenRevenue,
  costPerHour,
  totalHours,
  revenuePerHour
}: ProfitAnalysisProps) {
  const getProfitStatus = () => {
    if (profit > 0) {
      if (profitMargin >= 20) return { status: 'excellent', color: 'green', icon: CheckCircle };
      if (profitMargin >= 10) return { status: 'good', color: 'blue', icon: TrendingUp };
      return { status: 'marginal', color: 'yellow', icon: Target };
    }
    return { status: 'loss', color: 'red', icon: AlertTriangle };
  };

  const { status, color, icon: StatusIcon } = getProfitStatus();

  const getStatusMessage = () => {
    switch (status) {
      case 'excellent': return 'Excellent profitability! This job is highly profitable.';
      case 'good': return 'Good profit margins. This is a solid job.';
      case 'marginal': return 'Marginal profit. Consider optimizing costs or pricing.';
      case 'loss': return 'This job is operating at a loss. Review pricing and costs.';
      default: return '';
    }
  };

  const recommendations = () => {
    const recs = [];
    
    if (profitMargin < 10) {
      recs.push('Consider increasing pricing by 10-15% for better margins');
    }
    
    if (costPerHour > 50) {
      recs.push('Labor costs are high - optimize team efficiency');
    }
    
    if (totalHours > 0 && revenuePerHour < 75) {
      recs.push('Revenue per hour is low - consider premium service pricing');
    }
    
    if (profit < 0) {
      recs.push('Immediate action needed - this job loses money');
    }
    
    if (recs.length === 0) {
      recs.push('Great job! This is a well-optimized and profitable job.');
    }
    
    return recs;
  };

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Profit Analysis</h2>
      </div>

      {/* Profit Status */}
      <div className={`p-6 rounded-xl border-2 mb-6 ${
        color === 'green' ? 'bg-green-50 border-green-200' :
        color === 'blue' ? 'bg-blue-50 border-blue-200' :
        color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <StatusIcon className={`h-8 w-8 ${
            color === 'green' ? 'text-green-600' :
            color === 'blue' ? 'text-blue-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          }`} />
          <div>
            <h3 className={`text-xl font-bold ${
              color === 'green' ? 'text-green-800' :
              color === 'blue' ? 'text-blue-800' :
              color === 'yellow' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)} Performance
            </h3>
            <p className={`${
              color === 'green' ? 'text-green-700' :
              color === 'blue' ? 'text-blue-700' :
              color === 'yellow' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card bg-green-50 border-green-200 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className={`text-xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </p>
            </div>
            <Percent className={`h-8 w-8 ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>

        <div className="stat-card bg-blue-50 border-blue-200 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Break-Even Revenue</p>
              <p className="text-xl font-bold text-blue-600">${breakEvenRevenue.toFixed(2)}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-purple-50 border-purple-200 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost per Hour</p>
              <p className="text-xl font-bold text-purple-600">${costPerHour.toFixed(2)}</p>
            </div>
            <Calculator className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-indigo-50 border-indigo-200 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue per Hour</p>
              <p className="text-xl font-bold text-indigo-600">${revenuePerHour.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Profit Breakdown Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue vs Costs Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="font-medium text-green-800">Total Revenue</span>
            <span className="font-bold text-green-600">${jobRevenue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="font-medium text-red-800">Total Costs</span>
            <span className="font-bold text-red-600">${totalCosts.toFixed(2)}</span>
          </div>
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            profit >= 0 ? 'bg-blue-50' : 'bg-red-50'
          }`}>
            <span className={`font-medium ${profit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              Net {profit >= 0 ? 'Profit' : 'Loss'}
            </span>
            <span className={`font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ${Math.abs(profit).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
        <div className="space-y-2">
          {recommendations().map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}