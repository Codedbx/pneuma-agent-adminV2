import React from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

const DashboardStatsCards = () => {
  const stats = [
    {
      title: "Total bookings",
      value: "721K",
      change: "+11.02%",
      positive: true,
      bgColor: "bg-blue-50"
    },
    {
      title: "Customers served", 
      value: "367K",
      change: "-0.03%",
      positive: false,
      bgColor: "bg-purple-50"
    },
    {
      title: "Upcoming trips",
      value: "1,156", 
      change: "+15.03%",
      positive: true,
      bgColor: "bg-cyan-50"
    },
    {
      title: "Active Users",
      value: "239K",
      change: "+6.08%", 
      positive: true,
      bgColor: "bg-gray-100"
    }
  ];

  return (
    <div className="bg-white">
      {/* Time Period Filter */}
      <div className="mb-6">
        <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <span>This Year</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
          >
            {/* Card Header */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {stat.title}
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <div className="flex items-center space-x-1">
                  <span 
                    className={`text-sm font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  {stat.positive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStatsCards;