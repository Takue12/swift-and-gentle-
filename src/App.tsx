import React, { useState, useMemo, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiTrendingUp, FiBarChart2, FiDollarSign } from 'react-icons/fi';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import SummarySection from './components/SummarySection';
import ProfitAnalysis from './components/ProfitAnalysis';
import CostChart from './components/CostChart';

Chart.register(...registerables);

// DEFAULT DATA
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
  marketing: [
    { id: 1, name: 'Flyers', cost: 0, efficiency: 0, notes: '' },
    { id: 2, name: 'Social Media Ads', cost: 0, efficiency: 0, notes: '' }
  ],
  operations: [
    { id: 1, name: 'Vehicle Maintenance', cost: 0, efficiency: 0, notes: '' },
    { id: 2, name: 'Office Supplies', cost: 0, efficiency: 0, notes: '' }
  ],
  materials: [
    { id: 1, name: 'Construction Materials', cost: 0, efficiency: 0, notes: '' },
    { id: 2, name: 'Safety Equipment', cost: 0, efficiency: 0, notes: '' }
  ],
  labor: [
    { id: 1, name: 'Overtime Hours', cost: 0, efficiency: 0, notes: '' },
    { id: 2, name: 'Training Programs', cost: 0, efficiency: 0, notes: '' }
  ]
};

// COLOR THEMES
const JOB_THEME = {
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  dark: '#0F172A',
  light: '#F8FAFC'
};

