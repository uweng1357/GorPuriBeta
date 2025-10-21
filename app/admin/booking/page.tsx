'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'
import { Eye, Search, Bell, User, CreditCard, Download, X } from 'lucide-react'
import BookingDetailModal from '@/components/admin/BookingDetailModal'

interface User {
  id: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  phone?: string
  createdAt: string
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
  user: {
    id: number
    name: string
    email: string
    phone?: string
  }
  field: {
    id: number
    name: string
    location: string
  }
}

export default function BookingManagement() {
  const [user, setUser] = useState<User | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    console.log('Booking page auth check:', { token: !!token, userData: !!userData })
    
    if (!token || !userData) {
      console.log('No token or user data, redirecting to login')
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      console.log('Parsed user:', parsedUser)
      
      if (parsedUser.role !== 'ADMIN') {
        console.log('User is not admin, redirecting to home')
        router.push('/')
        return
      }

      setUser(parsedUser)
      fetchReservations()
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router])

  // Fetch reservations data
  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations')
      if (response.ok) {
        const data = await response.json()
        setReservations(data.reservations)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setIsLoading(false)
    }
  }


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
        fetchReservations()
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

  // Handle detail modal
  const handleShowDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDetailModal(true)
  }

  const handleCloseDetail = () => {
    setShowDetailModal(false)
    setSelectedReservation(null)
  }

  // Handle payment proof modal
  const handleShowPaymentProof = (paymentProof: string) => {
    setSelectedPaymentProof(paymentProof)
    setShowPaymentModal(true)
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedPaymentProof(null)
  }

  // Calculate statistics
  const totalBookings = reservations.length
  const pendingBookings = reservations.filter(r => r.status === 'PENDING').length
  const confirmedBookings = reservations.filter(r => r.status === 'CONFIRMED').length
  const cancelledBookings = reservations.filter(r => r.status === 'CANCELLED').length

  // Filter reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.user.phone?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'ALL' || reservation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Format time
  const formatTime = (timeString: string) => {
    return timeString
  }

  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { color: 'bg-green-100 text-green-800', text: 'Dikonfirmasi' }
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' }
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', text: 'Ditolak' }
      case 'COMPLETED':
        return { color: 'bg-blue-100 text-blue-800', text: 'Selesai' }
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status }
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:ml-64">
        <AdminHeader 
          title="Manajemen Booking" 
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="p-6">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari booking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Menunggu</option>
              <option value="CONFIRMED">Dikonfirmasi</option>
              <option value="CANCELLED">Ditolak</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Booking</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Menunggu Konfirmasi</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dikonfirmasi</p>
                  <p className="text-2xl font-semibold text-gray-900">{confirmedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ditolak</p>
                  <p className="text-2xl font-semibold text-gray-900">{cancelledBookings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Daftar Booking</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lapangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bukti Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        Tidak ada data booking
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((reservation) => {
                      const statusInfo = getStatusInfo(reservation.status)
                      return (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.field_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.location}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.user.phone || 'No phone'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(reservation.reservation_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Rp {reservation.total_price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.payment_proof ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleShowPaymentProof(reservation.payment_proof!)}
                                  className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Lihat</span>
                                </button>
                                <a
                                  href={reservation.payment_proof}
                                  download={`bukti-pembayaran-${reservation.id}.jpg`}
                                  className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Belum ada</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleShowDetail(reservation)}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                                reservation.status === 'CONFIRMED' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Detail
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReservation && (
        <BookingDetailModal
          reservation={selectedReservation}
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
        />
      )}

      {/* Payment Proof Modal */}
      {showPaymentModal && selectedPaymentProof && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bukti Pembayaran</h3>
                <p className="text-sm text-gray-500">Klik download untuk menyimpan file</p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={selectedPaymentProof}
                  download={`bukti-pembayaran-${Date.now()}.jpg`}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={handleClosePaymentModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="relative">
                <img
                  src={selectedPaymentProof}
                  alt="Bukti Pembayaran"
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
