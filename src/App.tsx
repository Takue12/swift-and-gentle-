
import React, { useState, useMemo, useEffect } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import SummarySection from './components/SummarySection';
import ProfitAnalysis from './components/ProfitAnalysis';
import CostChart from './components/CostChart';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Setup
const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
};

const DEFAULT_DETAILS = {
  labor: { crew: 6000, interns: 2000 },
  marketing: { flyers: 1500, emailTools: 500 },
  equipment: { trucks: 2500 },
  operations: { insurance: 1000 }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobRevenue, setJobRevenue] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);
  const [vehicleCosts, setVehicleCosts] = useState(0);
  const [equipmentCosts, setEquipmentCosts] = useState(0);
  const [materialsCosts, setMaterialsCosts] = useState(0);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [employees] = useState(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('budget');
  const [monthlyRevenue] = useState(50000);
  const [departmentDetails, setDepartmentDetails] = useState(DEFAULT_DETAILS);
  const [liveChartData, setLiveChartData] = useState([4500, 4800, 4700, 5100, 4950, 5200, 5350, 5000, 5500]);

  // Auto update live graph every 3 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveChartData(prev => [...prev.slice(1), Math.floor(4500 + Math.random() * 1200)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const departmentBudgets = useMemo(() => {
    const totals = {};
    for (const dept in departmentDetails) {
      totals[dept] = Object.values(departmentDetails[dept]).reduce((a, b) => a + b, 0);
    }
    return totals;
  }, [departmentDetails]);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const handleSubChange = (dept, sub, value) => {
    setDepartmentDetails(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [sub]: value
      }
    }));
  };

  const lineData = {
    labels: Array.from({ length: liveChartData.length }, (_, i) => `T-${liveChartData.length - i}`),
    datasets: [{
      label: 'Live Expense Tracking',
      data: liveChartData,
      borderColor: '#22d3ee',
      backgroundColor: '#22d3ee44',
      tension: 0.2,
      pointRadius: 0,
      fill: true
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          color: '#22d3ee',
          callback: (val) => `$${val}`
        },
        grid: { color: '#1e293b' }
      },
      x: {
        ticks: { color: '#22d3ee' },
        grid: { display: false }
      }
    }
  };

  const pieData = {
    labels: Object.keys(departmentBudgets),
    datasets: [{
      label: 'Budget Share',
      data: Object.values(departmentBudgets),
      backgroundColor: ['#22d3ee', '#34d399', '#818cf8', '#fbbf24', '#f87171']
    }]
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="p-6 text-center text-3xl font-bold text-cyan-300 tracking-widest shadow-inner">
        🚀 Swift & Gentle | FUTURE OPS
      </div>

      <div className="p-6">
        <div className="text-center mb-8">
          <button
            onClick={() => {
              const newDept = prompt('New department name:');
              if (newDept && !departmentDetails[newDept]) {
                setDepartmentDetails(prev => ({ ...prev, [newDept]: { 'subcategory 1': 0 } }));
              }
            }}
            className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition px-6 py-3 rounded-full font-bold shadow-md"
          >
            + Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(departmentDetails).map(([dept, subs]) => (
            <div key={dept} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-cyan-400 shadow-lg">
              <h3 className="text-lg font-semibold text-cyan-300 flex justify-between items-center mb-4">
                {dept}
                <button
                  onClick={() => {
                    const sub = prompt(\`New subcategory for \${dept}:\`);
                    if (sub) {
                      setDepartmentDetails(prev => ({
                        ...prev,
                        [dept]: { ...prev[dept], [sub]: 0 }
                      }));
                    }
                  }}
                  className="bg-gradient-to-r from-green-400 to-teal-400 text-xs px-3 py-1 rounded-full shadow"
                >
                  + Add Sub
                </button>
              </h3>
              {Object.entries(subs).map(([sub, val]) => (
                <div key={sub} className="mb-3">
                  <label className="block text-sm text-cyan-200 mb-1 capitalize">{sub}</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-cyan-300 bg-black/20 text-white"
                  />
                </div>
              ))}
              <div className="text-right text-cyan-400 font-bold mt-2">
                Total: ${Object.values(subs).reduce((a, b) => a + b, 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-cyan-400">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">Live Expense Chart</h2>
            <div className="h-80">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-cyan-400">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">Budget Distribution</h2>
            <div className="h-80">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
