'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Clock, Calendar, User, Phone, Mail } from 'lucide-react'

interface Field {
  id: number
  name: string
  description: string
  location: string
  price_per_hour: number
  image_url?: string
  facilities: string[]
}

interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: 'USER' | 'ADMIN'
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fieldId = searchParams.get('fieldId') || searchParams.get('field')
  
  const [field, setField] = useState<Field | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  })
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentNotes, setPaymentNotes] = useState('')

  // Load user data and fetch field data
  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          
          // Auto-fill form with user data
          setFormData(prev => ({
            ...prev,
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            phone: parsedUser.phone || ''
          }))
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    const fetchField = async () => {
      if (!fieldId) {
        router.push('/fields')
        return
      }

      try {
        const response = await fetch(`/api/fields?id=${fieldId}`)
        if (response.ok) {
          const data = await response.json()
          setField(data.field)
        } else {
          router.push('/fields')
        }
      } catch (error) {
        console.error('Error fetching field:', error)
        router.push('/fields')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
    fetchField()
  }, [fieldId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        return
      }
      setPaymentProof(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First create reservation
      const reservationResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          field_id: fieldId,
          reservation_date: formData.date,
          start_time: formData.startTime,
          end_time: formData.endTime,
          total_price: calculateTotal(),
          notes: formData.notes
        })
      })

      if (!reservationResponse.ok) {
        const errorData = await reservationResponse.json()
        alert(`Error: ${errorData.error || 'Terjadi kesalahan'}`)
        return
      }

      const reservationData = await reservationResponse.json()
      const reservationId = reservationData.reservation.id

      // Upload payment proof if provided
      if (paymentProof) {
        console.log('Uploading payment proof for reservation:', reservationId)
        const formData = new FormData()
        formData.append('file', paymentProof)
        formData.append('reservationId', reservationId.toString())
        formData.append('paymentNotes', paymentNotes)

        try {
          const uploadResponse = await fetch('/api/reservations/upload-payment', {
            method: 'POST',
            body: formData
          })

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json()
            console.log('Payment proof uploaded successfully:', uploadResult)
          } else {
            const errorData = await uploadResponse.json()
            console.error('Payment proof upload failed:', errorData)
            alert('Upload bukti pembayaran gagal: ' + (errorData.error || 'Unknown error'))
          }
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError)
          alert('Error saat upload bukti pembayaran: ' + uploadError.message)
        }
      } else {
        console.log('No payment proof provided')
      }

      alert('Reservasi berhasil! Bukti pembayaran telah dikirim untuk verifikasi.')
      router.push('/fields')
    } catch (error) {
      console.error('Error submitting reservation:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    if (isNaN(price) || price === null || price === undefined) {
      return 'Rp 0'
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateTotal = () => {
    if (!field || !formData.startTime || !formData.endTime) return 0
    
    const start = new Date(`2000-01-01T${formData.startTime}`)
    const end = new Date(`2000-01-01T${formData.endTime}`)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    
    return hours * field.price_per_hour
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lapangan Tidak Ditemukan</h1>
          <button
            onClick={() => router.push('/fields')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kembali ke Daftar Lapangan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Reservasi Lapangan
          </h1>
          <p className="text-lg text-gray-600">
            Isi form di bawah ini untuk melakukan reservasi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Field Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {field.image_url ? (
                <img
                  src={field.image_url}
                  alt={field.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">{field.name}</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{field.name}</h3>
              <p className="text-gray-600 mb-4">{field.description}</p>
              
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{field.location}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(field.price_per_hour)}
                </span>
                <span className="text-sm text-gray-500">/jam</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {field.facilities.slice(0, 3).map((facility, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {facility}
                  </span>
                ))}
                {field.facilities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{field.facilities.length - 3} lainnya
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Form Reservasi</h3>
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <User className="w-4 h-4" />
                    <span>Data dari akun: {user.name}</span>
                  </div>
                  {(formData.name !== user.name || formData.email !== user.email || formData.phone !== user.phone) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || ''
                        }))
                      }}
                      className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      Reset ke data akun
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                  {user && formData.name === user.name && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    user && formData.name === user.name 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                  {user && formData.email === user.email && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    user && formData.email === user.email 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                  {user && formData.phone === user.phone && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    user && formData.phone === user.phone 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Reservasi *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Mulai *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Selesai *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Catatan khusus untuk reservasi..."
                />
              </div>

              {/* Payment Proof Upload */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Bukti Pembayaran</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Bukti Pembayaran *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, GIF. Maksimal 5MB
                    </p>
                    {paymentProof && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">
                          ✓ File dipilih: {paymentProof.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Pembayaran (Opsional)
                    </label>
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Informasi Rekening:</p>
                      <p className="text-sm text-blue-700">
                        <strong>Bank:</strong> BCA<br/>
                        <strong>No. Rekening:</strong>3450763755 <br/>
                        <strong>Atas Nama:</strong> Rafael Nugroho
                      </p>
                    </div>
                    {/* <textarea
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Contoh: Transfer ke BCA 1234567890, atas nama SportReservation Admin"
                    /> */}
                  </div>
                </div>
              </div>

              {/* Total Price */}
              {formData.startTime && formData.endTime && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Harga:</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/fields')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Memproses...' : 'Reservasi Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
