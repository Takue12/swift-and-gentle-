import React, { useState, useMemo, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Enhanced job types and default data
type JobType = 'residential' | 'commercial' | 'government' | 'emergency';
type JobPriority = 'low' | 'medium' | 'high' | 'rush';

const JOB_TYPE_MULTIPLIERS = {
  residential: 1.0,
  commercial: 1.15,
  government: 1.25,
  emergency: 1.5
};

const PRIORITY_MULTIPLIERS = {
  low: 1.0,
  medium: 1.1,
  high: 1.25,
  rush: 1.5
};

const DEFAULT_WAGES = {
  // ... existing wages ...
};

function App() {
  // Job Details State
  const [jobDetails, setJobDetails] = useState({
    name: '',
    type: 'residential' as JobType,
    priority: 'medium' as JobPriority,
    location: '',
    estimatedHours: 40,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Cost State
  const [costs, setCosts] = useState({
    labor: 0,
    fuel: 1000,
    vehicles: 2000,
    equipment: 1800,
    materials: 2200,
    subcontractors: 0,
    permits: 0,
    disposal: 0,
    overheadPercentage: 15
  });

  // Historical Data
  const [historicalData, setHistoricalData] = useState<Array<{
    date: string;
    totalCost: number;
    profit: number;
  }>>([]);

  // Generate mock historical data
  useEffect(() => {
    const mockData = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      totalCost: Math.floor(15000 + Math.random() * 10000),
      profit: Math.floor(5000 + Math.random() * 8000)
    }));
    setHistoricalData(mockData);
  }, []);

  // Calculations
  const calculations = useMemo(() => {
    const laborCost = Object.entries(hoursWorked).reduce((sum, [name, hours]) => {
      return sum + (hours * (employees[name] || 0));
    }, 0);

    const baseCost = laborCost + costs.fuel + costs.vehicles + costs.equipment + 
                    costs.materials + costs.subcontractors + costs.permits + costs.disposal;

    const overhead = baseCost * (costs.overheadPercentage / 100);
    const totalCost = baseCost + overhead;
    
    // Apply job type and priority multipliers
    const jobMultiplier = JOB_TYPE_MULTIPLIERS[jobDetails.type] * 
                         PRIORITY_MULTIPLIERS[jobDetails.priority];
    const adjustedCost = totalCost * jobMultiplier;

    const recommendedPrice = adjustedCost * 1.2; // 20% profit margin
    const breakEvenPoint = adjustedCost;
    const profitMargin = ((recommendedPrice - adjustedCost) / recommendedPrice) * 100;

    return {
      laborCost,
      baseCost,
      overhead,
      totalCost,
      adjustedCost,
      recommendedPrice,
      breakEvenPoint,
      profitMargin,
      jobMultiplier
    };
  }, [hoursWorked, employees, costs, jobDetails.type, jobDetails.priority]);

  // Enhanced jagged line graph data
  const costHistoryData = {
    labels: historicalData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Cost',
        data: historicalData.map(item => item.totalCost),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        tension: 0.1, // Creates jagged lines
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Profit',
        data: historicalData.map(item => item.profit),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.1, // Creates jagged lines
        borderDash: [5, 5],
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  // Job efficiency graph (jagged line)
  const efficiencyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Labor Efficiency %',
        data: [65, 72, 68, 80],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4
      },
      {
        label: 'Equipment Utilization %',
        data: [75, 82, 78, 85],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        borderDash: [5, 5],
        pointRadius: 4
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Cost Analyzer</h1>
        
        {/* Job Details Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Name</label>
              <input
                type="text"
                value={jobDetails.name}
                onChange={(e) => setJobDetails({...jobDetails, name: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={jobDetails.type}
                onChange={(e) => setJobDetails({...jobDetails, type: e.target.value as JobType})}
                className="w-full p-2 border rounded-md"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="government">Government</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={jobDetails.priority}
                onChange={(e) => setJobDetails({...jobDetails, priority: e.target.value as JobPriority})}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="rush">Rush</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={jobDetails.location}
                onChange={(e) => setJobDetails({...jobDetails, location: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
              <input
                type="number"
                value={jobDetails.estimatedHours}
                onChange={(e) => setJobDetails({...jobDetails, estimatedHours: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={jobDetails.startDate}
                onChange={(e) => setJobDetails({...jobDetails, startDate: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={jobDetails.description}
              onChange={(e) => setJobDetails({...jobDetails, description: e.target.value})}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>

        {/* Cost Input Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labor Costs</label>
              <input
                type="number"
                value={costs.labor}
                onChange={(e) => setCosts({...costs, labor: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Costs</label>
              <input
                type="number"
                value={costs.fuel}
                onChange={(e) => setCosts({...costs, fuel: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Costs</label>
              <input
                type="number"
                value={costs.vehicles}
                onChange={(e) => setCosts({...costs, vehicles: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Costs</label>
              <input
                type="number"
                value={costs.equipment}
                onChange={(e) => setCosts({...costs, equipment: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material Costs</label>
              <input
                type="number"
                value={costs.materials}
                onChange={(e) => setCosts({...costs, materials: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcontractors</label>
              <input
                type="number"
                value={costs.subcontractors}
                onChange={(e) => setCosts({...costs, subcontractors: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permits/Fees</label>
              <input
                type="number"
                value={costs.permits}
                onChange={(e) => setCosts({...costs, permits: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waste Disposal</label>
              <input
                type="number"
                value={costs.disposal}
                onChange={(e) => setCosts({...costs, disposal: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Overhead Percentage</label>
              <input
                type="number"
                value={costs.overheadPercentage}
                onChange={(e) => setCosts({...costs, overheadPercentage: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                min="0"
                max="50"
              />
              <span className="text-xs text-gray-500">Typical range: 10-20%</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cost Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Direct Costs:</span>
                  <span>${calculations.baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overhead ({costs.overheadPercentage}%):</span>
                  <span>${calculations.overhead.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Base Total Cost:</span>
                  <span>${calculations.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Job Type/Priority Multiplier:</span>
                  <span>{calculations.jobMultiplier.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Adjusted Total Cost:</span>
                  <span>${calculations.adjustedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Pricing & Profit</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Break-even Price:</span>
                  <span>${calculations.breakEvenPoint.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recommended Price (20% margin):</span>
                  <span className="font-bold text-green-600">
                    ${calculations.recommendedPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Profit Margin:</span>
                  <span className={`font-bold ${
                    calculations.profitMargin > 20 ? 'text-green-600' :
                    calculations.profitMargin > 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {calculations.profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cost History (Last 12 Jobs)</h2>
            <div className="h-80">
              <Line 
                data={costHistoryData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => `$${value}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Job Efficiency Metrics</h2>
            <div className="h-80">
              <Line 
                data={efficiencyData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 50,
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Additional Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Cost Per Hour</h3>
              <p className="text-2xl font-bold">
                ${(calculations.adjustedCost / jobDetails.estimatedHours).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Based on {jobDetails.estimatedHours} estimated hours</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">Risk Assessment</h3>
              <p className="text-2xl font-bold">
                {jobDetails.priority === 'rush' ? 'High' : 
                 jobDetails.priority === 'high' ? 'Medium-High' :
                 jobDetails.type === 'emergency' ? 'Medium' : 'Low'}
              </p>
              <p className="text-sm text-gray-600">
                Based on {jobDetails.type} job with {jobDetails.priority} priority
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800">Historical Comparison</h3>
              <p className="text-2xl font-bold">
                {calculations.adjustedCost > historicalData[0]?.totalCost * 1.2 ? 'Above Avg' :
                 calculations.adjustedCost < historicalData[0]?.totalCost * 0.8 ? 'Below Avg' : 'Average'}
              </p>
              <p className="text-sm text-gray-600">Compared to similar jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
