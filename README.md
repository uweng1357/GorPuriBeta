# Sport Reservation - Website Reservasi Lapangan Olahraga

Website reservasi lapangan olahraga modern yang dibangun dengan Next.js 14, TypeScript, dan MySQL. Website ini menyediakan platform yang mudah digunakan untuk melakukan reservasi lapangan olahraga dengan berbagai fitur lengkap.

## 🚀 Fitur Utama

- **Reservasi Online**: Sistem booking lapangan yang mudah dan cepat
- **Autentikasi User**: Login dan registrasi dengan keamanan JWT
- **Dashboard User**: Panel kontrol untuk melihat riwayat reservasi
- **Manajemen Lapangan**: Admin dapat mengelola data lapangan
- **Responsive Design**: Tampilan yang optimal di semua perangkat
- **Real-time Availability**: Cek ketersediaan lapangan secara real-time

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prasyarat

- Node.js 18+ 
- MySQL 8.0+
- npm atau yarn

## 🚀 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd SportReservation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database dengan Prisma
1. Pastikan MySQL server berjalan
2. Jalankan setup Prisma:
```bash
npm run setup-prisma
```

Atau manual:
```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed database dengan data sample
npx prisma db seed
```

### 4. Konfigurasi Environment
File `.env` akan dibuat otomatis, atau buat manual:
```env
# Database Configuration untuk Prisma
DATABASE_URL="mysql://root:@localhost:3306/sport_reservation"

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Website akan tersedia di `http://localhost:3000`

## 📁 Struktur Project

```
SportReservation/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── fields/         # Field management
│   │   └── reservations/   # Reservation management
│   ├── booking/           # Booking page
│   ├── dashboard/         # User dashboard
│   ├── fields/            # Fields listing page
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # Reusable components
├── lib/                   # Utility functions
├── database/              # Database schema
└── public/                # Static assets
```

## 🎯 Fitur Detail

### Halaman Utama
- Hero section dengan informasi utama
- Daftar lapangan unggulan
- Fitur-fitur platform
- Testimoni pelanggan

### Sistem Reservasi
- Pilih lapangan dari daftar yang tersedia
- Pilih tanggal dan waktu
- Hitung harga otomatis
- Validasi konflik waktu
- Konfirmasi reservasi

### Dashboard User
- Riwayat reservasi
- Statistik penggunaan
- Manajemen akun
- Status pembayaran

### Autentikasi
- Registrasi dengan validasi
- Login dengan JWT
- Proteksi route
- Session management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user

### Fields
- `GET /api/fields` - Ambil daftar lapangan
- `GET /api/fields?id={id}` - Ambil detail lapangan
- `POST /api/fields` - Buat lapangan baru (admin)

### Reservations
- `GET /api/reservations` - Ambil daftar reservasi
- `POST /api/reservations` - Buat reservasi baru
- `GET /api/reservations/[id]` - Ambil detail reservasi
- `PUT /api/reservations/[id]` - Update reservasi
- `DELETE /api/reservations/[id]` - Hapus reservasi

## 🗄️ Database Schema dengan Prisma

### Models Utama
- **User**: Data pengguna dengan role (USER/ADMIN)
- **Field**: Data lapangan olahraga dengan fasilitas JSON
- **FieldSchedule**: Jadwal operasional lapangan per hari
- **Reservation**: Data reservasi dengan status dan payment status

### Relasi Prisma
- User → Reservations (1:N)
- Field → Reservations (1:N)
- Field → FieldSchedules (1:N)

### Enums
- **Role**: USER, ADMIN
- **DayOfWeek**: MONDAY, TUESDAY, ..., SUNDAY
- **ReservationStatus**: PENDING, CONFIRMED, CANCELLED, COMPLETED
- **PaymentStatus**: PENDING, PAID, REFUNDED

### Keunggulan Prisma
- **Type Safety**: Full TypeScript support
- **Query Builder**: Intuitive dan type-safe
- **Migration**: Otomatis schema management
- **Relations**: Easy join queries
- **Studio**: GUI untuk database management

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy

### Manual Deployment
1. Build production:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

- **Email**: info@sportreservation.com
- **Phone**: +62 812-3456-7890
- **Address**: Jl. Merdeka No. 123, Ciledug, Tangerang

## 🙏 Acknowledgments

- Next.js team untuk framework yang luar biasa
- Tailwind CSS untuk styling system
- MySQL untuk database yang reliable
- Semua kontributor open source yang telah membantu
