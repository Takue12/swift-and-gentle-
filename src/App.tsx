
// Swift & Gentle Full Dashboard with Employee Hours + Budget System
// Includes: Team Hours Section, Futuristic Budget Tracker, Graphs, Tips

import React, { useState, useEffect, useMemo } from 'react';
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
  const [subcategories, setSubcategories] = useState(() => {
    const saved = localStorage.getItem('swiftgentle_subcats');
    return saved ? JSON.parse(saved) : DEFAULT_SUBCATEGORIES;
  });
  const [wages] = useState(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState({});
  const [livePoints, setLivePoints] = useState<number[]>([]);

  const totalPerDept = useMemo(() => {
    const result = {};
    Object.entries(subcategories).forEach(([dept, subs]) => {
      result[dept] = Object.values(subs).reduce((a, b) => a + b, 0);
    });
    return result;
  }, [subcategories]);

  const totalLaborCost = useMemo(() => {
    return Object.entries(hoursWorked).reduce((total, [name, hours]) => {
      return total + (hours * (wages[name] || 0));
    }, 0);
  }, [hoursWorked, wages]);

  useEffect(() => {
    localStorage.setItem('swiftgentle_subcats', JSON.stringify(subcategories));
  }, [subcategories]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePoints(prev => [...prev.slice(-19), Object.values(totalPerDept).reduce((a, b) => a + b, 0)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalPerDept]);

  const handleSubChange = (dept, sub, value) => {
    setSubcategories(prev => ({
      ...prev,
      [dept]: { ...prev[dept], [sub]: value }
    }));
  };

  const handleHoursChange = (name, value) => {
    setHoursWorked(prev => ({ ...prev, [name]: Number(value) }));
  };

  const forecastGraphData = {
    labels: Array.from({ length: livePoints.length }, (_, i) => `T+${i}`),
    datasets: [{
      label: 'Live Expense Tracker',
      data: livePoints,
      borderColor: '#22d3ee',
      borderDash: [5, 5],
      fill: true,
      backgroundColor: 'rgba(34,211,238,0.1)',
      pointRadius: 1,
      tension: 0.4
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-10 animate-pulse">🚀 Swift & Gentle Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Subcategory Budget */}
        {Object.entries(subcategories).map(([dept, subs]) => (
          <div key={dept} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-cyan-300 mb-3">{dept.toUpperCase()}</h2>
            {Object.entries(subs).map(([sub, value]) => (
              <div key={sub} className="mb-3">
                <label className="block text-sm text-gray-300 mb-1 capitalize">{sub}</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-cyan-800 text-white"
                  value={value}
                  onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-cyan-950 to-gray-900 p-6 rounded-xl shadow-xl mb-10">
        <h2 className="text-2xl text-cyan-300 font-bold mb-4">📈 Forecast Graph</h2>
        <div className="h-96">
          <Line data={forecastGraphData} options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { ticks: { color: '#a1a1aa' } },
              x: { ticks: { color: '#a1a1aa' } }
            }
          }} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl text-cyan-400 font-bold mb-6">👷 Employee Hours Tracker</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(wages).map(name => (
            <div key={name}>
              <label className="block text-sm text-gray-300 mb-1 capitalize">{name}</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-gray-900 border border-cyan-700 text-white"
                value={hoursWorked[name] || ''}
                onChange={(e) => handleHoursChange(name, e.target.value)}
              />
            </div>
          ))}
        </div>
        <p className="mt-6 text-xl text-green-400 font-semibold">💰 Total Labor Cost: ${totalLaborCost.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default App;
