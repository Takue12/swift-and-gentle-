import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
  // Budget Tracker Data
  const [budget, setBudget] = useState({
    labor: 5000,
    crew: 1500,
    emailTools: 300,
    ads: 700
  });

  // Team Hours Data
  const [teamHours, setTeamHours] = useState([
    { name: 'Chino', hours: 120, rate: 25 },
    { name: 'Cosme', hours: 118, rate: 25 },
    { name: 'Chief', hours: 110, rate: 25 },
    { name: 'Daniel', hours: 105, rate: 25 },
    { name: 'Brendon', hours: 35, rate: 13 },
    { name: 'Chengetai', hours: 80, rate: 13 },
    { name: 'Matarutse', hours: 85, rate: 13 },
    { name: 'Rey', hours: 80, rate: 20 },
    { name: 'Intern', hours: 75, rate: 13 },
    { name: 'Sam', hours: 70, rate: 15 }
  ]);

  // Live Budget Forecast Data
  const forecastData = {
    labels: ['1:1', '1:2', '1:3', '1:4', '1:5', '1:6', '1:7', '1:8', '1:9'],
    datasets: [{
      label: 'Budget Forecast',
      data: [12000, 11500, 11000, 10500, 10000, 9500, 9000, 8500, 8000],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Cost Overview Data
  const costData = {
    labels: ['Labor', 'Fuel', 'Materials', 'Overhead'],
    datasets: [{
      data: [8000, 1500, 2200, 1800],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']
    }]
  };

  // Calculate totals
  const totalBudget = Object.values(budget).reduce((sum, val) => sum + val, 0);
  const totalLaborCost = teamHours.reduce((sum, member) => sum + (member.hours * member.rate), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Swift & Gentle AI Dashboard</h1>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Budget Tracker */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Budget Tracker</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Labor</span>
                <span className="font-medium">${budget.labor.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Crew</span>
                <span className="font-medium">${budget.crew.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Tools</span>
                <span className="font-medium">${budget.emailTools.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Ads</span>
                <span className="font-medium">${budget.ads.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total Budget</span>
                <span>${totalBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Job Cost Analyzer */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Job Cost Analyzer</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Team</th>
                    <th className="text-right pb-2">Hours</th>
                    <th className="text-right pb-2">Hourly Rate</th>
                    <th className="text-right pb-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {teamHours.map((member) => (
                    <tr key={member.name} className="border-b">
                      <td className="py-3">{member.name}</td>
                      <td className="text-right">{member.hours}</td>
                      <td className="text-right">${member.rate}</td>
                      <td className="text-right font-medium">
                        ${(member.hours * member.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="pt-3">Total</td>
                    <td className="text-right pt-3">
                      {teamHours.reduce((sum, m) => sum + m.hours, 0)}
                    </td>
                    <td></td>
                    <td className="text-right pt-3">${totalLaborCost.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">AI Insights</h2>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800">🔍 Optimize operations to increase your revenue potential</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800">💰 Review pricing strategy to enhance job profitability</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800">⚠️ Consider expanding cost risks to minimize budget overruns</p>
              </div>
            </div>
          </div>

          {/* Live Budget Forecast */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Live Budget Forecast</h2>
            <div className="h-64">
              <Line 
                data={forecastData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => `$${value}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Cost Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Cost Overview</h2>
            <div className="h-64">
              <Pie 
                data={costData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
