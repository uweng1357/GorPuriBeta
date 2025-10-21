const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample fields
  const fields = await Promise.all([
    prisma.field.create({
      data: {
        name: 'Lapangan Futsal A',
        description: 'Lapangan futsal indoor dengan rumput sintetis berkualitas tinggi',
        location: 'Jl. Merdeka No. 123, Ciledug',
        pricePerHour: 150000,
        imageUrl: '/images/futsal-a.jpg',
        facilities: ['AC', 'Locker Room', 'Parking', 'Cafe']
      }
    }),
    prisma.field.create({
      data: {
        name: 'Lapangan Futsal B',
        description: 'Lapangan futsal outdoor dengan pencahayaan LED',
        location: 'Jl. Merdeka No. 123, Ciledug',
        pricePerHour: 120000,
        imageUrl: '/images/futsal-b.jpg',
        facilities: ['Locker Room', 'Parking', 'Cafe']
      }
    }),
    prisma.field.create({
      data: {
        name: 'Lapangan Badminton',
        description: 'Lapangan badminton indoor dengan AC dan pencahayaan optimal',
        location: 'Jl. Merdeka No. 123, Ciledug',
        pricePerHour: 80000,
        imageUrl: '/images/badminton.jpg',
        facilities: ['AC', 'Locker Room', 'Parking']
      }
    }),
    prisma.field.create({
      data: {
        name: 'Lapangan Basket',
        description: 'Lapangan basket outdoor dengan permukaan berkualitas',
        location: 'Jl. Merdeka No. 123, Ciledug',
        pricePerHour: 100000,
        imageUrl: '/images/basket.jpg',
        facilities: ['Parking', 'Cafe']
      }
    })
  ]);

  console.log(`✅ Created ${fields.length} fields`);

  // Create field schedules for each field
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  for (const field of fields) {
    const schedules = await Promise.all(
      daysOfWeek.map(day =>
        prisma.fieldSchedule.create({
          data: {
            fieldId: field.id,
            dayOfWeek: day,
            startTime: '06:00:00',
            endTime: '22:00:00',
            isAvailable: true
          }
        })
      )
    );
    console.log(`✅ Created ${schedules.length} schedules for ${field.name}`);
  }

  // Create sample admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@sportreservation.com',
      password: hashedPassword,
      phone: '+62 812-3456-7890',
      role: 'ADMIN'
    }
  });

  console.log('✅ Created admin user');

  // Create sample regular user
  const userPassword = await bcrypt.hash('user123', 12);
  
  const regularUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      phone: '+62 812-3456-7891',
      role: 'USER'
    }
  });

  console.log('✅ Created regular user');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📝 Sample accounts:');
  console.log('Admin: admin@sportreservation.com / admin123');
  console.log('User: john@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
