import React from 'react'
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative'
  icon: LucideIcon
  iconColor?: string
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconColor = '#8B9D83',
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 min-w-0">
      <div className="flex items-start justify-between gap-3">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-2 sm:mb-4 truncate">{value}</p>

          {/* Change Indicator */}
          {change && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {changeType === 'positive' ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: iconColor }}
        >
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  )
}
