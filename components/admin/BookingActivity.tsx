'use client'

import { BarChart3 } from 'lucide-react'

interface BookingActivityProps {
  data: {
    day: string
    date: string
    value: number
  }[]
}

export default function BookingActivity({ data }: BookingActivityProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const maxDisplayValue = Math.ceil(maxValue)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Aktivitas Booking</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-64 flex items-end space-x-1">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full flex flex-col items-center space-y-2">
                  {/* Bar chart */}
                  <div className="w-full relative">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${
                        item.value > 0 
                          ? 'bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500' 
                          : 'bg-gray-100'
                      }`}
                      style={{ 
                        height: `${height}%`, 
                        minHeight: item.value > 0 ? '8px' : '2px' 
                      }}
                    ></div>
                    
                    {/* Value tooltip on hover */}
                    {item.value > 0 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {item.value} booking{item.value > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Day labels */}
                  <div className="text-xs text-gray-500 text-center">
                    <div className="font-medium text-gray-700">{item.day}</div>
                    <div className="text-gray-400">{item.date}</div>
                    {item.value > 0 && (
                      <div className="text-green-600 font-medium mt-1">{item.value}</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>0</span>
          {maxDisplayValue > 0 && (
            <>
              <span>{Math.ceil(maxDisplayValue * 0.25)}</span>
              <span>{Math.ceil(maxDisplayValue * 0.5)}</span>
              <span>{Math.ceil(maxDisplayValue * 0.75)}</span>
              <span>{maxDisplayValue}</span>
            </>
          )}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total 7 hari terakhir:</span>
            <span className="font-semibold text-gray-900">
              {data.reduce((sum, item) => sum + item.value, 0)} booking
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
