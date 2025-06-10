import React from 'react';
import { DollarSign, Fuel, Truck, Wrench, FileText, Calculator } from 'lucide-react';

interface JobInfoSectionProps {
  jobRevenue: number;
  fuelCost: number;
  vehicleCosts: number;
  equipmentCosts: number;
  materialsCosts: number;
  overheadPercentage: number;
  onJobRevenueChange: (value: number) => void;
  onFuelCostChange: (value: number) => void;
  onVehicleCostsChange: (value: number) => void;
  onEquipmentCostsChange: (value: number) => void;
  onMaterialsCostsChange: (value: number) => void;
  onOverheadPercentageChange: (value: number) => void;
}

export default function JobInfoSection({
  jobRevenue,
  fuelCost,
  vehicleCosts,
  equipmentCosts,
  materialsCosts,
  overheadPercentage,
  onJobRevenueChange,
  onFuelCostChange,
  onVehicleCostsChange,
  onEquipmentCostsChange,
  onMaterialsCostsChange,
  onOverheadPercentageChange
}: JobInfoSectionProps) {
  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Job Information & Costs</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💰 Job Revenue ($)
          </label>
          <input
            type="number"
            value={jobRevenue || ''}
            onChange={(e) => onJobRevenueChange(parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Fuel className="inline h-4 w-4 mr-1" />
            Fuel Cost ($)
          </label>
          <input
            type="number"
            value={fuelCost || ''}
            onChange={(e) => onFuelCostChange(parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Truck className="inline h-4 w-4 mr-1" />
            Vehicle Costs ($)
          </label>
          <input
            type="number"
            value={vehicleCosts || ''}
            onChange={(e) => onVehicleCostsChange(parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">Maintenance, insurance, depreciation</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Wrench className="inline h-4 w-4 mr-1" />
            Equipment Costs ($)
          </label>
          <input
            type="number"
            value={equipmentCosts || ''}
            onChange={(e) => onEquipmentCostsChange(parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">Tools, dollies, straps, blankets</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Materials Cost ($)
          </label>
          <input
            type="number"
            value={materialsCosts || ''}
            onChange={(e) => onMaterialsCostsChange(parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">Boxes, tape, bubble wrap, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calculator className="inline h-4 w-4 mr-1" />
            Overhead (%)
          </label>
          <input
            type="number"
            value={overheadPercentage || ''}
            onChange={(e) => onOverheadPercentageChange(parseFloat(e.target.value) || 0)}
            className="input-field"
            placeholder="15"
            min="0"
            max="100"
            step="0.1"
          />
          <p className="text-xs text-gray-500 mt-1">Office, insurance, admin costs</p>
        </div>
      </div>
    </div>
  );
}