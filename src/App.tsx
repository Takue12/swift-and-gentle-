import React, { useState, useMemo, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results' | 'budget'>('job');
  const [budgetItems, setBudgetItems] = useState(DEFAULT_BUDGET_ITEMS);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [activeDept, setActiveDept] = useState<keyof typeof DEFAULT_BUDGET_ITEMS>('marketing');

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

  // Budget Totals per Department
  const budgetCalculations = useMemo(() => {
    const departmentTotals = Object.entries(budgetItems).reduce((acc, [dept, items]) => {
      acc[dept as keyof typeof DEFAULT_BUDGET_ITEMS] = items.reduce((sum, item) => sum + item.cost, 0);
      return acc;
    }, {} as Record<keyof typeof DEFAULT_BUDGET_ITEMS, number>);

    const totalBudget = Object.values(departmentTotals).reduce((sum, cost) => sum + cost, 0);

    return { departmentTotals, totalBudget };
  }, [budgetItems]);

  // AI Insights (local logic-based)
  const aiInsights = useMemo(() => {
    const insights: string[] = [];

    const avgEfficiency = Object.values(budgetItems.labor).reduce((sum, item) => sum + item.efficiency, 0) / budgetItems.labor.length;
    if (avgEfficiency < 60) insights.push("⚠️ Labor efficiency is low. Consider retraining or reallocation.");

    if (jobCalculations.profitMargin < 10) insights.push("💡 Low profit margin. Review pricing strategy or reduce unnecessary costs.");

    if (budgetCalculations.departmentTotals.materials > jobRevenue * 0.3) {
      insights.push("📦 High material cost. Explore bulk suppliers or discounts.");
    }

    const overtimeWorkers = Object.values(hoursWorked).filter(h => h > 40).length;
    if (overtimeWorkers > 3) insights.push("⏱️ Too many staff in overtime. Consider redistributing workload or hiring part-time support.");

    if (insights.length === 0) insights.push("✅ Everything looks efficient. No action needed.");

    return insights;
  }, [budgetItems, jobCalculations, jobRevenue, budgetCalculations, hoursWorked]);
    // Handle hours worked update
  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  // Trigger job analysis
  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  // Add a new budget item to a department
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

  // Update an existing budget item field
  const updateBudgetItem = (field: string, value: any, itemId: number) => {
    setBudgetItems(prev => ({
      ...prev,
      [activeDept]: prev[activeDept].map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  // Delete a budget item
  const deleteBudgetItem = (itemId: number) => {
    setBudgetItems(prev => ({
      ...prev,
      [activeDept]: prev[activeDept].filter(item => item.id !== itemId)
    }));
  };

  // Add a new team member
  const addTeamMember = () => {
    if (!newTeamMember.name.trim() || newTeamMember.rate <= 0) return;

    const newName = newTeamMember.name.toLowerCase();

    setEmployees(prev => ({
      ...prev,
      [newName]: newTeamMember.rate
    }));

    setHoursWorked(prev => ({
      ...prev,
      [newName]: 0
    }));

    setNewTeamMember({ name: '', rate: 0 });
  };

  // Remove a team member
  const removeTeamMember = (name: string) => {
    const updatedEmployees = { ...employees };
    delete updatedEmployees[name];
    setEmployees(updatedEmployees);

    const updatedHours = { ...hoursWorked };
    delete updatedHours[name];
    setHoursWorked(updatedHours);
  };


return (
  <div className="min-h-screen flex bg-gray-50">
    {/* Sidebar */}
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <div className="space-y-2">
        <button
          onClick={() => setActiveTab('job')}
          className={`w-full text-left p-2 rounded ${activeTab === 'job' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        >
          Job Analysis
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`w-full text-left p-2 rounded ${activeTab === 'team' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        >
          Team Hours
        </button>
        {showResults && (
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full text-left p-2 rounded ${activeTab === 'results' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            Job Results
          </button>
        )}
        <button
          onClick={() => setActiveTab('budget')}
          className={`w-full text-left p-2 rounded ${activeTab === 'budget' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        >
          Budget Dashboard
        </button>
      </div>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 p-8 overflow-auto">
      {activeTab === 'job' && (
        <>
          <h1 className="text-3xl font-bold mb-6">Job Analysis</h1>
          {/* Include jobRevenue, fuelCost inputs, customerName, vehicleCost, equipmentCost etc. */}
          {/* Already declared in earlier parts – you can paste that section here from PART 1 */}
        </>
      )}

      {activeTab === 'team' && (
        <>
          <h1 className="text-3xl font-bold mb-6">Team Management</h1>
          {/* Include add team member, bar graph, and editable hours table from PART 2 */}
        </>
      )}

      {activeTab === 'results' && showResults && (
        <>
          <h1 className="text-3xl font-bold mb-6">Job Results & AI Suggestions</h1>
          {/* Include AI insights, pie chart, and profit cards from PART 2 */}
        </>
      )}

      {activeTab === 'budget' && (
        <>
          <h1 className="text-3xl font-bold mb-6">Budget Dashboard</h1>
          {/* Include department selector, budget list with edit/delete, and bar chart from PART 2 */}
        </>
      )}
    </div>
  </div>
);
  // ---------- If Not Logged In ---------- //
if (!isLoggedIn) {
  return (
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
}
  const handleAnalyze = () => {
  setShowResults(true);
  setActiveTab('results');
};
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

const teamHoursData = {
  labels: Object.keys(employees),
  datasets: [{
    label: 'Hours Worked',
    data: Object.keys(employees).map(name => hoursWorked[name] || 0),
    backgroundColor: 'rgba(79, 70, 229, 0.6)'
  }]
};
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-bold mb-4">📡 AI-Powered Suggestions</h2>
  <div className="space-y-3">
    {aiInsights.map((insight, index) => (
      <div key={index} className="p-3 bg-blue-50 rounded-lg text-blue-800">
        {insight}
      </div>
    ))}
  </div>
</div>
export default App;




