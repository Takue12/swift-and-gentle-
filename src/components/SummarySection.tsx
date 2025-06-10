import React from 'react';
import { 
  Receipt, 
  DollarSign, 
  Fuel, 
  Users, 
  Calculator, 
  TrendingUp,
  Clock,
  Award,
  AlertTriangle,
  Truck,
  Wrench,
  FileText,
  Building
} from 'lucide-react';

interface SummarySectionProps {
  jobRevenue: number;
  fuelCost: number;
  vehicleCosts: number;
  equipmentCosts: number;
  materialsCosts: number;
  overheadCosts: number;
  totalLaborCost: number;
  totalCost: number;
  profit: number;
  laborCosts: Record<string, number>;
  hoursWorked: Record<string, number>;
}

export default function SummarySection({
  jobRevenue,
  fuelCost,
  vehicleCosts,
  equipmentCosts,
  materialsCosts,
  overheadCosts,
  totalLaborCost,
  totalCost,
  profit,
  laborCosts,
  hoursWorked
}: SummarySectionProps) {
  const totalHours = Object.values(hoursWorked).reduce((sum, hours) => sum + hours, 0);
  
  let highestPaid = '';
  let lowestPaid = '';
  let highestCost = 0;
  let lowestCost = Infinity;
  
  Object.entries(laborCosts).forEach(([name, cost]) => {
    if (cost > highestCost) {
      highestCost = cost;
      highestPaid = name;
    }
    if (cost < lowestCost && cost > 0) {
      lowestCost = cost;
      lowestPaid = name;
    }
  });

  const profitMargin = jobRevenue > 0 ? ((profit / jobRevenue) * 100) : 0;

  const stats = [
    { 
      label: 'Revenue', 
      value: `$${jobRevenue.toFixed(2)}`, 
      icon: DollarSign, 
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    { 
      label: 'Labor Cost', 
      value: `$${totalLaborCost.toFixed(2)}`, 
      icon: Users, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    { 
      label: 'Fuel Cost', 
      value: `$${fuelCost.toFixed(2)}`, 
      icon: Fuel, 
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
    { 
      label: 'Vehicle Costs', 
      value: `$${vehicleCosts.toFixed(2)}`, 
      icon: Truck, 
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    { 
      label: 'Equipment', 
      value: `$${equipmentCosts.toFixed(2)}`, 
      icon: Wrench, 
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    { 
      label: 'Materials', 
      value: `$${materialsCosts.toFixed(2)}`, 
      icon: FileText, 
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    { 
      label: 'Overhead', 
      value: `$${overheadCosts.toFixed(2)}`, 
      icon: Building, 
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200'
    },
    { 
      label: 'Total Cost', 
      value: `$${totalCost.toFixed(2)}`, 
      icon: Calculator, 
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    { 
      label: profit >= 0 ? 'Profit' : 'Loss', 
      value: `$${Math.abs(profit).toFixed(2)}`, 
      icon: profit >= 0 ? TrendingUp : AlertTriangle, 
      color: profit >= 0 ? 'text-green-600' : 'text-red-600',
      bg: profit >= 0 ? 'bg-green-50' : 'bg-red-50',
      border: profit >= 0 ? 'border-green-200' : 'border-red-200'
    },
    { 
      label: 'Total Hours', 
      value: totalHours.toFixed(2), 
      icon: Clock, 
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
  ];

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Detailed Job Summary</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.bg} ${stat.border} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {Object.keys(laborCosts).length > 0 && (
        <>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {highestPaid && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <Award className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Highest Contributor</p>
                    <p className="font-bold text-yellow-700">
                      {highestPaid.charAt(0).toUpperCase() + highestPaid.slice(1)} - ${highestCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              
              {lowestPaid && Object.keys(laborCosts).length > 1 && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <Users className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lowest Contributor</p>
                    <p className="font-bold text-gray-700">
                      {lowestPaid.charAt(0).toUpperCase() + lowestPaid.slice(1)} - ${lowestCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Profit Margin</span>
              <span className={`text-xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  profitMargin >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}