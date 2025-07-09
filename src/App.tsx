
import React, { useState, useMemo, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Default wages
const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
};

// Default department budgets and subcategories
const DEFAULT_SUBCATEGORIES = {
  labor: { crew: 6000, interns: 2700 },
  marketing: { flyers: 1500, emailTools: 900, ads: 700 },
  equipment: { trucks: 2500, tools: 1200 },
  operations: { insurance: 1500, utilities: 1200 },
  materials: { boxes: 2000, wrap: 800 }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState("budget");
  const [subcategories, setSubcategories] = useState(DEFAULT_SUBCATEGORIES);
  const [livePoints, setLivePoints] = useState<number[]>([]);

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

  const handleSubChange = (dept: string, sub: string, value: number) => {
    setSubcategories(prev => ({
      ...prev,
      [dept]: { ...prev[dept], [sub]: value }
    }));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <h1 className="text-3xl font-extrabold text-center text-cyan-400 mb-10">🚀 Swift & Gentle Futuristic Dashboard</h1>

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
        <h2 className="text-2xl text-cyan-300 font-bold mb-4">📊 Live Forecast</h2>
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
                y: {
                  ticks: {
                    color: '#94a3b8'
                  }
                },
                x: {
                  ticks: {
                    color: '#94a3b8'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
