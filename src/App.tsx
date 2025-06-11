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
  };

  const hasData = jobRevenue > 0 || Object.values(hoursWorked).some(hours => hours > 0) ||
    fuelCost > 0 || vehicleCosts > 0 || equipmentCosts > 0 || materialsCosts > 0;

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Swift & Gentle Job Cost Analyzer</h1>

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
        )}
      </div>
    </div>
  );
}

export default App;

