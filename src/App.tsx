import React, { useState, useMemo, useEffect } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import SummarySection from './components/SummarySection';
import ProfitAnalysis from './components/ProfitAnalysis';
import CostChart from './components/CostChart';
import RevenueChart from './components/RevenueChart';

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

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({
      ...prev,
      [name]: hours
    }));
  };

  const handleServiceChange = (service: string, value: number) => {
    setAdditionalServices(prev => ({
      ...prev,
      [service]: value
    }));
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
  };

  const hasData = Object.values(hoursWorked).some(hours => hours > 0) ||
    fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0 ||
    Object.values(additionalServices).some(service => service > 0);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Swift & Gentle Job Cost Analyzer</h1>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Customer Name</label>
          <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter customer name" />
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

        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium">Additional Services (Packing, Storage, etc.)</label>
          {['Packing', 'Storage', 'Junk Removal'].map(service => (
            <div key={service} className="mb-2">
              <label className="block text-sm">{service}</label>
              <input
                type="number"
                min="0"
                value={additionalServices[service] || 0}
                onChange={e => handleServiceChange(service, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1 border rounded-lg"
                placeholder={`Revenue from ${service}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <TeamHoursSection
            hoursWorked={hoursWorked}
            wages={employees}
            onHoursChange={handleHoursChange}
          />
        </div>

        {hasData && (
          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyze}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Analyze Job
            </button>
          </div>
        )}

        {showResults && hasData && (
          <div className="mt-12 space-y-8">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Customer: {customerName || 'N/A'}</h2>
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

            <RevenueChart additionalServices={additionalServices} />

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
      </div>
    </div>
  );
}

export default App;

