import React, { useState, useMemo, useEffect } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import SummarySection from './components/SummarySection';
import ProfitAnalysis from './components/ProfitAnalysis';
import CostChart from './components/CostChart';

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobRevenue, setJobRevenue] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [vehicleCosts, setVehicleCosts] = useState<number>(0);
  const [equipmentCosts, setEquipmentCosts] = useState<number>(0);
  const [materialsCosts, setMaterialsCosts] = useState<number>(0);
  const [overheadPercentage, setOverheadPercentage] = useState<number>(15);
  const [employees, setEmployees] = useState<Record<string, number>>(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const [customerName, setCustomerName] = useState<string>('');
  const [additionalServices, setAdditionalServices] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results'>('job');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const handleServiceChange = (service: string, value: number) => {
    setAdditionalServices(prev => ({ ...prev, [service]: value }));
  };

  const calculations = useMemo(() => {
    const laborCosts: Record<string, number> = {};
    Object.entries(hoursWorked).forEach(([name, hours]) => {
      if (hours > 0 && employees[name]) {
        laborCosts[name] = hours * employees[name];
      }
    });

    const totalLaborCost = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
    const totalServicesRevenue = Object.values(additionalServices).reduce((sum, amount) => sum + amount, 0);
    const totalDirectCosts = totalLaborCost + fuelCost + vehicleCosts + equipmentCosts + materialsCosts;
    const overheadCosts = (totalDirectCosts * overheadPercentage) / 100;
    const totalCost = totalDirectCosts + overheadCosts;
    const profit = totalServicesRevenue - totalCost;
    const profitMargin = totalServicesRevenue > 0 ? (profit / totalServicesRevenue) * 100 : 0;
    const breakEvenRevenue = totalCost;

    const totalHours = Object.values(hoursWorked).reduce((sum, hours) => sum + hours, 0);
    const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;
    const revenuePerHour = totalHours > 0 ? totalServicesRevenue / totalHours : 0;

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
      totalHours,
      totalServicesRevenue
    };
  }, [hoursWorked, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage, additionalServices, employees]);

  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-indigo-700 mb-6">Menu</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('job')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'job' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
            Job Info
          </button>
          <button onClick={() => setActiveTab('team')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'team' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
            Team Hours
          </button>
          <button onClick={() => setActiveTab('results')} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === 'results' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
            Results
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">Swift & Gentle Job Cost Analyzer</h1>

          {activeTab === 'job' && (
            <>
              <div className="mb-6">
                <label className="block mb-2 text-base font-semibold text-gray-700">Customer Name</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter customer name" />
              </div>

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

              <div className="mt-6">
                <label className="block mb-2 text-base font-semibold text-gray-700">Additional Services</label>
                {['Packing', 'Storage', 'Junk Removal'].map(service => (
                  <div key={service} className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">{service}</label>
                    <input
                      type="number"
                      min="0"
                      value={additionalServices[service] || 0}
                      onChange={e => handleServiceChange(service, parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder={`Revenue from ${service}`}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'team' && (
            <TeamHoursSection
              hoursWorked={hoursWorked}
              wages={employees}
              onHoursChange={handleHoursChange}
            />
          )}

          {activeTab === 'results' && showResults && (
            <div className="space-y-10 mt-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">Customer: {customerName || 'N/A'}</h2>
              </div>

              <ProfitAnalysis
                jobRevenue={calculations.totalServicesRevenue}
                totalCosts={calculations.totalCost}
                profit={calculations.profit}
                profitMargin={calculations.profitMargin}
                breakEvenRevenue={calculations.breakEvenRevenue}
                costPerHour={calculations.costPerHour}
                totalHours={calculations.totalHours}
                revenuePerHour={calculations.revenuePerHour}
              />

              <CostChart
                laborCosts={calculations.laborCosts}
                fuelCost={fuelCost}
                vehicleCosts={vehicleCosts}
                equipmentCosts={equipmentCosts}
                materialsCosts={materialsCosts}
                overheadCosts={calculations.overheadCosts}
                profit={calculations.profit}
              />

              <SummarySection
                jobRevenue={calculations.totalServicesRevenue}
                fuelCost={fuelCost}
                vehicleCosts={vehicleCosts}
                equipmentCosts={equipmentCosts}
                materialsCosts={materialsCosts}
                overheadCosts={calculations.overheadCosts}
                totalLaborCost={calculations.totalLaborCost}
                totalCost={calculations.totalCost}
                profit={calculations.profit}
                laborCosts={calculations.laborCosts}
                hoursWorked={hoursWorked}
              />
            </div>
          )}

          {(jobRevenue > 0 || Object.values(hoursWorked).some(h => h > 0)) && !showResults && (
            <div className="mt-10 text-center">
              <button
                onClick={handleAnalyze}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                Analyze Job
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
