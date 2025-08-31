import React from "react";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBg?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}: StatCardProps) => {
  return (
    <div className="apple-card p-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-apple-green" : "text-apple-red"
                } font-medium`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs último mes</span>
            </div>
          )}
        </div>
        
        <div className={`p-2.5 rounded-full ${iconBg} transition-transform duration-300 hover:scale-110`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
