// Enhanced Swift & Gentle Dashboard with Live Data, Customer Management, and AI Insights
import React, { useState, useMemo, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Default data structures
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

// Customer type definition
type Customer = {
  id: string;
  name: string;
  contact: string;
  jobHistory: Array<{
    jobId: string;
    date: string;
    revenue: number;
    profit: number;
  }>;
};

function App() {
  // State management
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '' });
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch live market data (fuel prices, material costs)
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // Mock API calls - replace with actual API endpoints
        const fuelResponse = await fetch('https://api.example.com/fuel-prices');
        const materialResponse = await fetch('https://api.example.com/material-costs');
        
        const fuelData = await fuelResponse.json();
        const materialData = await materialResponse.json();
        
        setMarketData({
          fuelPrice: fuelData.price,
          materialCosts: materialData
        });
        
        // Auto-update costs based on market data
        setFuelCost(fuelData.price * 100); // Example calculation
        setMaterialsCosts(materialData.boxes * 100 + materialData.wrap * 50);
        
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        // Fallback to default values
        setMarketData({
          fuelPrice: 3.50,
          materialCosts: { boxes: 20, wrap: 8 }
        });
      }
      setLoading(false);
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 3600000); // Refresh hourly
    return () => clearInterval(interval);
  }, []);

  // Customer management
  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) return;
    
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      contact: newCustomer.contact,
      jobHistory: []
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', contact: '' });
  };

  // Budget calculations
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

  // Job cost calculations with enhanced accuracy
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

  // Enhanced job cost estimation
  const estimatedJobCost = useMemo(() => {
    const baseEstimate = totalCost;
    const contingency = baseEstimate * 0.1; // 10% contingency
    const profitTarget = baseEstimate * 0.2; // 20% profit target
    return {
      baseEstimate,
      contingency,
      profitTarget,
      recommendedPrice: baseEstimate + contingency + profitTarget
    };
  }, [totalCost]);

  // Live budget tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePoints(prev => [...prev.slice(-19), totalBudget]);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalBudget]);

  // Enhanced AI insights with live data
  const aiInsight = useMemo(() => {
    const insights = [];
    
    if (profitMargin < 10) {
      insights.push("⚠️ Profit margin below 10% - optimize labor or materials");
    }
    
    if (totalBudget > jobRevenue * 0.9) {
      insights.push("🔍 High spending - review marketing and operations budgets");
    }
    
    if (marketData?.fuelPrice > 4.00) {
      insights.push("⛽ Fuel prices high - consider route optimization");
    }
    
    if (currentCustomer?.jobHistory.length) {
      const avgProfit = currentCustomer.jobHistory.reduce((sum, job) => sum + job.profit, 0) / currentCustomer.jobHistory.length;
      if (avgProfit < (jobRevenue * 0.15)) {
        insights.push(`👤 Customer ${currentCustomer.name} has below-average profitability`);
      }
    }
    
    return insights.length > 0 
      ? insights.join("\n\n") 
      : "✅ All systems optimal - maintain current operations";
  }, [profitMargin, totalBudget, jobRevenue, marketData, currentCustomer]);

  // Chart data configurations
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
        <h1 className="text-3xl font-extrabold text-cyan-400">Swift & Gentle AI Dashboard</h1>
        <div className="mt-4 space-x-4">
          <button onClick={() => setActiveTab('budget')} className={`px-4 py-2 rounded ${activeTab === 'budget' ? 'bg-cyan-600' : 'bg-cyan-800'}`}>Budget Tracker</button>
          <button onClick={() => setActiveTab('job')} className={`px-4 py-2 rounded ${activeTab === 'job' ? 'bg-green-600' : 'bg-green-800'}`}>Job Cost Analyzer</button>
          <button onClick={() => setActiveTab('customers')} className={`px-4 py-2 rounded ${activeTab === 'customers' ? 'bg-purple-600' : 'bg-purple-800'}`}>Customers</button>
        </div>
      </header>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-xl">Loading live market data...</div>
        </div>
      )}

      {activeTab === 'budget' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(subcategories).map(([dept, subs]) => (
              <div key={dept} className="p-4 bg-gray-800 rounded-xl shadow">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">{dept.toUpperCase()}</h3>
                {Object.entries(subs).map(([sub, value]) => (
                  <div key={sub} className="mb-2">
                    <label className="text-sm capitalize">{sub.replace(/([A-Z])/g, ' $1')}</label>
                    <input 
                      type="number" 
                      className="w-full rounded bg-gray-900 p-2 border border-cyan-700 text-white"
                      value={value} 
                      onChange={(e) => handleSubChange(dept, sub, Number(e.target.value))} 
                    />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300 mb-2">Customer</h2>
              <select 
                className="w-full p-2 rounded bg-gray-900 border border-green-700 text-white"
                value={currentCustomer?.id || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.id === e.target.value);
                  setCurrentCustomer(customer || null);
                }}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Job Revenue</h2>
              <input 
                type="number" 
                value={jobRevenue} 
                onChange={(e) => setJobRevenue(Number(e.target.value))} 
                className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" 
              />
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Recommended Price</h2>
              <div className="mt-2 p-2 bg-gray-700 rounded">
                ${estimatedJobCost.recommendedPrice.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Fuel</h2>
              <div className="flex items-center mt-2">
                <input 
                  type="number" 
                  value={fuelCost} 
                  onChange={(e) => setFuelCost(Number(e.target.value))} 
                  className="w-full p-2 rounded bg-gray-900 border border-green-700 text-white" 
                />
                {marketData && (
                  <span className="ml-2 text-xs text-cyan-300">
                    (${marketData.fuelPrice}/gal)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Materials</h2>
              <input 
                type="number" 
                value={materialsCosts} 
                onChange={(e) => setMaterialsCosts(Number(e.target.value))} 
                className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" 
              />
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Vehicles</h2>
              <input 
                type="number" 
                value={vehicleCosts} 
                onChange={(e) => setVehicleCosts(Number(e.target.value))} 
                className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" 
              />
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300">Overhead %</h2>
              <input 
                type="number" 
                value={overheadPercentage} 
                onChange={(e) => setOverheadPercentage(Number(e.target.value))} 
                className="w-full mt-2 p-2 rounded bg-gray-900 border border-green-700 text-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Cost Distribution</h2>
              <Pie data={pieData} />
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Labor Costs</h2>
              <Bar data={barData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300 mb-4">Job Cost Breakdown</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Direct Costs:</span>
                  <span>${totalDirectCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overhead ({overheadPercentage}%):</span>
                  <span>${overheadCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span>${totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className={profitMargin >= 20 ? 'text-green-400' : profitMargin >= 10 ? 'text-yellow-400' : 'text-red-400'}>
                    {profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-green-300 mb-2">AI Insights</h2>
              <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-line">
                {aiInsight}
              </div>
              {marketData && (
                <div className="mt-4 text-sm text-gray-400">
                  <p>Live Market Data: Fuel ${marketData.fuelPrice}/gal | Materials ${marketData.materialCosts.boxes}/box</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-purple-300 mb-4">Add New Customer</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input 
                  type="text" 
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full p-2 rounded bg-gray-900 border border-purple-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Contact Info</label>
                <input 
                  type="text" 
                  value={newCustomer.contact}
                  onChange={(e) => setNewCustomer({...newCustomer, contact: e.target.value})}
                  className="w-full p-2 rounded bg-gray-900 border border-purple-700 text-white"
                />
              </div>
              <button 
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
              >
                Add Customer
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-purple-300 mb-4">Customer List</h2>
            <div className="space-y-3">
              {customers.length === 0 ? (
                <p className="text-gray-400">No customers added yet</p>
              ) : (
                customers.map(customer => (
                  <div 
                    key={customer.id} 
                    className={`p-3 rounded-lg cursor-pointer ${currentCustomer?.id === customer.id ? 'bg-purple-900' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setCurrentCustomer(customer)}
                  >
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-gray-300">{customer.contact}</p>
                    {customer.jobHistory.length > 0 && (
                      <p className="text-xs mt-1">
                        {customer.jobHistory.length} jobs | 
                        Avg Profit: ${(
                          customer.jobHistory.reduce((sum, job) => sum + job.profit, 0) / 
                          customer.jobHistory.length
                        ).toFixed(0)}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
