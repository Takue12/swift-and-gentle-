import React, { useState, useEffect, useMemo } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import CostChart from './components/CostChart';
import SummarySection from './components/SummarySection';

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

    return {
      laborCosts,
      totalLaborCost,
      overheadCosts,
      totalCost,
      profit
    };
  }, [hoursWorked, fuelCost, vehicleCosts, equipmentCosts, materialsCosts, overheadPercentage, jobRevenue, employees]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const hasData = jobRevenue > 0 || Object.values(hoursWorked).some(h => h > 0) || fuelCost > 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Swift & Gentle Job Cost Analyzer</h1>

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
          <div className="mt-12">
            <CostChart
              laborCosts={calculations.laborCosts}
              fuelCost={fuelCost}
              vehicleCosts={vehicleCosts}
              equipmentCosts={equipmentCosts}
              materialsCosts={materialsCosts}
              overheadCosts={calculations.overheadCosts}
              profit={calculations.profit}
            />

            <div className="mt-8">
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
      </div>
    </div>
  );
}

export default App;

