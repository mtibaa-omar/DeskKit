import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  loading = false,
}) {
  const iconBgClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
    indigo: "bg-indigo-100 text-indigo-600",
    pink: "bg-pink-100 text-pink-600",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-10 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
            {trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
