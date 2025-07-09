// Full Swift & Gentle Dashboard with AI Insights, Budget Tracker, and Job Cost Analyzer
import React, { useState, useMemo, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Default wages and budgets
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
  const [activeTab, setActiveTab] = useState('budget');
  const [subcategories, setSubcategories] = useState(DEFAULT_SUBCATEGORIES);
  const [livePoints, setLivePoints] = useState<number[]>([]);
  const [jobRevenue, setJobRevenue] = useState(50000);
  const [fuelCost, setFuelCost] = useState(1000);
  const [vehicleCosts, setVehicleCosts] = useState(2000);
  const [equipmentCosts, setEquipmentCosts] = useState(1800);
  const [materialsCosts, setMaterialsCosts] = useState(2200);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({});
  const [employees, setEmployees] = useState(DEFAULT_WAGES);

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

  const totalBudget = useMemo(() => {
    return Object.values(totalPerDept).reduce((a, b) => a + b, 0);
  }, [totalPerDept]);

  const laborCosts: Record<string, number> = {};
  Object.entries(hoursWorked).forEach(([name, hours]) => {
    if (hours > 0 && employees[name]) {
      laborCosts[name] = hours * employees[name];
    }
  });
  const totalLaborCost = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
  const totalDirectCosts = totalLaborCost + fuelCost + vehicleCosts + equipmentCosts + materialsCosts;
  const overheadCosts = (totalDirectCosts * overheadPercentage) / 100;
  const totalCost = totalDirectCosts + overheadCosts;
  const profit = jobRevenue - totalCost;
  const profitMargin = jobRevenue > 0 ? (profit / jobRevenue) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePoints(prev => [...prev.slice(-19), totalBudget]);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalBudget]);

  const aiInsight = useMemo(() => {
    if (profitMargin < 10) {
      return "⚠️ Your profit margin is below 10%. Consider reducing overtime, optimizing routes, or bundling jobs.";
    }
    if (totalBudget > jobRevenue) {
      return "🔍 You're spending more than your revenue. Evaluate high-cost departments like marketing or materials.";
    }
    return "✅ You're on track! Maintain spending discipline and monitor intern & vehicle ROI monthly.";
  }, [profitMargin, totalBudget, jobRevenue]);

  const pieData = {
    labels: ['Labor', 'Fuel', 'Vehicles', 'Equipment', 'Materials', 'Overhead'],
    datasets: [{
      data: [totalLaborCost, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadCosts],
      backgroundColor: ['#0ea5e9', '#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#ef4444']
    }]
  };

  const barData = {
    labels: Object.keys(laborCosts),
    datasets: [{
      label: 'Labor Cost per Employee',
      data: Object.values(laborCosts),
      backgroundColor: '#22c55e'
    }]
  };

  const lineData = {
    labels: Array.from({ length: livePoints.length }, (_, i) => `T+${i}`),
    datasets: [{
      label: 'Live Budget Trend',
      data: livePoints,
      borderColor: '#38bdf8',
      borderDash: [4, 4],
      fill: true,
      backgroundColor: 'rgba(56,189,248,0.08)',
      tension: 0.3
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-400">Swift & Gentle AI-Driven Dashboard</h1>
        <div className="mt-4 space-x-4">
          <button onClick={() => setActiveTab('budget')} className="px-4 py-2 bg-cyan-700 rounded hover:bg-cyan-600">Budget Tracker</button>
          <button onClick={() => setActiveTab('job')} className="px-4 py-2 bg-green-700 rounded hover:bg-green-600">Job Cost Analyzer</button>
        </div>
      </header>

      {activeTab === 'budget' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(subcategories).map(([dept, subs]) => (
              <div key={dept} className="p-4 bg-gray-800 rounded-xl shadow">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">{dept.toUpperCase()}</h3>
                {Object.entries(subs).map(([sub, value]) => (
                  <div key={sub} className="mb-2">
                    <label className="text-sm">{sub}</label>
                    <input type="number" className="w-full rounded bg-gray-900 p-2 border border-cyan-700 text-white"
                      value={value} onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-cyan-300 mb-4">Live Budget Forecast</h2>
            <div className="h-80">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'job' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Job Revenue</h2>
              <input type="number" value={jobRevenue} onChange={(e) => setJobRevenue(Number(e.target.value))} className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" />
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Fuel</h2>
              <input type="number" value={fuelCost} onChange={(e) => setFuelCost(Number(e.target.value))} className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" />
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Materials</h2>
              <input type="number" value={materialsCosts} onChange={(e) => setMaterialsCosts(Number(e.target.value))} className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Cost Distribution</h2>
              <Pie data={pieData} />
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Labor Costs</h2>
              <Bar data={barData} />
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-800 rounded-xl text-green-300 text-lg">
            🤖 <strong>AI Insight:</strong> {aiInsight}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
