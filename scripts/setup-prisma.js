const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Sport Reservation with Prisma...\n');

try {
  // Create .env file if it doesn't exist
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    const envContent = `DATABASE_URL="mysql://root:@localhost:3306/sport_reservation"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created');
  }

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  // Create database if it doesn't exist
  console.log('📊 Creating database...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema created');
  } catch (error) {
    console.log('⚠️  Database might not be running. Please start MySQL server first.');
    console.log('   Then run: npx prisma db push');
  }

  // Seed database with sample data
  console.log('🌱 Seeding database...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
    console.log('✅ Database seeded');
  } catch (error) {
    console.log('⚠️  Seeding skipped (seed script not found)');
  }

  console.log('\n🎉 Prisma setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure MySQL server is running');
  console.log('2. Update DATABASE_URL in .env file if needed');
  console.log('3. Run: npx prisma db push (if not done already)');
  console.log('4. Run: npm run dev');
  console.log('5. Open http://localhost:3000');

} catch (error) {
  console.error('❌ Error setting up Prisma:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure MySQL is running');
  console.log('2. Check your database credentials in .env');
  console.log('3. Ensure you have permission to create databases');
}
