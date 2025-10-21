'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'
import DashboardOverview from '@/components/admin/DashboardOverview'
import LatestBookings from '@/components/admin/LatestBookings'
import BookingActivity from '@/components/admin/BookingActivity'

interface User {
  id: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  phone?: string
  createdAt: string
}

interface Field {
  id: number
  name: string
  description: string
  location: string
  price_per_hour: number
  image_url?: string
  facilities: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Reservation {
  id: number
  user_id: number
  field_id: number
  field_name: string
  location: string
  reservation_date: string
  start_time: string
  end_time: string
  total_price: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED'
  payment_proof?: string
  payment_notes?: string
  notes?: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
    phone?: string
  }
  field?: {
    name: string
    price_per_hour: number
  }
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [fields, setFields] = useState<Field[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [fieldsRes, reservationsRes] = await Promise.all([
        fetch('/api/fields'),
        fetch('/api/admin/reservations')
      ])

      if (fieldsRes.ok) {
        const fieldsData = await fieldsRes.json()
        setFields(fieldsData.fields || [])
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json()
        setReservations(reservationsData.reservations || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Calculate metrics
  const totalUsers = reservations.length > 0 ? new Set(reservations.map(r => r.user_id)).size : 0
  const totalRevenue = reservations.reduce((sum, res) => sum + res.total_price, 0)
  const todayReservations = reservations.filter(res => {
    const resDate = new Date(res.reservation_date).toDateString()
    const today = new Date().toDateString()
    return resDate === today
  })
  const activeFields = fields.filter(f => f.isActive).length

  // Calculate percentage changes (mock data for now)
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  // Mock previous month data (in real app, this would come from API)
  const previousMonthUsers = Math.max(1, Math.floor(totalUsers * 0.9))
  const previousMonthBookings = Math.max(1, Math.floor(todayReservations.length * 0.9))
  const previousMonthRevenue = Math.max(1, Math.floor(totalRevenue * 0.85))
  const previousMonthFields = Math.max(1, Math.floor(activeFields * 1.02))

  const usersChange = calculatePercentageChange(totalUsers, previousMonthUsers)
  const bookingsChange = calculatePercentageChange(todayReservations.length, previousMonthBookings)
  const revenueChange = calculatePercentageChange(totalRevenue, previousMonthRevenue)
  const fieldsChange = calculatePercentageChange(activeFields, previousMonthFields)

  // Handle payment status update
  const handlePaymentStatusUpdate = async (reservationId: number, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: status,
          adminNotes: notes
        })
      })

      if (response.ok) {
        // Refresh data after payment status update
        fetchData()
        alert('Status pembayaran berhasil diperbarui')
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Gagal memperbarui status pembayaran'}`)
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Terjadi kesalahan saat memperbarui status pembayaran')
    }
  }

  // Prepare latest bookings data
  const latestBookings = reservations.slice(0, 5).map(res => ({
    id: res.id,
    user_id: res.user_id,
    field_name: res.field_name,
    location: res.location,
    reservation_date: res.reservation_date,
    start_time: res.start_time,
    end_time: res.end_time,
    total_price: res.total_price,
    status: res.status,
    payment_status: res.payment_status,
    payment_proof: res.payment_proof,
    payment_notes: res.payment_notes,
    notes: res.notes,
    created_at: res.created_at,
    updated_at: res.updated_at,
    user: res.user ? {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      phone: res.user.phone || ''
    } : { id: 0, name: 'Unknown User', email: '', phone: '' }
  }))

  // Prepare booking activity data (last 7 days)
  const generateBookingActivityData = () => {
    const today = new Date()
    const last7Days = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      const dayName = dayNames[date.getDay()]
      const dateStr = date.getDate().toString().padStart(2, '0')
      
      // Count reservations for this date
      const reservationsOnDate = reservations.filter(res => {
        const resDate = new Date(res.reservation_date).toDateString()
        return resDate === date.toDateString()
      }).length
      
      last7Days.push({
        day: dayName,
        date: dateStr,
        value: reservationsOnDate
      })
    }
    
    return last7Days
  }

  const bookingActivityData = generateBookingActivityData()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:ml-64">
        <AdminHeader 
          title="Dashboard Admin" 
          onMenuClick={() => {
            console.log('Hamburger clicked, opening sidebar')
            setSidebarOpen(true)
          }}
        />
        <div className="p-4 lg:p-6">
          <DashboardOverview
            totalUsers={totalUsers}
            bookingsToday={todayReservations.length}
            totalRevenue={totalRevenue}
            activeFields={activeFields}
            usersChange={usersChange}
            bookingsChange={bookingsChange}
            revenueChange={revenueChange}
            fieldsChange={fieldsChange}
          />
          
          <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <LatestBookings 
              bookings={latestBookings}
            />
            <BookingActivity data={bookingActivityData} />
          </div>
        </div>
      </div>
    </div>
  )
}