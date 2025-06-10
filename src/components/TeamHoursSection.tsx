import React from 'react';
import { Users, Clock } from 'lucide-react';

interface TeamHoursSectionProps {
  hoursWorked: Record<string, number>;
  wages: Record<string, number>;
  onHoursChange: (name: string, hours: number) => void;
}

export default function TeamHoursSection({
  hoursWorked,
  wages,
  onHoursChange
}: TeamHoursSectionProps) {
  const teamMembers = Object.keys(wages);

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Team Hours</h2>
        <Clock className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((name) => (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {name.charAt(0).toUpperCase() + name.slice(1)}
              <span className="text-xs text-gray-500 ml-1">
                (${wages[name]}/hr)
              </span>
            </label>
            <input
              type="number"
              value={hoursWorked[name] || ''}
              onChange={(e) => onHoursChange(name, parseFloat(e.target.value) || 0)}
              className="input-field text-sm"
              placeholder="0.00"
              min="0"
              step="0.25"
            />
          </div>
        ))}
      </div>
    </div>
  );
}