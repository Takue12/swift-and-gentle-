import React, { useState, useMemo } from 'react';
import { Truck, BarChart3 } from 'lucide-react';
import JobInfoSection from './components/JobInfoSection';
import TeamHoursSection from './components/TeamHoursSection';
import EmployeeManagement from './components/EmployeeManagement';
import CostChart from './components/CostChart';
import SummarySection from './components/SummarySection';
import ProfitAnalysis from './components/ProfitAnalysis';
import Login from './login';
import { useEffect } from 'react';

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

useEffect(() => {
  const auth = localStorage.getItem('auth');
  if (auth === 'true') setIsLoggedIn(true);
}, []);

if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}
  const [jobRevenue, setJobRevenue] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [vehicleCosts, setVehicleCosts] = useState<number>(0);
  const [equipmentCosts, setEquipmentCosts] = useState<number>(0);
  const [materialsCosts, setMaterialsCosts] = useState<number>(0);
  const [overheadPercentage, setOverheadPercentage] = useState<number>(15);
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Record<string, number>>(DEFAULT_WAGES);
  const [activeTab, setActiveTab] = useState<'analysis' | 'employees'>('analysis');

  const handleHoursChange = (name: string, hours: number) => {
    setHoursWorked(prev => ({
      ...prev,
      [name]: hours
    }));
  };

  const handleEmployeesChange = (newEmployees: Record<string, number>) => {
    setEmployees(newEmployees);
    // Clear hours for employees that no longer exist
    setHoursWorked(prev => {
      const updatedHours: Record<string, number> = {};
      Object.keys(newEmployees).forEach(name => {
        if (prev[name]) {
          updatedHours[name] = prev[name];
        }
      });
      return updatedHours;
    });
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
  
  console.log("Rendering dashboard with:", {
  employees,
  hoursWorked,
  jobRevenue,
  fuelCost,
  calculations,
});



  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Swift & Gentle
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">Advanced Job Cost Analyzer</p>
          <p className="text-gray-500 mt-2">Comprehensive profit analysis with detailed business metrics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-2 rounded-2xl">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'analysis'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                Job Analysis
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'employees'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                Manage Employees
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'analysis' ? (
          <div className="space-y-8">
            {/* Job Information */}
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

            {/* Team Hours */}
            <TeamHoursSection
              hoursWorked={hoursWorked}
              wages={employees}
              onHoursChange={handleHoursChange}
            />

            {/* Analyze Button */}
            {hasData && (
              <div className="text-center">
                <button
                  onClick={handleAnalyze}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <BarChart3 className="h-5 w-5" />
                  Analyze Job Cost & Profitability
                </button>
              </div>
            )}

            {/* Results */}
            {showResults && hasData && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
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

            {/* Empty State */}
            {!hasData && (
              <div className="glass-card p-12 rounded-2xl text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <BarChart3 className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Ready to Analyze Your Job
                  </h3>
                  <p className="text-gray-600">
                    Enter your job revenue, costs, and team hours to get comprehensive profit analysis and business insights.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Employee Management */}
            <EmployeeManagement
              employees={employees}
              onEmployeesChange={handleEmployeesChange}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Built for Swift & Gentle Moving Company • Advanced Job Cost & Profit Analysis
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
