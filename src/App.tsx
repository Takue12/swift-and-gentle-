
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

const DEFAULT_DEPARTMENT_DETAILS = {
  labor: { crew: 6000, interns: 2000, management: 3000 },
  equipment: { truckRental: 3500, dollyRental: 1200, fuel: 1300 },
  materials: { boxes: 4000, blankets: 3000, tape: 2000 },
  marketing: { flyers: 2000, emailTools: 700, socialAds: 1400 },
  operations: { rent: 3000, insurance: 1500, software: 1000 }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [jobRevenue, setJobRevenue] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [vehicleCosts, setVehicleCosts] = useState<number>(0);
  const [equipmentCosts, setEquipmentCosts] = useState<number>(0);
  const [materialsCosts, setMaterialsCosts] = useState<number>(0);
  const [overheadPercentage, setOverheadPercentage] = useState<number>(15);
  const [employees, setEmployees] = useState<Record<string, number>>(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results' | 'budget'>('job');
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000);
  const [departmentDetails, setDepartmentDetails] = useState(DEFAULT_DEPARTMENT_DETAILS);

  const departmentBudgets = useMemo(() => {
    const totals: Record<string, number> = {};
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
    const breakEvenRevenue = totalCost;
    const totalHours = Object.values(hoursWorked).reduce((sum, hours) => sum + hours, 0);
    const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;
    const revenuePerHour = totalHours > 0 ? jobRevenue / totalHours : 0;
    return { laborCosts, totalLaborCost, totalDirectCosts, overheadCosts, totalCost, profit, profitMargin, breakEvenRevenue, costPerHour, revenuePerHour, totalHours };
  }, [hoursWorked, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage, jobRevenue, employees]);

  const budgetCalculations = useMemo(() => {
    const totalBudget = Object.values(departmentBudgets).reduce((sum, val) => sum + val, 0);
    const totalSpent = totalBudget;
    const remainingBudget = monthlyRevenue - totalSpent;
    return {
      totalBudget, totalSpent, remainingBudget,
      revenueVsBudget: monthlyRevenue - totalBudget,
      spendingPercentage: (totalSpent / monthlyRevenue) * 100
    };
  }, [departmentBudgets, monthlyRevenue]);

  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  const handleSubChange = (dept: string, sub: string, value: number) => {
    setDepartmentDetails(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [sub]: value
      }
    }));
  };

  const budgetChartData = {
    labels: Object.keys(departmentBudgets),
    datasets: [{
      label: 'Budget Distribution',
      data: Object.values(departmentBudgets),
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
    }]
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const hasData = jobRevenue > 0 || Object.values(hoursWorked).some(h => h > 0) || fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0;

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-green-50 via-white to-green-100">
      <div className="w-64 bg-white shadow-xl border-green-200 p-6 space-y-6 rounded-3xl m-4">
        <h2 className="text-xl font-bold text-green-700">Dashboard</h2>
        <p className="text-sm text-green-600">Customer: <strong>{customerName || 'N/A'}</strong></p>
        {['job', 'team', 'results', 'budget'].map(tab => (
          (tab === 'results' && !showResults) ? null : (
            <button key={tab} className={\`w-full text-left px-4 py-2 rounded-full border \${activeTab === tab ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all'}\`} onClick={() => setActiveTab(tab as any)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'job' ? 'Analyzer' : tab === 'team' ? 'Hours' : tab === 'results' ? 'Results' : 'Dashboard'}
            </button>
          )
        ))}
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-6 drop-shadow">{activeTab === 'budget' ? 'Company Budget Dashboard' : 'Swift & Gentle Job Cost Analyzer'}</h1>

        {activeTab === 'job' && <JobInfoSection {...{ jobRevenue, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage }} onJobRevenueChange={setJobRevenue} onFuelCostChange={setFuelCost} onVehicleCostsChange={setVehicleCosts} onEquipmentCostsChange={setEquipmentCosts} onMaterialsCostsChange={setMaterialsCosts} onOverheadPercentageChange={setOverheadPercentage} />}
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
                  setDepartmentDetails(prev => ({
                    ...prev,
                    [newDept]: { 'subcategory 1': 0 }
                  }));
                }
              }} className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-white font-bold rounded-full shadow-xl hover:shadow-green-500 hover:scale-105 transition-all duration-300">
                + Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(departmentDetails).map(([dept, subs]) => (
                <div key={dept} className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-green-300">
                  <h3 className="text-xl text-green-700 font-semibold capitalize mb-4 flex justify-between items-center">
                    {dept}
                    <button onClick={() => {
                      const newSub = prompt(\`New subcategory for \${dept}:\`);
                      if (newSub) {
                        setDepartmentDetails(prev => ({
                          ...prev,
                          [dept]: {
                            ...prev[dept],
                            [newSub]: 0
                          }
                        }));
                      }
                    }} className="text-sm bg-gradient-to-r from-cyan-500 to-green-400 px-3 py-1 rounded-full text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all">
                      + Add Subcategory
                    </button>
                  </h3>
                  {Object.entries(subs).map(([sub, val]) => (
                    <div key={sub} className="mb-3">
                      <label className="block text-sm text-green-600 mb-1 capitalize">{sub}</label>
                      <input type="number" className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white/60" value={val} onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))} />
                    </div>
                  ))}
                  <p className="text-sm mt-3 text-right text-green-700">Total: ${departmentBudgets[dept]?.toLocaleString()}</p>
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

        {hasData && activeTab !== 'results' && activeTab !== 'budget' && (
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
