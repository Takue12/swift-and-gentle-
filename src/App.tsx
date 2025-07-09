import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

type Customer = {
  id: string;
  name: string;
  contact: string;
  jobHistory: Array<{ jobId: string; date: string; revenue: number; profit: number }>;
};

const EnhancedJobCostDashboard = () => {
  const [jobRevenue, setJobRevenue] = useState(50000);
  const [fuelCost, setFuelCost] = useState(1200);
  const [vehicleCosts, setVehicleCosts] = useState(2500);
  const [equipmentCosts, setEquipmentCosts] = useState(1800);
  const [materialsCosts, setMaterialsCosts] = useState(2200);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [livePoints, setLivePoints] = useState<number[]>([]);
  const [aiInsights, setAIInsights] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Bob & Carol',
      contact: 'bobcarol@example.com',
      jobHistory: [
        { jobId: 'J1', date: '2025-07-01', revenue: 10000, profit: 2500 },
        { jobId: 'J2', date: '2025-07-06', revenue: 15000, profit: 3000 }
      ]
    },
    {
      id: '2',
      name: 'David & June',
      contact: 'davidjune@example.com',
      jobHistory: [
        { jobId: 'J3', date: '2025-07-05', revenue: 20000, profit: 1800 }
      ]
    }
  ]);

  const totalDirectCosts = fuelCost + vehicleCosts + equipmentCosts + materialsCosts;
  const overheadCosts = (totalDirectCosts * overheadPercentage) / 100;
  const totalCost = totalDirectCosts + overheadCosts;
  const profit = jobRevenue - totalCost;
  const profitMargin = jobRevenue ? (profit / jobRevenue) * 100 : 0;

  const revenueVsCost = {
    labels: ['Revenue', 'Total Cost', 'Profit'],
    datasets: [
      {
        label: 'Job Financials',
        data: [jobRevenue, totalCost, profit],
        backgroundColor: ['#0ea5e9', '#ef4444', '#22c55e']
      }
    ]
  };

  const jaggedLine = {
    labels: livePoints.map((_, i) => `T+${i}`),
    datasets: [{
      label: 'Live Profit Trend',
      data: livePoints,
      borderColor: '#22d3ee',
      borderDash: [6, 3],
      backgroundColor: 'rgba(34,211,238,0.05)',
      pointRadius: 2,
      tension: 0.4,
      fill: true
    }]
  };

  const topCustomers = customers.map(c => ({
    name: c.name,
    avgProfit: c.jobHistory.reduce((s, j) => s + j.profit, 0) / c.jobHistory.length
  })).sort((a, b) => b.avgProfit - a.avgProfit);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePoints(prev => [...prev.slice(-19), profit]);
    }, 5000);
    return () => clearInterval(interval);
  }, [profit]);

  useEffect(() => {
    const insights: string[] = [];
    if (profitMargin < 10) insights.push("⚠️ Profit margin is low – check fuel, labor, or overhead costs.");
    if (jobRevenue < totalCost) insights.push("📉 You're spending more than you're making on this job.");
    if (fuelCost > 1500) insights.push("⛽ High fuel costs – consider optimizing routes or bundling jobs.");
    if (overheadCosts > 1000) insights.push("🏢 High overhead – review office, admin, or idle time expenses.");
    if (insights.length === 0) insights.push("✅ Healthy margin. You're running efficiently.");
    setAIInsights(insights);
  }, [profitMargin, totalCost, fuelCost, overheadCosts]);

  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6">
        <h2 className="text-xl font-bold text-cyan-300 mb-4">Swift & Gentle</h2>
        <nav className="space-y-4">
          <button className="block w-full text-left hover:text-cyan-400">🏠 Dashboard</button>
          <button className="block w-full text-left hover:text-cyan-400">📦 Jobs</button>
          <button className="block w-full text-left hover:text-cyan-400">🤖 AI Coach</button>
          <button className="block w-full text-left hover:text-cyan-400">📈 Reports</button>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 space-y-8 overflow-auto">
        <h1 className="text-3xl font-bold text-cyan-400">Job Cost Analyzer</h1>

        <section className="grid md:grid-cols-4 gap-6">
          <div>
            <label>Job Revenue ($)</label>
            <input type="number" value={jobRevenue} onChange={e => setJobRevenue(Number(e.target.value))}
              className="w-full bg-gray-800 p-2 mt-1 rounded text-white border border-cyan-700" />
          </div>
          <div>
            <label>Fuel</label>
            <input type="number" value={fuelCost} onChange={e => setFuelCost(Number(e.target.value))}
              className="w-full bg-gray-800 p-2 mt-1 rounded text-white border border-cyan-700" />
          </div>
          <div>
            <label>Vehicles</label>
            <input type="number" value={vehicleCosts} onChange={e => setVehicleCosts(Number(e.target.value))}
              className="w-full bg-gray-800 p-2 mt-1 rounded text-white border border-cyan-700" />
          </div>
          <div>
            <label>Overhead %</label>
            <input type="number" value={overheadPercentage} onChange={e => setOverheadPercentage(Number(e.target.value))}
              className="w-full bg-gray-800 p-2 mt-1 rounded text-white border border-cyan-700" />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-2 text-green-300">Live Profit Tracker</h3>
            <div className="h-64">
              <Line data={jaggedLine} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-2 text-green-300">Revenue vs Cost</h3>
            <Bar data={revenueVsCost} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 text-green-300">AI Revenue Coach</h3>
          <ul className="list-disc pl-6 space-y-2 text-cyan-100">
            {aiInsights.map((insight, idx) => <li key={idx}>{insight}</li>)}
          </ul>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 text-yellow-300">Customer Profitability Leaderboard</h3>
          <div className="space-y-2">
            {topCustomers.map((cust, idx) => (
              <div key={idx} className="flex justify-between border-b border-gray-700 pb-1">
                <span>{cust.name}</span>
                <span className="text-green-400">${cust.avgProfit.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EnhancedJobCostDashboard;
