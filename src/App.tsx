import React, { useState, useMemo, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DEFAULT_WAGES = {
  chino: 25, cosme: 25, chief: 25, daniel: 25,
  brendon: 13, chengetai: 13, matarutse: 13,
  rey: 20, intern: 13, sam: 15
};

const DEFAULT_BUDGET_ITEMS = {
  marketing: [
    { id: 1, name: 'Flyers', cost: 500, efficiency: 65 },
    { id: 2, name: 'Social Media', cost: 1200, efficiency: 80 }
  ],
  operations: [
    { id: 1, name: 'Vehicle Maintenance', cost: 1500, efficiency: 45 },
    { id: 2, name: 'Equipment', cost: 800, efficiency: 70 }
  ],
  materials: [
    { id: 1, name: 'Construction', cost: 3500, efficiency: 60 },
    { id: 2, name: 'Safety Gear', cost: 600, efficiency: 85 }
  ],
  labor: [
    { id: 1, name: 'Overtime', cost: 2000, efficiency: 50 },
    { id: 2, name: 'Training', cost: 1200, efficiency: 75 }
  ]
};
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [jobRevenue, setJobRevenue] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);
  const [vehicleCosts, setVehicleCosts] = useState(0);
  const [equipmentCosts, setEquipmentCosts] = useState(0);
  const [materialsCosts, setMaterialsCosts] = useState(0);
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [employees, setEmployees] = useState(DEFAULT_WAGES);
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', rate: 0 });

  const [activeTab, setActiveTab] = useState<'job' | 'team' | 'results' | 'budget'>('job');
  const [budgetItems, setBudgetItems] = useState(DEFAULT_BUDGET_ITEMS);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [activeDept, setActiveDept] = useState<keyof typeof DEFAULT_BUDGET_ITEMS>('marketing');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

