import React, { useState, useMemo } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
};

const DEFAULT_BUDGET_ITEMS = {
  marketing: [
    { id: 1, name: 'Flyers', cost: 500, efficiency: 65 },
    { id: 2, name: 'Social Media', cost: 1200, efficiency: 80 }
  ],
  operations: [
    { id: 1, name: 'Vehicle Maintenance', cost: 1500, efficiency: 45 },
    { id: 2, name: 'Equipment', cost: 800, efficiency: 70 }
  ],
  materials: [
    { id: 1, name: 'Construction', cost: 3500, efficiency: 60 },
    { id: 2, name: 'Safety Gear', cost: 600, efficiency: 85 }
  ],
  labor: [
    { id: 1, name: 'Overtime', cost: 2000, efficiency: 50 },
    { id: 2, name: 'Training', cost: 1200, efficiency: 75 }
  ]
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('job');
  const [jobRevenue, setJobRevenue] = useState(10000);
  const [fuelCost, setFuelCost] = useState(500);
  const [vehicleCosts, setVehicleCosts] = useState(800);
  const [equipmentCosts, setEquipmentCosts] = useState(600);
  const [materialsCosts, setMaterialsCosts] = useState(700);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [employees, setEmployees] = useState(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [budgetItems, setBudgetItems] = useState(DEFAULT_BUDGET_ITEMS);
  const [showResults, setShowResults] = useState(false);

  const handleHoursChange = (name, hours) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const jobCalculations = useMemo(() => {
    const laborCosts = Object.entries(hoursWorked).reduce((acc, [name, hours]) => {
      acc[name] = (employees[name] || 0) * hours;
      return acc;
    }, {});
    const totalLaborCost = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
    const totalDirectCosts = totalLaborCost + fuelCost + vehicleCosts + equipmentCosts + materialsCosts;
    const overheadCosts = (totalDirectCosts * overheadPercentage) / 100;
    const totalCost = totalDirectCosts + overheadCosts;
    const profit = jobRevenue - totalCost;
    const profitMargin = (profit / jobRevenue) * 100;

    return { laborCosts, totalLaborCost, totalDirectCosts, overheadCosts, totalCost, profit, profitMargin };
  }, [hoursWorked, employees, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage, jobRevenue]);

  const budgetChartData = {
    labels: Object.keys(budgetItems),
    datasets: [{
      label: 'Department Budget Allocation',
      data: Object.values(budgetItems).map(items => items.reduce((sum, item) => sum + item.cost, 0)),
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
    }]
  };

  const costBreakdownData = {
    labels: ['Labor', 'Fuel', 'Vehicles', 'Equipment', 'Materials', 'Overhead'],
    datasets: [{
      label: 'Job Cost Breakdown',
      data: [
        jobCalculations.totalLaborCost, fuelCost, vehicleCosts,
        equipmentCosts, materialsCosts, jobCalculations.overheadCosts
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6">
      <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-10">🚀 Swift & Gentle AI Dashboard</h1>

      <div className="flex space-x-4 mb-8 justify-center">
        <button onClick={() => setActiveTab('job')} className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">Job Cost</button>
        <button onClick={() => setActiveTab('budget')} className="bg-green-600 px-6 py-2 rounded hover:bg-green-700">Budget</button>
        <button onClick={() => setActiveTab('results')} className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700">Insights</button>
      </div>

      {activeTab === 'job' && (
        <div className="space-y-6">
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Customer Name"
            className="w-full p-3 bg-gray-800 border border-cyan-600 rounded"
          />
          <input
            type="number"
            value={jobRevenue}
            onChange={e => setJobRevenue(+e.target.value)}
            placeholder="Job Revenue"
            className="w-full p-3 bg-gray-800 border border-cyan-600 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(DEFAULT_WAGES).map(name => (
              <div key={name} className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">{name}</label>
                <input
                  type="number"
                  className="p-2 bg-gray-800 border border-cyan-700 rounded"
                  placeholder="Hours worked"
                  value={hoursWorked[name] || ''}
                  onChange={e => handleHoursChange(name, +e.target.value)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowResults(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded shadow"
          >
            Analyze
          </button>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Department Budget</h2>
            <Bar data={budgetChartData} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Cost Breakdown</h2>
            <Pie data={costBreakdownData} />
          </div>
        </div>
      )}

      {activeTab === 'results' && showResults && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-6 space-y-4">
          <h2 className="text-2xl font-bold text-cyan-300">📊 AI Revenue Insights</h2>
          <p>Total Revenue: <span className="text-green-400">${jobRevenue.toLocaleString()}</span></p>
          <p>Total Cost: <span className="text-yellow-400">${jobCalculations.totalCost.toFixed(2)}</span></p>
          <p>Profit: <span className="text-purple-400">${jobCalculations.profit.toFixed(2)}</span></p>
          <p>Profit Margin: <span className="text-cyan-400">{jobCalculations.profitMargin.toFixed(2)}%</span></p>

          <div className={`bg-gray-800 p-4 rounded mt-4 ${jobCalculations.profitMargin < 15 ? 'border-l-4 border-red-600' : 'border-l-4 border-green-600'}`}>
            {jobCalculations.profitMargin < 15 ? (
              <p className="text-red-400">⚠️ Margin is below 15%. Consider raising prices or cutting costs.</p>
            ) : (
              <p className="text-green-400">✅ Profit margin is strong. Keep optimizing fuel & labor efficiency.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
