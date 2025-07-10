import React, { useState, useMemo, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Default data
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
  sam: 15
};

const DEFAULT_BUDGET_ITEMS = {
  marketing: [
    { id: 1, name: 'Flyers', cost: 500, efficiency: 65 },
    { id: 2, name: 'Social Media', cost: 1200, efficiency: 80 }
  ],
  operations: [
    { id: 1, name: 'Vehicle Maintenance', cost: 1500, efficiency: 45 },
    { id: 2, name: 'Equipment', cost: 800, efficiency: 70 }
  ],
  materials: [
    { id: 1, name: 'Construction', cost: 3500, efficiency: 60 },
    { id: 2, name: 'Safety Gear', cost: 600, efficiency: 85 }
  ],
  labor: [
    { id: 1, name: 'Overtime', cost: 2000, efficiency: 50 },
    { id: 2, name: 'Training', cost: 1200, efficiency: 75 }
  ]
};

const App = () => {
  // Authentication
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
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', rate: 0 });

  // Budget Dashboard State
  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results' | 'budget'>('job');
  const [budgetItems, setBudgetItems] = useState(DEFAULT_BUDGET_ITEMS);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [activeDept, setActiveDept] = useState<keyof typeof DEFAULT_BUDGET_ITEMS>('marketing');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  // Job Calculations
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
    const departmentTotals = Object.entries(budgetItems).reduce((acc, [dept, items]) => {
      acc[dept as keyof typeof DEFAULT_BUDGET_ITEMS] = items.reduce((sum, item) => sum + item.cost, 0);
      return acc;
    }, {} as Record<keyof typeof DEFAULT_BUDGET_ITEMS, number>);

    const totalBudget = Object.values(departmentTotals).reduce((sum, cost) => sum + cost, 0);

    return { departmentTotals, totalBudget };
  }, [budgetItems]);

  // AI Insights
  const aiInsights = useMemo(() => {
    const insights = [];
    
    // Labor efficiency insight
    const avgEfficiency = Object.values(budgetItems.labor).reduce((sum, item) => sum + item.efficiency, 0) / budgetItems.labor.length;
    if (avgEfficiency < 60) {
      insights.push("⚠️ Labor efficiency is low. Consider additional training or process improvements.");
    }
    
    // Profit margin insight
    if (jobCalculations.profitMargin < 10) {
      insights.push("💰 Profit margin is below 10%. Review pricing or reduce costs.");
    }
    
    // High cost areas
    if (budgetCalculations.departmentTotals.materials > jobRevenue * 0.3) {
      insights.push("🛠️ Material costs are high. Explore bulk purchasing or alternative suppliers.");
    }
    
    // Team utilization
    if (Object.values(hoursWorked).filter(h => h > 40).length > 3) {
      insights.push("⏱️ Multiple team members with overtime. Consider hiring or redistributing workload.");
    }
    
    return insights.length > 0 ? insights : ["✅ All metrics look good. Maintain current operations."];
  }, [jobCalculations, budgetItems, budgetCalculations, hoursWorked, jobRevenue]);

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
      efficiency: 0
    };

    setBudgetItems(prev => ({
      ...prev,
      [activeDept]: [...prev[activeDept], newItem]
    }));
    setNewItemName('');
  };

  const updateBudgetItem = (field: string, value: any, itemId: number) => {
    setBudgetItems(prev => ({
      ...prev,
      [activeDept]: prev[activeDept].map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteBudgetItem = (itemId: number) => {
    setBudgetItems(prev => ({
      ...prev,
      [activeDept]: prev[activeDept].filter(item => item.id !== itemId)
    }));
  };

  const addTeamMember = () => {
    if (!newTeamMember.name.trim() || newTeamMember.rate <= 0) return;
    
    setEmployees(prev => ({
      ...prev,
      [newTeamMember.name.toLowerCase()]: newTeamMember.rate
    }));
    
    setHoursWorked(prev => ({
      ...prev,
      [newTeamMember.name.toLowerCase()]: 0
    }));
    
    setNewTeamMember({ name: '', rate: 0 });
  };

  const removeTeamMember = (name: string) => {
    const newEmployees = { ...employees };
    delete newEmployees[name];
    setEmployees(newEmployees);
    
    const newHoursWorked = { ...hoursWorked };
    delete newHoursWorked[name];
    setHoursWorked(newHoursWorked);
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <button 
          onClick={() => {
            localStorage.setItem('auth', 'true');
            setIsLoggedIn(true);
          }}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  );

  const hasJobData = jobRevenue > 0 || Object.values(hoursWorked).some(hours => hours > 0) || 
                    fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0;

  // Budget Chart Data (static now)
  const budgetChartData = {
    labels: Object.keys(budgetItems),
    datasets: [{
      label: 'Budget Allocation',
      data: Object.values(budgetCalculations.departmentTotals),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  };

  // Team Hours Chart Data
  const teamHoursData = {
    labels: Object.keys(employees),
    datasets: [{
      label: 'Hours Worked',
      data: Object.keys(employees).map(name => hoursWorked[name] || 0),
      backgroundColor: 'rgba(79, 70, 229, 0.6)'
    }]
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('job')}
            className={w-full text-left p-2 rounded ${activeTab === 'job' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}}
          >
            Job Analysis
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={w-full text-left p-2 rounded ${activeTab === 'team' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}}
          >
            Team Hours
          </button>
          {showResults && (
            <button
              onClick={() => setActiveTab('results')}
              className={w-full text-left p-2 rounded ${activeTab === 'results' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}}
            >
              Job Results
            </button>
          )}
          <button
            onClick={() => setActiveTab('budget')}
            className={w-full text-left p-2 rounded ${activeTab === 'budget' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}}
          >
            Budget Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'team' ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Team Management</h1>
            
            {/* Add Team Member */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Team Member</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={newTeamMember.rate}
                    onChange={(e) => setNewTeamMember({...newTeamMember, rate: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                onClick={addTeamMember}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Team Member
              </button>
            </div>

            {/* Team Hours Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Team Hours Distribution</h2>
              <div className="h-64">
                <Bar 
                  data={teamHoursData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Team Hours Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Team Hours</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Team Member</th>
                      <th className="text-right pb-2">Hourly Rate</th>
                      <th className="text-right pb-2">Hours Worked</th>
                      <th className="text-right pb-2">Total Cost</th>
                      <th className="text-right pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(employees).map(([name, rate]) => (
                      <tr key={name} className="border-b">
                        <td className="py-3 capitalize">{name}</td>
                        <td className="text-right">${rate}</td>
                        <td className="text-right">
                          <input
                            type="number"
                            value={hoursWorked[name] || 0}
                            onChange={(e) => handleHoursChange(name, Number(e.target.value))}
                            className="w-20 p-1 border rounded text-right"
                          />
                        </td>
                        <td className="text-right">
                          ${((hoursWorked[name] || 0) * rate).toLocaleString()}
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => removeTeamMember(name)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="pt-3">Total</td>
                      <td></td>
                      <td className="text-right pt-3">
                        {Object.values(hoursWorked).reduce((sum, hours) => sum + (hours || 0), 0)}
                      </td>
                      <td className="text-right pt-3">
                        ${Object.entries(employees).reduce((sum, [name, rate]) => 
                          sum + ((hoursWorked[name] || 0) * rate), 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        ) : activeTab !== 'budget' ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Job Cost Analysis</h1>
            
            {activeTab === 'job' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="mb-4">
                  <label className="block mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Job Revenue ($)</label>
                    <input
                      type="number"
                      value={jobRevenue}
                      onChange={(e) => setJobRevenue(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Fuel Cost ($)</label>
                    <input
                      type="number"
                      value={fuelCost}
                      onChange={(e) => setFuelCost(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && showResults && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Profit Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-4 rounded">
                      <h3 className="font-semibold">Total Revenue</h3>
                      <p className="text-2xl">${jobRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded">
                      <h3 className="font-semibold">Total Cost</h3>
                      <p className="text-2xl">${jobCalculations.totalCost.toLocaleString()}</p>
                    </div>
                    <div className={p-4 rounded ${
                      jobCalculations.profit >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }}>
                      <h3 className="font-semibold">Profit</h3>
                      <p className="text-2xl">${jobCalculations.profit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">AI Insights</h2>
                  <div className="space-y-3">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Cost Breakdown</h2>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: ['Labor', 'Fuel', 'Vehicle', 'Equipment', 'Materials', 'Overhead'],
                        datasets: [{
                          data: [
                            jobCalculations.totalLaborCost,
                            fuelCost,
                            vehicleCosts,
                            equipmentCosts,
                            materialsCosts,
                            jobCalculations.overheadCosts
                          ],
                          backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', 
                            '#4BC0C0', '#9966FF', '#FF9F40'
                          ]
                        }]
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {hasJobData && activeTab !== 'results' && (
              <button
                onClick={handleAnalyze}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Analyze Job
              </button>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">Budget Dashboard</h1>
            
            {/* Department Selector */}
            <div className="flex space-x-2 mb-6">
              {(Object.keys(budgetItems) as Array<keyof typeof budgetItems>).map(dept => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={px-4 py-2 rounded capitalize ${
                    activeDept === dept 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Department Items */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold capitalize">{activeDept} Budget</h2>
                  <div className="flex">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="New item name"
                      className="p-2 border rounded-l"
                    />
                    <button
                      onClick={addBudgetItem}
                      className="bg-blue-600 text-white p-2 rounded-r"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Item</th>
                      <th className="text-right pb-2">Cost</th>
                      <th className="text-right pb-2">Efficiency</th>
                      <th className="text-right pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetItems[activeDept].map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">
                          {editingItem === item.id ? (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateBudgetItem('name', e.target.value, item.id)}
                              className="w-full p-1 border"
                            />
                          ) : (
                            item.name
                          )}
                        </td>
                        <td className="text-right">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.cost}
                              onChange={(e) => updateBudgetItem('cost', Number(e.target.value), item.id)}
                              className="w-24 p-1 border text-right"
                            />
                          ) : (
                            $${item.cost.toLocaleString()}
                          )}
                        </td>
                        <td className="text-right">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={item.efficiency}
                              onChange={(e) => updateBudgetItem('efficiency', Number(e.target.value), item.id)}
                              className="w-24 p-1 border text-right"
                            />
                          ) : (
                            ${item.efficiency}%
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end space-x-2">
                            {editingItem === item.id ? (
                              <button
                                onClick={() => setEditingItem(null)}
                                className="text-green-600"
                              >
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingItem(item.id)}
                                  className="text-blue-600"
                                >
                                  <FiEdit />
                                </button>
                                <button
                                  onClick={() => deleteBudgetItem(item.id)}
                                  className="text-red-600"
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

              {/* Budget Analytics */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Budget Allocation</h2>
                  <div className="h-64">
                    <Bar
                      data={budgetChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Department Totals</h2>
                  <div className="space-y-2">
                    {(Object.keys(budgetItems) as Array<keyof typeof budgetItems>).map(dept => (
                      <div key={dept} className="flex justify-between">
                        <span className="capitalize">{dept}</span>
                        <span>${budgetCalculations.departmentTotals[dept].toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-bold">
                      <div className="flex justify-between">
                        <span>Total Budget</span>
                        <span>${budgetCalculations.totalBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;   
