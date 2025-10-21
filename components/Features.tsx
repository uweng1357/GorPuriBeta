import { Calendar, Clock, Shield, Headphones, MapPin, Star } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Reservasi Mudah',
      description: 'Booking lapangan hanya dalam beberapa klik dengan sistem yang user-friendly'
    },
    {
      icon: Clock,
      title: 'Tersedia 24/7',
      description: 'Lapangan siap pakai setiap saat, sesuai dengan jadwal yang Anda inginkan'
    },
    {
      icon: Shield,
      title: 'Pembayaran Aman',
      description: 'Sistem pembayaran terjamin keamanannya dengan berbagai metode pembayaran'
    },
    {
      icon: Headphones,
      title: 'Customer Service',
      description: 'Tim customer service siap membantu Anda 24/7 untuk semua kebutuhan'
    },
    {
      icon: MapPin,
      title: 'Lokasi Strategis',
      description: 'Lokasi mudah dijangkau dengan akses transportasi yang memadai'
    },
    {
      icon: Star,
      title: 'Fasilitas Lengkap',
      description: 'AC, locker room, area parkir, dan cafe tersedia untuk kenyamanan Anda'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan pengalaman reservasi lapangan olahraga terbaik dengan berbagai keunggulan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
