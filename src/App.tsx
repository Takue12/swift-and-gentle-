import React, { useState, useEffect } from 'react';
import Login from './login';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';

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
            onHoursChange={handleHo