const BUDGET_THEME = {
  primary: '#00f2fe',
  secondary: '#4facfe',
  accent: '#00d4ff',
  dark: '#0a1a2a',
  light: '#e6f7ff'
};

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Job Analysis State
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
  
  // Budget Dashboard State
  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results' | 'budget'>('job');
  const [budgetDepartments, setBudgetDepartments] = useState(DEFAULT_BUDGETS);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState('marketing');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  // Job Cost Calculations
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

  // Budget Calculations
  const budgetCalculations = useMemo(() => {
    const departmentTotals = Object.keys(budgetDepartments).reduce((acc, dept) => {
      acc[dept] = budgetDepartments[dept].reduce((sum, item) => sum + (item.cost || 0), 0);
      return acc;
    }, {} as Record<string, number>);

    const totalBudget = Object.values(departmentTotals).reduce((sum, cost) => sum + cost, 0);

    return {
      departmentTotals,
      totalBudget
    };
  }, [budgetDepartments]);

  // Handlers
  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  const addBudgetItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem = {
      id: Date.now(),
      name: newItemName,
      cost: 0,
      efficiency: 0,
      notes: ''
    };

    setBudgetDepartments(prev => ({
      ...prev,
      [activeDepartment]: [...prev[activeDepartment], newItem]
    }));
    setNewItemName('');
  };

  const updateBudgetItem = (field: string, value: any, itemId: number) => {
    setBudgetDepartments(prev => ({
      ...prev,
      [activeDepartment]: prev[activeDepartment].map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteBudgetItem = (itemId: number) => {
    setBudgetDepartments(prev => ({
      ...prev,
      [activeDepartment]: prev[activeDepartment].filter(item => item.id !== itemId)
    }));
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const hasJobData = jobRevenue > 0 || Object.values(hoursWorked).some(hours => hours > 0) || 
                    fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0;

  // Budget Chart Data
  const budgetChartData = {
    labels: Object.keys(budgetDepartments),
    datasets: [{
      label: 'Total Spending',
      data: Object.keys(budgetDepartments).map(dept => 
        budgetCalculations.departmentTotals[dept]
      ),
      backgroundColor: [BUDGET_THEME.primary, BUDGET_THEME.secondary, BUDGET_THEME.accent, '#06d6a0']
    }]
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>
        
        <p className="text-sm text-gray-600">Customer: <strong>{customerName || 'N/A'}</strong></p>
        
        <button 
          className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'job' ? 'bg-green-100 text-green-800 border-l-4 border-green-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('job')}
        >
          Job Analyzer
        </button>
        
        <button 
          className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'team' ? 'bg-green-100 text-green-800 border-l-4 border-green-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('team')}
        >
          Team Hours
        </button>
        
        {showResults && (
          <button 
            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'results' ? 'bg-green-100 text-green-800 border-l-4 border-green-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('results')}
          >
            Job Results
          </button>
        )}
        
        <button 
          className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'budget' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget Dashboard
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab !== 'budget' ? (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Swift & Gentle Job Cost Analyzer
            </h1>

            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Customer Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            {activeTab === 'job' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-6">
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
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-6">
                <TeamHoursSection
                  hoursWorked={hoursWorked}
                  wages={employees}
                  onHoursChange={handleHoursChange}
                />
              </div>
            )}

            {activeTab === 'results' && showResults && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
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
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
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
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
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

            {hasJobData && activeTab !== 'results' && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleAnalyze}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-green-700 transition"
                >
                  Analyze Job
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Company Budget Dashboard
            </h1>

            {/* Department Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {Object.keys(budgetDepartments).map(dept => (
                <div 
                  key={dept}
                  onClick={() => setActiveDepartment(dept)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    activeDepartment === dept 
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-semibold capitalize text-gray-800">{dept}</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${budgetCalculations.departmentTotals[dept]?.toLocaleString() || 0}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Department Items Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold capitalize text-gray-800">
                      {activeDepartment} Items
                    </h2>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Add new item..."
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button 
                        onClick={addBudgetItem}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                      >
                        <FiPlus className="mr-1" /> Add
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-2 text-left text-gray-700">Item</th>
                          <th className="pb-2 text-right text-gray-700">Cost</th>
                          <th className="pb-2 text-right text-gray-700">Efficiency</th>
                          <th className="pb-2 text-right text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetDepartments[activeDepartment].map(item => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3">
                              {editingItem === item.id ? (
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateBudgetItem('name', e.target.value, item.id)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                <div className="font-medium text-gray-800">{item.name}</div>
                              )}
                            </td>
                            <td className="text-right">
                              {editingItem === item.id ? (
                                <input
                                  type="number"
                                  value={item.cost}
                                  onChange={(e) => updateBudgetItem('cost', Number(e.target.value), item.id)}
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                                />
                              ) : (
                                `$${item.cost.toLocaleString()}`
                              )}
                            </td>
                            <td className="text-right">
                              {editingItem === item.id ? (
                                <input
                                  type="number"
                                  value={item.efficiency}
                                  onChange={(e) => updateBudgetItem('efficiency', Number(e.target.value), item.id)}
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                                />
                              ) : (
                                <div className="flex items-center justify-end">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="h-2 rounded-full" 
                                      style={{
                                        width: `${Math.min(100, item.efficiency)}%`,
                                        backgroundColor: 
                                          item.efficiency > 70 ? '#10B981' :
                                          item.efficiency > 40 ? '#3B82F6' : '#EF4444'
                                      }}
                                    ></div>
                                  </div>
                                  {item.efficiency}%
                                </div>
                              )}
                            </td>
                            <td className="text-right">
                              <div className="flex justify-end space-x-2">
                                {editingItem === item.id ? (
                                  <button 
                                    onClick={() => setEditingItem(null)}
                                    className="p-1 text-green-600 hover:text-green-800"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => setEditingItem(item.id)}
                                      className="p-1 text-blue-600 hover:text-blue-800"
                                    >
                                      <FiEdit />
                                    </button>
                                    <button 
                                      onClick={() => deleteBudgetItem(item.id)}
                                      className="p-1 text-red-600 hover:text-red-800"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Department Efficiency Tools */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Efficiency Tools</h2>
                  
                  {activeDepartment === 'marketing' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-600">Marketing Optimization</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <span>Automate social media posting</span>
                        </li>
                        <li className="flex items-center">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <span>Implement email marketing funnel</span>
                        </li>
                        <li className="flex items-center">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <span>Use AI-generated ad copy</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeDepartment === 'operations' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-600">Operations Optimization</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <span>Implement fleet tracking system</span>
                        </li>
                        <li className="flex items-center">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <span>Digitize paperwork with mobile forms</span>
                        </li>
                        <li className="flex items-center">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <span>Schedule predictive maintenance</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Similar sections for other departments */}
                </div>
              </div>

              {/* Analytics Sidebar */}
              <div className="space-y-6">
                {/* Department Spending Chart */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Department Spending</h2>
                  <div className="h-64">
                    <Bar
                      data={budgetChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) => 
                                `$${context.raw.toLocaleString()}`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => `$${value}`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h2>
                  <div className="space-y-3">
                    {activeDepartment === 'marketing' && (
                      <>
                        <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-semibold text-blue-700">Ad Performance</h4>
                          <p className="text-sm text-gray-700">
                            Consider increasing budget for high-performing channels by 15-20%.
                          </p>
                        </div>
                      </>
                    )}
                    {activeDepartment === 'operations' && (
                      <>
                        <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-semibold text-blue-700">Fleet Maintenance</h4>
                          <p className="text-sm text-gray-700">
                            Vehicle #3 shows higher maintenance costs. Schedule diagnostic check.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
