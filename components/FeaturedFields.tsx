'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Users, Star } from 'lucide-react'

interface Field {
  id: number
  name: string
  description: string
  location: string
  price_per_hour: number
  image_url: string
  facilities: string[]
}

export default function FeaturedFields() {
  const [fields, setFields] = useState<Field[]>([])

  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      const response = await fetch('/api/fields')
      const data = await response.json()
      
      if (response.ok) {
        // Ambil 3 lapangan pertama untuk featured
        setFields(data.fields?.slice(0, 3) || [])
      } else {
        console.error('Error fetching fields:', data.error)
      }
    } catch (error) {
      console.error('Error fetching fields:', error)
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

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lapangan Unggulan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilih dari berbagai lapangan olahraga berkualitas tinggi dengan fasilitas lengkap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fields.map((field) => (
            <div key={field.id} className="card group hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-xl overflow-hidden">
                {field.image_url ? (
                  <img
                    src={field.image_url}
                    alt={field.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">{field.name}</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{field.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{field.description}</p>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{field.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(field.price_per_hour)}
                    </span>
                    <span className="text-sm text-gray-500">/jam</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
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
                
                <Link
                  href={`/booking?field=${field.id}`}
                  className="w-full btn-primary text-center block group-hover:bg-primary-700 transition-colors"
                >
                  Reservasi Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
