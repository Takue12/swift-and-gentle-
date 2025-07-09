

import React, { useState, useMemo, useEffect } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import SummarySection from './components/SummarySection';
import ProfitAnalysis from './components/ProfitAnalysis';
import CostChart from './components/CostChart';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  const [customerName, setCustomerName] = useState('');
  const [jobRevenue, setJobRevenue] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);
  const [vehicleCosts, setVehicleCosts] = useState(0);
  const [equipmentCosts, setEquipmentCosts] = useState(0);
  const [materialsCosts, setMaterialsCosts] = useState(0);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [employees, setEmployees] = useState(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('job');
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [departmentDetails, setDepartmentDetails] = useState(DEFAULT_DETAILS);

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

  const jobCalculations = useMemo(() => {
    const laborCosts = {};
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
    const breakEvenRevenue = totalCost;
    const totalHours = Object.values(hoursWorked).reduce((sum, hours) => sum + hours, 0);
    const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;
    const revenuePerHour = totalHours > 0 ? jobRevenue / totalHours : 0;
    return {
      laborCosts, totalLaborCost, totalDirectCosts, overheadCosts, totalCost,
      profit, profitMargin, breakEvenRevenue, costPerHour, revenuePerHour, totalHours
    };
  }, [hoursWorked, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage, jobRevenue, employees]);

  const budgetChartData = {
    labels: Object.keys(departmentBudgets),
    datasets: [{
      label: 'Budget Distribution',
      data: Object.values(departmentBudgets),
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
    }]
  };

  const handleHoursChange = (name, hours) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  const handleSubChange = (dept, sub, value) => {
    setDepartmentDetails(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [sub]: value
      }
    }));
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-green-50 via-white to-green-100">
      <div className="w-64 bg-white shadow-xl border-green-200 p-6 space-y-6 rounded-3xl m-4">
        <h2 className="text-xl font-bold text-green-700">Dashboard</h2>
        {['job', 'team', 'results', 'budget'].map(tab => (
          (tab === 'results' && !showResults) ? null : (
            <button key={tab} className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === tab ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all'}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'job' ? 'Analyzer' : tab === 'team' ? 'Hours' : tab === 'results' ? 'Results' : 'Dashboard'}
            </button>
          )
        ))}
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-6 drop-shadow">{activeTab === 'budget' ? 'Company Budget Dashboard' : 'Swift & Gentle Job Cost Analyzer'}</h1>

        {activeTab === 'job' && <JobInfoSection jobRevenue={jobRevenue} fuelCost={fuelCost} vehicleCosts={vehicleCosts} equipmentCosts={equipmentCosts} materialsCosts={materialsCosts} overheadPercentage={overheadPercentage} onJobRevenueChange={setJobRevenue} onFuelCostChange={setFuelCost} onVehicleCostsChange={setVehicleCosts} onEquipmentCostsChange={setEquipmentCosts} onMaterialsCostsChange={setMaterialsCosts} onOverheadPercentageChange={setOverheadPercentage} />}
        {activeTab === 'team' && <TeamHoursSection hoursWorked={hoursWorked} wages={employees} onHoursChange={handleHoursChange} />}
        {activeTab === 'results' && showResults && (
          <>
            <ProfitAnalysis {...jobCalculations} jobRevenue={jobRevenue} />
            <CostChart {...jobCalculations} fuelCost={fuelCost} vehicleCosts={vehicleCosts} equipmentCosts={equipmentCosts} materialsCosts={materialsCosts} />
            <SummarySection {...jobCalculations} jobRevenue={jobRevenue} fuelCost={fuelCost} vehicleCosts={vehicleCosts} equipmentCosts={equipmentCosts} materialsCosts={materialsCosts} hoursWorked={hoursWorked} />
          </>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-8">
            <div className="text-center">
              <button onClick={() => {
                const newDept = prompt('Enter new department name:');
                if (newDept && !departmentDetails[newDept]) {
                  setDepartmentDetails(prev => ({ ...prev, [newDept]: { 'subcategory 1': 0 } }));
                }
              }} className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-white font-bold rounded-full shadow-xl hover:scale-105 transition-all duration-300">
                + Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(departmentDetails).map(([dept, subs]) => (
                <div key={dept} className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md border border-green-200">
                  <h3 className="text-xl text-green-700 font-semibold capitalize mb-4 flex justify-between items-center">
                    {dept}
                    <button onClick={() => {
                      const newSub = prompt(`New subcategory for ${dept}:`);
                      if (newSub) {
                        setDepartmentDetails(prev => ({ ...prev, [dept]: { ...prev[dept], [newSub]: 0 } }));
                      }
                    }} className="text-xs bg-gradient-to-r from-cyan-500 to-green-400 px-3 py-1 rounded-full text-white shadow hover:scale-105 transition-all">
                      + Add Subcategory
                    </button>
                  </h3>
                  {Object.entries(subs).map(([sub, val]) => (
                    <div key={sub} className="mb-3">
                      <label className="block text-sm text-green-600 mb-1 capitalize">{sub}</label>
                      <input type="number" className="w-full px-3 py-2 border border-green-300 rounded-md bg-white/60" value={val} onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))} />
                    </div>
                  ))}
                  <p className="text-sm mt-3 text-right text-green-700 font-medium">
                    Total: ${Object.values(subs).reduce((a, b) => a + b, 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <h2 className="text-xl font-bold text-green-700 mb-4">Budget Distribution</h2>
              <div className="h-96">
                <Pie data={budgetChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        )}

        {jobRevenue > 0 && activeTab !== 'results' && activeTab !== 'budget' && (
          <div className="mt-8 text-center">
            <button onClick={handleAnalyze} className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-green-700 transition">
              Analyze Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
