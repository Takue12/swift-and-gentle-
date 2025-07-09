
import React, { useState, useMemo, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Wages for default employees
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState("budget");
  const [subcategories, setSubcategories] = useState(DEFAULT_SUBCATEGORIES);
  const [livePoints, setLivePoints] = useState<number[]>([0]);

  const totalPerDept = useMemo(() => {
    const result: Record<string, number> = {};
    Object.entries(subcategories).forEach(([dept, subs]) => {
      result[dept] = Object.values(subs).reduce((a, b) => a + b, 0);
    });
    return result;
  }, [subcategories]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePoints(prev => [...prev.slice(-20), Object.values(totalPerDept).reduce((a, b) => a + b, 0)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalPerDept]);

  const handleSubChange = (dept: string, sub: string, value: number) => {
    setSubcategories(prev => ({
      ...prev,
      [dept]: { ...prev[dept], [sub]: value }
    }));
  };

  const pieData = {
    labels: Object.keys(totalPerDept),
    datasets: [{
      data: Object.values(totalPerDept),
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
    }]
  };

  const lineData = {
    labels: livePoints.map((_, i) => `T${i}`),
    datasets: [{
      label: 'Live Spending',
      data: livePoints,
      borderColor: '#10B981',
      borderDash: [5, 5],
      fill: false,
      tension: 0.3
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-800 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">💹 Futuristic Budget Tracker</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-green-500">
            <h2 className="text-xl mb-4 font-semibold text-green-300">Live Expense Tracking</h2>
            <div className="h-72">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-green-500">
            <h2 className="text-xl mb-4 font-semibold text-green-300">Department Share (Pie)</h2>
            <div className="h-72">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="mt-10 bg-slate-900 p-6 rounded-xl border border-green-700 shadow-lg">
          <h2 className="text-2xl font-semibold text-green-400 mb-6">🧩 Department Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(subcategories).map(([dept, subs]) => (
              <div key={dept} className="bg-slate-800 rounded-xl p-4 border border-green-400">
                <h3 className="text-lg font-semibold text-green-300 capitalize mb-3">{dept}</h3>
                {Object.entries(subs).map(([sub, val]) => (
                  <div key={sub} className="mb-3">
                    <label className="block text-sm text-gray-300 mb-1">{sub}</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 rounded-md bg-gray-700 border border-green-500 text-white"
                      value={val}
                      onChange={e => handleSubChange(dept, sub, parseFloat(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
