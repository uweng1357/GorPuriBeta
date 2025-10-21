'use client'

import { useState } from 'react'
import { Check, X, Eye, Download } from 'lucide-react'

interface PaymentValidationProps {
  reservation: {
    id: number
    payment_status: string
    payment_proof?: string
    payment_notes?: string
    total_price: number
  }
  onStatusUpdate: (reservationId: number, status: string, notes?: string) => void
}

export default function PaymentValidation({ reservation, onStatusUpdate }: PaymentValidationProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleStatusUpdate = async (status: string) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(reservation.id, status, adminNotes)
      setAdminNotes('')
    } catch (error) {
      console.error('Error updating payment status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REFUNDED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID': return 'Lunas'
      case 'PENDING': return 'Menunggu'
      case 'REFUNDED': return 'Dikembalikan'
      default: return status
    }
  }

  return (
    <div className="space-y-4">
      {/* Payment Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status Pembayaran:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.payment_status)}`}>
            {getStatusText(reservation.payment_status)}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Rp {reservation.total_price.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Payment Proof */}
      {reservation.payment_proof && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Bukti Pembayaran:</span>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat</span>
            </button>
            <a
              href={reservation.payment_proof}
              download
              className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>
      )}

      {/* Payment Notes */}
      {reservation.payment_notes && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Catatan Pembayaran:</span>
          <p className="text-sm text-gray-600 mt-1">{reservation.payment_notes}</p>
        </div>
      )}

      {/* Admin Actions */}
      {reservation.payment_status === 'PENDING' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan Admin (Opsional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tambahkan catatan untuk verifikasi pembayaran..."
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusUpdate('PAID')}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Verifikasi Lunas</span>
            </button>
            
            <button
              onClick={() => handleStatusUpdate('REFUNDED')}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <X className="w-4 h-4" />
              <span>Tolak/Kembalikan</span>
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Bukti Pembayaran</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={reservation.payment_proof}
                alt="Bukti Pembayaran"
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
