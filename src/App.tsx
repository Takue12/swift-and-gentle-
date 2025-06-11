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
  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results'>('job');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({ ...prev, [name]: hours }));
  };

  const calculations = useMemo(() => {
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

  const handleAnalyze = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const hasData = jobRevenue > 0 || Object.values(hoursWorked).some(hours => hours > 0) || fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0;

  return (
    
    <div className="min-h-screen flex bg-gradient-to-tr from-green-100 via-white to-green-100">
      <div className="w-64 bg-white shadow-lg border-green-300 p-6 space-y-6 rounded-3xl m-4">
        <h2 className="text-xl font-bold text-green-700 mb-4">Dashboard</h2>
        
        <p className="text-sm text-green-600">Customer: <strong>{customerName || 'N/A'}</strong></p>
        <button className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'job' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} onClick={() => setActiveTab('job')}>Job Info</button>
        <button className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'team' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} onClick={() => setActiveTab('team')}>Team Hours</button>
        {showResults && <button className={`w-full text-left px-4 py-2 rounded-full border ${activeTab === 'results' ? 'bg-green-200 border-green-500 font-semibold' : 'border-transparent hover:bg-green-100 transition-all duration-200'}`} onClick={() => setActiveTab('results')}>Results</button>}
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-6 drop-shadow">Swift & Gentle Job Cost Analyzer</h1>
        <div className="mb-6">
          <label className="block mb-2 text-green-800 font-medium">Customer Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

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
                totalCosts={calculations.totalCost}
                profit={calculations.profit}
                profitMargin={calculations.profitMargin}
                breakEvenRevenue={calculations.breakEvenRevenue}
                costPerHour={calculations.costPerHour}
                totalHours={calculations.totalHours}
                revenuePerHour={calculations.revenuePerHour}
              />
            </div>
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <CostChart
                laborCosts={calculations.laborCosts}
                fuelCost={fuelCost}
                vehicleCosts={vehicleCosts}
                equipmentCosts={equipmentCosts}
                materialsCosts={materialsCosts}
                overheadCosts={calculations.overheadCosts}
                profit={calculations.profit}
              />
            </div>
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-8">
              <SummarySection
                jobRevenue={jobRevenue}
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
          </div>
        )}

        {hasData && activeTab !== 'results' && (
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

