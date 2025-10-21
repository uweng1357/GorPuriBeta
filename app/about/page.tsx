import { Calendar, Users, MapPin, Star, Shield, Clock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tentang SportReservation
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Platform reservasi lapangan olahraga terdepan yang menghubungkan pecinta olahraga 
            dengan fasilitas terbaik di Ciledug dan sekitarnya.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Misi Kami</h2>
            <p className="text-lg text-gray-600 mb-6">
              SportReservation didirikan dengan misi untuk memudahkan akses ke fasilitas olahraga 
              berkualitas tinggi. Kami percaya bahwa setiap orang berhak mendapatkan pengalaman 
              olahraga yang terbaik dengan harga yang terjangkau.
            </p>
            <p className="text-lg text-gray-600">
              Dengan teknologi modern dan pelayanan yang ramah, kami berkomitmen untuk menjadi 
              platform terpercaya dalam industri reservasi lapangan olahraga.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">1000+</h3>
                <p className="text-primary-700">Pengguna Aktif</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">5000+</h3>
                <p className="text-primary-700">Reservasi Sukses</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">4.8</h3>
                <p className="text-primary-700">Rating Rata-rata</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900">15+</h3>
                <p className="text-primary-700">Lapangan Tersedia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Keamanan & Kepercayaan</h3>
              <p className="text-gray-600">
                Kami memprioritaskan keamanan data dan transaksi pengguna dengan sistem enkripsi 
                terdepan dan perlindungan privasi yang ketat.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kemudahan & Kecepatan</h3>
              <p className="text-gray-600">
                Proses reservasi yang sederhana dan cepat, memungkinkan Anda mendapatkan 
                lapangan favorit hanya dalam beberapa klik.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kualitas Terbaik</h3>
              <p className="text-gray-600">
                Kami hanya bekerja dengan lapangan olahraga berkualitas tinggi dengan 
                fasilitas lengkap dan pelayanan terbaik.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tim Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ahmad Rizki</h3>
              <p className="text-primary-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Pengalaman 10 tahun di industri teknologi dan olahraga
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Siti Nurhaliza</h3>
              <p className="text-primary-600 mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Ahli teknologi dengan spesialisasi dalam pengembangan platform web
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Budi Santoso</h3>
              <p className="text-primary-600 mb-2">Head of Operations</p>
              <p className="text-gray-600 text-sm">
                Bertanggung jawab atas operasional dan hubungan dengan mitra lapangan
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Kami</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Apakah Anda memiliki lapangan olahraga atau ingin bergabung sebagai mitra? 
            Mari bersama-sama membangun komunitas olahraga yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Hubungi Kami
            </a>
            <a href="/booking" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Mulai Reservasi
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
