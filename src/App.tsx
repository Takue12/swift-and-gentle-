import React, { useState, useEffect, useMemo } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
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
  const [showResults, setShowResults] = useState(false);

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

  const totalLaborCost = useMemo(() => {
    return Object.entries(hoursWorked).reduce((sum, [name, hours]) => {
      const wage = employees[name];
      return sum + (wage * hours || 0);
    }, 0);
  }, [hoursWorked, employees]);

  const totalDirectCosts = totalLaborCost + fuelCost + vehicleCosts + equipmentCosts + materialsCosts;
  const overheadCosts = (totalDirectCosts * overheadPercentage) / 100;
  const totalCost = totalDirectCosts + overheadCosts;
  const profit = jobRevenue - totalCost;
  const profitMargin = jobRevenue > 0 ? (profit / jobRevenue) * 100 : 0;
  const breakEvenRevenue = totalCost;
  const totalHours = Object.values(hoursWorked).reduce((sum, h) => sum + h, 0);
  const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;
  const revenuePerHour = totalHours > 0 ? jobRevenue / totalHours : 0;

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
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

        {Object.keys(hoursWorked).length > 0 && (
          <>
            <div className="mt-10">
              <ProfitAnalysis
                jobRevenue={jobRevenue}
                totalCosts={totalCost}
                profit={profit}
                profitMargin={profitMargin}
                breakEvenRevenue={breakEvenRevenue}
                costPerHour={costPerHour}
                totalHours={totalHours}
                revenuePerHour={revenuePerHour}
              />
            </div>

            <div className="mt-10">
              <CostChart
                laborCosts={Object.entries(hoursWorked).reduce((acc, [name, hours]) => {
                  acc[name] = hours * employees[name];
                  return acc;
                }, {} as Record<string, number>)}
                fuelCost={fuelCost}
                vehicleCosts={vehicleCosts}
                equipmentCosts={equipmentCosts}
                materialsCosts={materialsCosts}
                overheadCosts={overheadCosts}
                profit={profit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
