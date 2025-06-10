import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CostChartProps {
  laborCosts: Record<string, number>;
  fuelCost: number;
  vehicleCosts: number;
  equipmentCosts: number;
  materialsCosts: number;
  overheadCosts: number;
  profit: number;
}

export default function CostChart({ 
  laborCosts, 
  fuelCost, 
  vehicleCosts, 
  equipmentCosts, 
  materialsCosts, 
  overheadCosts, 
  profit 
}: CostChartProps) {
  const names = Object.keys(laborCosts);
  const costs = Object.values(laborCosts);

  // Labor cost breakdown chart
  const laborData = {
    labels: names.map(name => name.charAt(0).toUpperCase() + name.slice(1)),
    datasets: [
      {
        label: 'Labor Cost ($)',
        data: costs,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Overall cost breakdown pie chart
  const totalLaborCost = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
  const pieData = {
    labels: ['Labor', 'Fuel', 'Vehicle', 'Equipment', 'Materials', 'Overhead'],
    datasets: [
      {
        data: [totalLaborCost, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadCosts],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Labor Cost Breakdown',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#1f2937',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(0);
          },
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Total Cost Distribution',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#1f2937',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (names.length === 0 && fuelCost === 0 && vehicleCosts === 0) {
    return (
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Cost Breakdown</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Enter job costs to see the breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Cost Distribution */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Cost Distribution</h2>
        </div>
        
        <div className="h-80 mb-6">
          <Doughnut data={pieData} options={pieOptions} />
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            profit >= 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              profit >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              profit >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {profit >= 0 ? 'Profit' : 'Loss'}: ${Math.abs(profit).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Labor Cost Breakdown */}
      {names.length > 0 && (
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Labor Cost Breakdown</h2>
          </div>
          
          <div className="h-80">
            <Bar data={laborData} options={barOptions} />
          </div>
        </div>
      )}
    </div>
  );
}