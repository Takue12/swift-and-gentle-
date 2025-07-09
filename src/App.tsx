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
  chino: 25,
  cosme: 25,
  chief: 25,
  daniel: 25,
  brendon: 13,
  chengetai: 13,
  matarutse: 13,
  rey: 20,
  intern: 13,
  sam: 15,
};

const DEFAULT_BUDGETS = {
  labor: 15000,
  equipment: 8000,
  materials: 12000,
  marketing: 5000,
  operations: 7000,
};

function App() {
  // Existing job analysis state
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
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // New budget dashboard state
  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results' | 'budget'>('job');
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000);
  const [departmentBudgets, setDepartmentBudgets] = useState<Record<string, number>>(DEFAULT_BUDGETS);
  const [departmentSpending, setDepartmentSpending] = useState<Record<string, number>>({
    labor: 8700,
    equipment: 4200,
    materials: 6800,
    marketing: 3100,
    operations: 4500,
  });

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  // Existing calculations
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

    return {
      laborCosts,
      totalLaborCost,
      totalDirectCosts,
      overheadCosts,
      totalCost,
      profit,
      profitMargin,
      breakEvenRevenue,
      costPerHour,
      revenuePerHour,
      totalHours
    };
  }, [hoursWorked, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage, jobRevenue, employees]);

  // New budget calculations
  const budgetCalculations = useMemo(() => {
    const totalBudget = Object.values(departmentBudgets).reduce((sum, budget) => sum + budget, 0);
    const totalSpent = Object.values(departmentSpending).reduce((sum, spent) => sum + spent, 0);
    const remainingBudget = totalBudget - totalSpent;
    const revenueVsBudget = monthlyRevenue - totalBudget;

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      revenueVsBudget,
      spendingPercentage: (totalSpent / totalBudget) * 100
    };
  }, [departmentBudgets, departmentSpending, monthlyRevenue]);

  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  const handleBudgetChange = (department: string, value: number) => {
    setDepartmentBudgets(prev => ({ ...prev, [department]: value }));
  };

  const handleSpendingChange = (department: string, value: number) => {
    setDepartmentSpending(prev => ({ ...prev, [department]: value }));
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const hasData = jobRevenue > 0 || Object.values(hoursWorked).some(hours => hours > 0) || 
                  fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0;

  // Budget chart data
  const budgetChartData = {
    labels: Object.keys(departmentBudgets),
    datasets: [
      {
        label: 'Budget',
        data: Object.values(departmentBudgets),
        backgroundColor: '#10B981',
      },
      {
        label: 'Actual Spending',
        data: Object.values(departmentSpending),
        backgroundColor: '#3B82F6',
      }
    ]
  };

  const spendingChartData = {
    labels: Object.keys(departmentBudgets),
    datasets: [{
      label: 'Remaining Budget',
      data: Object.keys(departmentBudgets).map(dept => 
        departmentBudgets[dept] - departmentSpending[dept]
      ),
      backgroundColor: '#F59E0B',
    }]
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-green-100 via-white to-green-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg border-green-300 p-6 space-y-6 rounded-3xl m-4">
        <h2 className="text-xl font-bold text-green-700 mb-4">Dashboard</h2>
        
        <p className="text-sm text-green-600">Customer: <strong>{customerName || 'N/A'}</strong></p>
        <button 
          className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'job' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} 
          onClick={() => setActiveTab('job')}>
          Job Analyzer
        </button>
        <button 
          className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'team' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} 
          onClick={() => setActiveTab('team')}>
          Team Hours
        </button>
        {showResults && (
          <button 
            className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'results' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} 
            onClick={() => setActiveTab('results')}>
            Job Results
          </button>
        )}
        <button 
          className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'budget' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} 
          onClick={() => setActiveTab('budget')}>
          Budget Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-6 drop-shadow">
          {activeTab === 'budget' ? 'Company Budget Dashboard' : 'Swift & Gentle Job Cost Analyzer'}
        </h1>

        {activeTab === 'job' && (
          <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8">
            <JobInfoSection
              jobRevenue={jobRevenue}
              fuelCost={fuelCost}
              vehicleCosts={vehicleCosts}
              equipmentCosts={equipmentCosts}
              materialsCosts={materialsCosts}
              overheadPercentage={overheadPercentage}
              onJobRevenueChange={setJobRevenue}
              onFuelCostChange={setFuelCost}
              onVehicleCostsChange={setVehicleCosts}
              onEquipmentCostsChange={setEquipmentCosts}
              onMaterialsCostsChange={setMaterialsCosts}
              onOverheadPercentageChange={setOverheadPercentage}
            />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8">
            <TeamHoursSection
              hoursWorked={hoursWorked}
              wages={employees}
              onHoursChange={handleHoursChange}
            />
          </div>
        )}

        {activeTab === 'results' && showResults && (
          <div className="space-y-10">
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <ProfitAnalysis
                jobRevenue={jobRevenue}
                totalCosts={jobCalculations.totalCost}
                profit={jobCalculations.profit}
                profitMargin={jobCalculations.profitMargin}
                breakEvenRevenue={jobCalculations.breakEvenRevenue}
                costPerHour={jobCalculations.costPerHour}
                totalHours={jobCalculations.totalHours}
                revenuePerHour={jobCalculations.revenuePerHour}
              />
            </div>
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <CostChart
                laborCosts={jobCalculations.laborCosts}
                fuelCost={fuelCost}
                vehicleCosts={vehicleCosts}
                equipmentCosts={equipmentCosts}
                materialsCosts={materialsCosts}
                overheadCosts={jobCalculations.overheadCosts}
                profit={jobCalculations.profit}
              />
            </div>
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <SummarySection
                jobRevenue={jobRevenue}
                fuelCost={fuelCost}
                vehicleCosts={vehicleCosts}
                equipmentCosts={equipmentCosts}
                materialsCosts={materialsCosts}
                overheadCosts={jobCalculations.overheadCosts}
                totalLaborCost={jobCalculations.totalLaborCost}
                totalCost={jobCalculations.totalCost}
                profit={jobCalculations.profit}
                laborCosts={jobCalculations.laborCosts}
                hoursWorked={hoursWorked}
              />
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-8">
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
                <h3 className="text-green-700 font-semibold">Monthly Revenue</h3>
                <p className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
                <h3 className="text-green-700 font-semibold">Total Budget</h3>
                <p className="text-2xl font-bold">${budgetCalculations.totalBudget.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
                <h3 className="text-green-700 font-semibold">Total Spent</h3>
                <p className="text-2xl font-bold">${budgetCalculations.totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
                <h3 className="text-green-700 font-semibold">Remaining</h3>
                <p className={`text-2xl font-bold ${
                  budgetCalculations.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${budgetCalculations.remainingBudget.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Budget vs Actual Chart */}
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <h2 className="text-xl font-bold text-green-700 mb-4">Budget vs Actual Spending</h2>
              <div className="h-96">
                <Bar 
                  data={budgetChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        stacked: false,
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Department Budget Controls */}
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <h2 className="text-xl font-bold text-green-700 mb-6">Department Budgets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(departmentBudgets).map(([department, budget]) => (
                  <div key={department} className="border border-green-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-700 capitalize mb-3">{department}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-green-600 mb-1">Budget</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-green-300 rounded-md"
                          value={budget}
                          onChange={(e) => handleBudgetChange(department, Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-green-600 mb-1">Actual Spending</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-green-300 rounded-md"
                          value={departmentSpending[department] || 0}
                          onChange={(e) => handleSpendingChange(department, Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{
                              width: `${Math.min(100, (departmentSpending[department] / budget) * 100)}%`
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-green-700">
                          {Math.round((departmentSpending[department] / budget) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining Budget Pie Chart */}
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <h2 className="text-xl font-bold text-green-700 mb-4">Remaining Budget by Department</h2>
              <div className="h-96">
                <Pie 
                  data={spendingChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: $${value.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {hasData && activeTab !== 'results' && activeTab !== 'budget' && (
          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-green-700 transition"
            >
              Analyze Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
