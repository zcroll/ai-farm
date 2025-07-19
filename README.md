# Plant Disease Detection App

A full-stack web application built with Laravel 10 and React that allows users to upload plant leaf images for disease detection using a local TensorFlow/Keras model.

## Features

- User authentication and registration
- Upload images or capture them using device camera
- AI-powered plant disease detection
- Detailed information about detected diseases and treatment suggestions
- History of previous scans with statistics

## Requirements

- PHP 8.1+
- Composer
- Node.js and NPM
- Python 3.8+ with TensorFlow
- MySQL or compatible database

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd plant-app
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Configure Environment

Copy the `.env.example` file to `.env` and update the database settings:

```bash
cp .env.example .env
php artisan key:generate
```

Add these lines to your `.env` file:

```
# Plant Disease Detection Configuration
PYTHON_EXECUTABLE_PATH="/usr/bin/python3"
PREDICTION_SCRIPT_PATH="${PWD}/predict.py"
```

Adjust the Python path as needed for your system.

### 5. Set Up the Database

```bash
php artisan migrate --seed
```

This will create all necessary tables and seed the disease information.

### 6. Set Up Storage Symlink

```bash
php artisan storage:link
```

### 7. Copy the Python Model

Ensure the TensorFlow model file `plant_disease_efficientnetb4.h5` is in your project root directory.

Make the prediction script executable:

```bash
chmod +x predict.py
```

### 8. Install Python Dependencies

```bash
pip install tensorflow pillow numpy
```

### 9. Run the Application

Start the Laravel development server:

```bash
php artisan serve
```

In a separate terminal, compile and watch for frontend changes:

```bash
npm run dev
```

Visit `http://127.0.0.1:8000` in your browser, register an account, and start using the application.

## Usage

1. Log in to your account
2. From the dashboard, either upload an image or use your device's camera to capture a plant leaf
3. Submit the image for analysis
4. View the detection results, including disease information and treatment suggestions
5. Check your scan history and statistics in the dashboard

## Technical Details

- Backend: Laravel 10 with Inertia.js
- Frontend: React with TypeScript
- ML Model: TensorFlow/Keras model for plant disease detection
- Database: MySQL with Eloquent ORM
- Authentication: Laravel Breeze

## Model Information

The plant disease detection model can identify 38 different plant diseases across various crops including:
- Apple
- Blueberry
- Cherry
- Corn
- Grape
- Orange
- Peach
- Pepper
- Potato
- Raspberry
- Soybean
- Squash
- Strawberry
- Tomato

Each crop has specific diseases that can be detected, as well as a "healthy" classification. 