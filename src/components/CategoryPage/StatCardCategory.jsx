// components/CategoryPage/StatCardCategory.jsx
import React from "react";

/**
 * Props:
 * - label: string, name of the stat
 * - value: number, the stat value
 * - icon: React component from lucide-react
 * - color: string, hsl or hex color
 */
const StatCardCategory = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-secondary  shadow rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition duration-300 hover:border-[1px] hover:border-purple-500">
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${color}20`, border: `1px solid ${color}33` }}
      >
        <Icon size={18} style={{ color }} />
      </div>

      {/* Value + Label */}
      <div>
        <p className="text-lg font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatCardCategory;