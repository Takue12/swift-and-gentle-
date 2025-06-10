import React, { useState } from 'react';
import { UserPlus, Users, Edit3, Trash2, Save, X } from 'lucide-react';

interface Employee {
  name: string;
  wage: number;
}

interface EmployeeManagementProps {
  employees: Record<string, number>;
  onEmployeesChange: (employees: Record<string, number>) => void;
}

export default function EmployeeManagement({ employees, onEmployeesChange }: EmployeeManagementProps) {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeWage, setNewEmployeeWage] = useState<number>(15);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [editWage, setEditWage] = useState<number>(0);

  const handleAddEmployee = () => {
    if (newEmployeeName.trim() && newEmployeeWage > 0) {
      const normalizedName = newEmployeeName.toLowerCase().trim();
      if (!employees[normalizedName]) {
        onEmployeesChange({
          ...employees,
          [normalizedName]: newEmployeeWage
        });
        setNewEmployeeName('');
        setNewEmployeeWage(15);
        setIsAddingEmployee(false);
      }
    }
  };

  const handleDeleteEmployee = (name: string) => {
    const updatedEmployees = { ...employees };
    delete updatedEmployees[name];
    onEmployeesChange(updatedEmployees);
  };

  const handleEditEmployee = (name: string) => {
    setEditingEmployee(name);
    setEditWage(employees[name]);
  };

  const handleSaveEdit = () => {
    if (editingEmployee && editWage > 0) {
      onEmployeesChange({
        ...employees,
        [editingEmployee]: editWage
      });
      setEditingEmployee(null);
      setEditWage(0);
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditWage(0);
  };

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
        </div>
        <button
          onClick={() => setIsAddingEmployee(true)}
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Add New Employee Form */}
      {isAddingEmployee && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Employee</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                className="input-field"
                placeholder="Enter employee name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmployee()}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Wage ($)
              </label>
              <input
                type="number"
                value={newEmployeeWage}
                onChange={(e) => setNewEmployeeWage(parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="15.00"
                min="0"
                step="0.25"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmployee()}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddEmployee}
              className="btn-primary inline-flex items-center gap-2 text-sm"
              disabled={!newEmployeeName.trim() || newEmployeeWage <= 0}
            >
              <Save className="h-4 w-4" />
              Add Employee
            </button>
            <button
              onClick={() => {
                setIsAddingEmployee(false);
                setNewEmployeeName('');
                setNewEmployeeWage(15);
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              <X className="h-4 w-4 inline mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Current Employees ({Object.keys(employees).length})
        </h3>
        
        {Object.keys(employees).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No employees added yet. Click "Add Employee" to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(employees).map(([name, wage]) => (
              <div key={name} className="flex items-center justify-between p-4 bg-white/60 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 capitalize">{name}</p>
                  {editingEmployee === name ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">$</span>
                      <input
                        type="number"
                        value={editWage}
                        onChange={(e) => setEditWage(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.25"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      />
                      <span className="text-sm text-gray-600">/hr</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">${wage.toFixed(2)}/hr</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingEmployee === name ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                        title="Save changes"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Cancel editing"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditEmployee(name)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Edit wage"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(name)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Remove employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}