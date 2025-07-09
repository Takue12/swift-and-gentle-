// Extended Job Cost Dashboard with Graphs
import React, { useState, useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
};

function JobCostDashboard() {
  const [jobRevenue, setJobRevenue] = useState(10000);
  const [fuelCost, setFuelCost] = useState(500);
  const [vehicleCost, setVehicleCost] = useState(800);
  const [equipmentCost, setEquipmentCost] = useState(600);
  const [materialsCost, setMaterialsCost] = useState(700);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [hoursWorked, setHoursWorked] = useState({});
  const [wages] = useState(DEFAULT_WAGES);

  const laborCosts = useMemo(() => {
    const result = {};
    Object.entries(hoursWorked).forEach(([name, hrs]) => {
      result[name] = hrs * (wages[name] || 0);
    });
    return result;
  }, [hoursWorked, wages]);

  const totalLabor = Object.values(laborCosts).reduce((a, b) => a + b, 0);
  const directCost = totalLabor + fuelCost + vehicleCost + equipmentCost + materialsCost;
  const overhead = (overheadPercent / 100) * directCost;
  const totalCost = directCost + overhead;
  const profit = jobRevenue - totalCost;
  const margin = jobRevenue > 0 ? (profit / jobRevenue) * 100 : 0;

  const handleHoursChange = (name, value) => {
    setHoursWorked(prev => ({ ...prev, [name]: Number(value) }));
  };

  const pieData = {
    labels: ['Labor', 'Fuel', 'Vehicles', 'Equipment', 'Materials', 'Overhead'],
    datasets: [{
      data: [totalLabor, fuelCost, vehicleCost, equipmentCost, materialsCost, overhead],
      backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#facc15']
    }]
  };

  const barData = {
    labels: Object.keys(laborCosts),
    datasets: [{
      label: 'Individual Labor Cost',
      data: Object.values(laborCosts),
      backgroundColor: '#10b981'
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <h1 className="text-3xl font-extrabold text-center text-green-400 mb-10">📦 Job Cost Dashboard + Graphs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-green-300 mb-4">Job Inputs</h2>
          <label>Revenue: <input type="number" value={jobRevenue} onChange={(e) => setJobRevenue(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white mb-2" /></label>
          <label>Fuel: <input type="number" value={fuelCost} onChange={(e) => setFuelCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white mb-2" /></label>
          <label>Vehicles: <input type="number" value={vehicleCost} onChange={(e) => setVehicleCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white mb-2" /></label>
          <label>Equipment: <input type="number" value={equipmentCost} onChange={(e) => setEquipmentCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white mb-2" /></label>
          <label>Materials: <input type="number" value={materialsCost} onChange={(e) => setMaterialsCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white mb-2" /></label>
          <label>Overhead %: <input type="number" value={overheadPercent} onChange={(e) => setOverheadPercent(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white" /></label>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-green-300 mb-4">Team Hours</h2>
          {Object.keys(wages).map(name => (
            <div key={name} className="mb-2">
              <label className="capitalize">{name}</label>
              <input
                type="number"
                value={hoursWorked[name] || ''}
                onChange={(e) => handleHoursChange(name, e.target.value)}
                className="w-full bg-black border border-green-500 p-2 rounded text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl shadow-md text-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-4">💰 Financial Summary</h2>
          <p>Total Labor Cost: <strong>${totalLabor.toLocaleString()}</strong></p>
          <p>Direct Costs: <strong>${directCost.toLocaleString()}</strong></p>
          <p>Overhead (@{overheadPercent}%): <strong>${overhead.toLocaleString()}</strong></p>
          <p>Total Job Cost: <strong>${totalCost.toLocaleString()}</strong></p>
          <p className={`text-xl mt-4 font-bold ${profit >= 0 ? 'text-green-300' : 'text-red-400'}`}>
            Profit: ${profit.toLocaleString()} ({margin.toFixed(2)}%)
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-green-300 mb-4">📊 Cost Breakdown</h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-md mt-6">
        <h2 className="text-xl font-bold text-green-300 mb-4">👷 Labor Cost per Team Member</h2>
        <div className="h-96">
          <Bar data={barData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { ticks: { color: '#ddd' } },
              y: { ticks: { color: '#ddd' }, beginAtZero: true }
            }
          }} />
        </div>
      </div>
    </div>
  );
}

export default JobCostDashboard;
