const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Eversight Care Desktop development environment...\n');

// Create necessary directories
const directories = [
  'dist',
  'release',
  'database/backups',
  'logs',
  'temp',
  'assets/images',
  'assets/videos',
  'assets/audio',
  'build/icons'
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create environment file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Eversight Care Desktop Environment Variables
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-in-production
DATABASE_ENCRYPTION_KEY=your-database-encryption-key-change-in-production
LOG_LEVEL=info
ENABLE_DEBUG=true

# API Configuration
API_BASE_URL=http://localhost:3001
WEBSOCKET_URL=ws://localhost:3001

# External Integrations (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Development Settings
HOT_RELOAD=true
OPEN_DEVTOOLS=true
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Development environment setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env file with your configuration');
console.log('2. Run "npm run dev" to start development server');
console.log('3. Run "npm test" to verify setup');
