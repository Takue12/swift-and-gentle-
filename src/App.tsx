
// Combined Dashboard: Budget + Job Cost
// Swift & Gentle Moving Dashboard

import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
};

const DEFAULT_SUBCATEGORIES = {
  labor: { crew: 6000, interns: 2700 },
  marketing: { flyers: 1500, emailTools: 900, ads: 700 },
  equipment: { trucks: 2500, tools: 1200 },
  operations: { insurance: 1500, utilities: 1200 },
  materials: { boxes: 2000, wrap: 800 }
};

function App() {
  const [activeTab, setActiveTab] = useState("budget");

  // Budget State
  const [subcategories, setSubcategories] = useState(DEFAULT_SUBCATEGORIES);
  const [livePoints, setLivePoints] = useState<number[]>([]);

  // Job Cost State
  const [jobRevenue, setJobRevenue] = useState(10000);
  const [fuelCost, setFuelCost] = useState(500);
  const [vehicleCost, setVehicleCost] = useState(800);
  const [equipmentCost, setEquipmentCost] = useState(600);
  const [materialsCost, setMaterialsCost] = useState(700);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [hoursWorked, setHoursWorked] = useState({});
  const [wages] = useState(DEFAULT_WAGES);

  const handleSubChange = (dept: string, sub: string, value: number) => {
    setSubcategories(prev => ({
      ...prev,
      [dept]: { ...prev[dept], [sub]: value }
    }));
  };

  const totalPerDept = useMemo(() => {
    const result: Record<string, number> = {};
    Object.entries(subcategories).forEach(([dept, subs]) => {
      result[dept] = Object.values(subs).reduce((a, b) => a + b, 0);
    });
    return result;
  }, [subcategories]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePoints(prev => [...prev.slice(-19), Object.values(totalPerDept).reduce((a, b) => a + b, 0)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalPerDept]);

  const forecastGraphData = {
    labels: Array.from({ length: livePoints.length }, (_, i) => `T+${i}`),
    datasets: [{
      label: 'Live Expense Tracker',
      data: livePoints,
      borderColor: '#0ea5e9',
      borderDash: [8, 4],
      fill: true,
      backgroundColor: 'rgba(14,165,233,0.05)',
      pointRadius: 2,
      tension: 0.4
    }]
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <h1 className="text-3xl font-extrabold text-center text-cyan-400 mb-6">🚀 Swift & Gentle Dashboard</h1>

      <div className="flex justify-center mb-8">
        <button className={`mx-2 px-4 py-2 rounded ${activeTab === 'budget' ? 'bg-cyan-600' : 'bg-gray-700'}`} onClick={() => setActiveTab('budget')}>📊 Budget Dashboard</button>
        <button className={`mx-2 px-4 py-2 rounded ${activeTab === 'job' ? 'bg-cyan-600' : 'bg-gray-700'}`} onClick={() => setActiveTab('job')}>📦 Job Cost Dashboard</button>
      </div>

      {activeTab === "budget" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(subcategories).map(([dept, subs]) => (
              <div key={dept} className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-cyan-300 mb-4">{dept.toUpperCase()}</h2>
                {Object.entries(subs).map(([sub, value]) => (
                  <div key={sub} className="mb-3">
                    <label className="block text-sm text-gray-300 mb-1 capitalize">{sub}</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 rounded bg-gray-900 border border-cyan-700 text-white"
                      value={value}
                      onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-cyan-900 to-gray-900 mt-10 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl text-cyan-300 font-bold mb-4">📉 Live Forecast</h2>
            <div className="h-96">
              <Line
                data={forecastGraphData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `$${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: { ticks: { color: '#94a3b8' }},
                    x: { ticks: { color: '#94a3b8' }}
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "job" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-green-300 mb-4">Job Inputs</h2>
              <label>Revenue: <input type="number" value={jobRevenue} onChange={(e) => setJobRevenue(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white" /></label>
              <label>Fuel: <input type="number" value={fuelCost} onChange={(e) => setFuelCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white" /></label>
              <label>Vehicles: <input type="number" value={vehicleCost} onChange={(e) => setVehicleCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white" /></label>
              <label>Equipment: <input type="number" value={equipmentCost} onChange={(e) => setEquipmentCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white" /></label>
              <label>Materials: <input type="number" value={materialsCost} onChange={(e) => setMaterialsCost(Number(e.target.value))} className="w-full bg-black border border-green-400 p-2 rounded text-white" /></label>
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
                    onChange={(e) => setHoursWorked(prev => ({ ...prev, [name]: Number(e.target.value) }))}
                    className="w-full bg-black border border-green-500 p-2 rounded text-white"
                  />
                </div>
              ))}
            </div>
          </div>

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
        </>
      )}
    </div>
  );
}

export default Ap
