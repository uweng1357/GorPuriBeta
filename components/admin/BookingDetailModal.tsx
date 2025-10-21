'use client'

import { useState } from 'react'
import { X, Eye, Download, Check, X as XIcon } from 'lucide-react'
import PaymentValidation from './PaymentValidation'

interface BookingDetailModalProps {
  reservation: {
    id: number
    user_id: number
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
  isOpen: boolean
  onClose: () => void
  onPaymentStatusUpdate: (reservationId: number, status: string, notes?: string) => void
}

export default function BookingDetailModal({ 
  reservation, 
  isOpen, 
  onClose, 
  onPaymentStatusUpdate 
}: BookingDetailModalProps) {
  const [showPaymentProof, setShowPaymentProof] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset states when modal opens/closes
  const handleClose = () => {
    setShowPaymentProof(false)
    setImageLoading(false)
    setImageError(false)
    onClose()
  }

  const handleShowPaymentProof = () => {
    setImageError(false)
    setImageLoading(true)
    setShowPaymentProof(true)
    
    // Preload image untuk loading yang lebih cepat
    if (reservation.payment_proof) {
      const img = new Image()
      img.onload = () => {
        console.log('Payment proof preloaded successfully')
        setImageLoading(false)
      }
      img.onerror = () => {
        console.error('Payment proof preload failed')
        setImageLoading(false)
        setImageError(true)
      }
      img.src = reservation.payment_proof
    }
  }

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

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

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'PAID':
        return { color: 'bg-green-100 text-green-800', text: 'Lunas' }
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' }
      case 'REFUNDED':
        return { color: 'bg-red-100 text-red-800', text: 'Dikembalikan' }
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status }
    }
  }

  const statusInfo = getStatusInfo(reservation.status)
  const paymentStatusInfo = getPaymentStatusInfo(reservation.payment_status)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Detail Booking</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Booking Info */}
            <div className="space-y-6">
              {/* Field Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Informasi Lapangan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nama Lapangan:</span>
                    <span className="text-sm font-medium text-gray-900">{reservation.field_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lokasi:</span>
                    <span className="text-sm font-medium text-gray-900">{reservation.location}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Informasi Customer</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nama:</span>
                    <span className="text-sm font-medium text-gray-900">{reservation.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-900">{reservation.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Telepon:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {reservation.user.phone || 'Tidak ada'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Detail Reservasi</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tanggal:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(reservation.reservation_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Waktu:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Harga:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rp {reservation.total_price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status Pembayaran:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusInfo.color}`}>
                      {paymentStatusInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {reservation.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Catatan</h4>
                  <p className="text-sm text-gray-700">{reservation.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Payment Validation */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Validasi Pembayaran</h4>
                <PaymentValidation
                  reservation={reservation}
                  onStatusUpdate={onPaymentStatusUpdate}
                />
              </div>

              {/* Payment Proof */}
              {reservation.payment_proof && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Bukti Pembayaran</h4>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleShowPaymentProof}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Lihat Bukti</span>
                      </button>
                      <a
                        href={reservation.payment_proof}
                        download={`bukti-pembayaran-${reservation.id}.jpg`}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </a>
                    </div>
                    
                    {/* Payment Proof Preview */}
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Bukti Pembayaran Tersedia</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Klik "Lihat Bukti" untuk melihat gambar atau "Download" untuk menyimpan file
                      </p>
                    </div>

                    {reservation.payment_notes && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Catatan Pembayaran:</h5>
                        <p className="text-sm text-gray-600">{reservation.payment_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Payment Proof */}
              {!reservation.payment_proof && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-800">Belum Ada Bukti Pembayaran</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    Customer belum mengupload bukti pembayaran
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showPaymentProof && reservation.payment_proof && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bukti Pembayaran</h3>
                <p className="text-sm text-gray-500">Booking ID: #{reservation.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={reservation.payment_proof}
                  download={`bukti-pembayaran-${reservation.id}.jpg`}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => {
                    setShowPaymentProof(false)
                    setImageLoading(false)
                    setImageError(false)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              {imageLoading && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat gambar...</p>
                  </div>
                </div>
              )}
              
              {imageError && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Gagal memuat gambar</p>
                    <button
                      onClick={() => {
                        setImageError(false)
                        setImageLoading(true)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </div>
              )}
              
              {!imageLoading && !imageError && (
                <div className="relative">
                  <img
                    src={reservation.payment_proof}
                    alt="Bukti Pembayaran"
                    className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg shadow-lg"
                    loading="eager"
                    onLoad={() => {
                      setImageLoading(false)
                      console.log('Payment proof image loaded successfully')
                    }}
                    onError={(e) => {
                      console.error('Payment proof image failed to load:', e)
                      setImageLoading(false)
                      setImageError(true)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
