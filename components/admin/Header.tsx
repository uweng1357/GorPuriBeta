'use client'

import { useState } from 'react'
import { Search, Bell, User, Menu } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  onMenuClick?: () => void
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Mobile menu button and Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            console.log('Hamburger button clicked')
            onMenuClick?.()
          }}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right Side - Search, Notifications, Profile */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-48 lg:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
