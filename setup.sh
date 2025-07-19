#!/bin/bash

# Plant Disease Detection App Setup Script

echo "🌿 Setting up Plant Disease Detection App..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "❌ pip is not installed. Please install pip and try again."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.1+ and try again."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

echo "✅ All required tools are installed."

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install

# Install JavaScript dependencies
echo "📦 Installing JavaScript dependencies..."
npm install

# Generate application key
echo "🔑 Generating application key..."
cp -n .env.example .env
php artisan key:generate

# Add Python configuration to .env
echo "⚙️ Configuring Python environment..."
if ! grep -q "PYTHON_EXECUTABLE_PATH" .env; then
    echo "" >> .env
    echo "# Plant Disease Detection Configuration" >> .env
    echo "PYTHON_EXECUTABLE_PATH=\"$(which python3)\"" >> .env
    echo "PREDICTION_SCRIPT_PATH=\"\${PWD}/predict.py\"" >> .env
fi

# Set up the database
echo "🗄️ Setting up the database..."
read -p "Run database migrations and seeders? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    php artisan migrate --seed
fi

# Create storage link
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Make prediction script executable
echo "🐍 Setting up Python script..."
chmod +x predict.py

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install tensorflow pillow numpy

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Run 'php artisan serve' in one terminal"
echo "2. Run 'npm run dev' in another terminal"
echo "3. Visit http://127.0.0.1:8000 in your browser"
echo ""
echo "🌿 Happy plant disease detecting!" 