// Add-on features for Swift & Gentle Dashboard:
// - Budget usage alerts 🟢 🟡 🔴
// - Auto tips based on department spending
// - Save/load subcategories in localStorage
// - Animations for improved UI experience

import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  const [livePoints, setLivePoints] = useState<number[]>([]);

  const totalPerDept = useMemo(() => {
    const result = {};
    Object.entries(subcategories).forEach(([dept, subs]) => {
      result[dept] = Object.values(subs).reduce((a, b) => a + b, 0);
    });
    return result;
  }, [subcategories]);

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

  const getStatus = (value) => {
    if (value < 3000) return "🟢 OK";
    if (value < 6000) return "🟡 High";
    return "🔴 Over";
  };

  const forecastGraphData = {
    labels: Array.from({ length: livePoints.length }, (_, i) => `T+${i}`),
    datasets: [{
      label: 'Live Budget Flow',
      data: livePoints,
      borderColor: '#0ea5e9',
      borderDash: [5, 5],
      fill: true,
      backgroundColor: 'rgba(14,165,233,0.05)',
      pointRadius: 1,
      tension: 0.4
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8 animate-pulse">🌐 Swift & Gentle Ultimate Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(subcategories).map(([dept, subs]) => (
          <div key={dept} className="bg-gradient-to-tr from-gray-800 to-gray-900 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-cyan-300 mb-2">{dept.toUpperCase()} {getStatus(totalPerDept[dept])}</h2>
            {Object.entries(subs).map(([sub, value]) => (
              <div key={sub} className="mb-3">
                <label className="block text-sm text-gray-400 mb-1 capitalize">{sub}</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-cyan-800 text-white transition duration-150"
                  value={value}
                  onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))}
                />
              </div>
            ))}
            <div className="text-sm text-cyan-500 mt-2">Tip: {totalPerDept[dept] > 5000 ? "Consider reallocating to save costs" : "Spending is optimal"}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-cyan-950 to-gray-900 mt-10 rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl text-cyan-300 font-bold mb-4">📈 Forecast & Flow</h2>
        <div className="h-96">
          <Line
            data={forecastGraphData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.raw.toLocaleString()}`
                  }
                }
              },
              scales: {
                y: { ticks: { color: '#a1a1aa' } },
                x: { ticks: { color: '#a1a1aa' } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
