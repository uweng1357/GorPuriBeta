import Link from 'next/link'
import { Calendar, Clock, MapPin, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Reservasi Lapangan Olahraga
              <span className="block text-primary-200">Terbaik di Ciledug</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Nikmati pengalaman bermain olahraga dengan fasilitas terbaik, 
              harga terjangkau, dan sistem reservasi yang mudah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center">
                Reservasi Sekarang
              </Link>
              <Link href="/fields" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-center">
                Lihat Lapangan
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-primary-200" />
              <h3 className="text-lg font-semibold mb-2">Reservasi Online</h3>
              <p className="text-sm text-primary-100">Booking kapan saja, di mana saja</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-primary-200" />
              <h3 className="text-lg font-semibold mb-2">24/7 Tersedia</h3>
              <p className="text-sm text-primary-100">Lapangan siap pakai setiap saat</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary-200" />
              <h3 className="text-lg font-semibold mb-2">Lokasi Strategis</h3>
              <p className="text-sm text-primary-100">Mudah dijangkau dari mana saja</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-3 text-primary-200" />
              <h3 className="text-lg font-semibold mb-2">Fasilitas Lengkap</h3>
              <p className="text-sm text-primary-100">AC, Locker, Parkir tersedia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
