'use client'

import { Users, Calendar, DollarSign, MapPin, TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative'
  icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ title, value, change, changeType, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {changeType === 'positive' ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
    </div>
  )
}

interface DashboardOverviewProps {
  totalUsers: number
  bookingsToday: number
  totalRevenue: number
  activeFields: number
  usersChange: number
  bookingsChange: number
  revenueChange: number
  fieldsChange: number
}

export default function DashboardOverview({ 
  totalUsers, 
  bookingsToday, 
  totalRevenue, 
  activeFields,
  usersChange,
  bookingsChange,
  revenueChange,
  fieldsChange
}: DashboardOverviewProps) {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change}% dari bulan lalu`
  }

  const metrics = [
    {
      title: 'Total Pengguna',
      value: totalUsers,
      change: formatChange(usersChange),
      changeType: usersChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: Users
    },
    {
      title: 'Booking Hari Ini',
      value: bookingsToday,
      change: formatChange(bookingsChange),
      changeType: bookingsChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: Calendar
    },
    {
      title: 'Total Pendapatan',
      value: `Rp ${totalRevenue.toLocaleString()}`,
      change: formatChange(revenueChange),
      changeType: revenueChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign
    },
    {
      title: 'Lapangan Aktif',
      value: activeFields,
      change: formatChange(fieldsChange),
      changeType: fieldsChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: MapPin
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Ringkasan aktivitas dan performa hari ini</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  )
}
