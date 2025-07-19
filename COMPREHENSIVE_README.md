# Plant Disease Detection System

A comprehensive plant disease detection application built with Laravel (PHP) backend and React/TypeScript frontend, powered by deep learning for accurate plant disease classification.

## 🌟 Features

- **AI-Powered Detection**: Uses EfficientNetB4 deep learning model for accurate plant disease classification
- **Real-time Analysis**: Instant disease prediction with confidence scores
- **Multiple Input Methods**: Upload images or capture photos directly from camera
- **Comprehensive Database**: Extensive disease library with treatment suggestions
- **User Management**: Personal scan history and statistics tracking
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Treatment Guidance**: Detailed treatment and prevention recommendations

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Framework**: Laravel 10.x (PHP 8.1+)
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Sanctum
- **File Storage**: Laravel Storage
- **ML Integration**: Python/TensorFlow

#### Frontend
- **Framework**: React 18.x with TypeScript
- **UI Library**: Shadcn/ui components
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **SPA**: Inertia.js

#### Machine Learning
- **Model**: EfficientNetB4
- **Framework**: TensorFlow/Keras
- **Input Size**: 380x380 pixels
- **Classes**: 38 plant disease categories

## 📚 Documentation

This project includes comprehensive documentation split into multiple files:

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference with endpoints, examples, and usage
- **[Frontend Component Documentation](COMPONENT_DOCUMENTATION.md)** - Detailed React component documentation
- **[Backend Documentation](BACKEND_DOCUMENTATION.md)** - Laravel models, controllers, and backend architecture

## 🚀 Quick Start

### Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16+ and npm
- Python 3.8+ with TensorFlow
- MySQL/PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plant-disease-detection
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure environment variables**
   ```env
   # Database
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=plant_disease_detection
   DB_USERNAME=root
   DB_PASSWORD=your_password

   # ML Model
   PYTHON_EXECUTABLE_PATH=/usr/bin/python3
   PREDICTION_SCRIPT_PATH=/path/to/predict.py

   # File Storage
   FILESYSTEM_DISK=public
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed the database (optional)**
   ```bash
   php artisan db:seed
   ```

8. **Create storage link**
   ```bash
   php artisan storage:link
   ```

9. **Build frontend assets**
   ```bash
   npm run build
   ```

10. **Start the development server**
    ```bash
    php artisan serve
    ```

### Python ML Model Setup

1. **Install Python dependencies**
   ```bash
   pip install tensorflow pillow numpy
   ```

2. **Verify model file**
   Ensure `plant_disease_efficientnetb4.h5` is in the project root

3. **Test the model**
   ```bash
   python predict.py test_image.jpg
   ```

## 📖 Usage

### Web Interface

1. **Register/Login**: Create an account or log in to access the dashboard
2. **Upload Image**: Use the plant scanner to upload an image or capture a photo
3. **View Results**: Get instant disease prediction with confidence score
4. **Treatment Info**: Access detailed treatment and prevention recommendations
5. **History**: View your scan history and track plant health over time

### API Usage

#### Predict Disease
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: multipart/form-data" \
  -F "image=@plant_image.jpg"
```

#### Get Dashboard Data
```bash
curl -X GET http://localhost:8000/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## 🏛️ Project Structure

```
plant-disease-detection/
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   ├── Models/              # Eloquent models
│   └── Jobs/                # Background jobs
├── resources/
│   └── js/
│       ├── components/      # React components
│       ├── pages/           # Page components
│       ├── layouts/         # Layout components
│       └── types/           # TypeScript types
├── routes/                  # Route definitions
├── database/                # Migrations and seeders
├── storage/                 # File storage
├── predict.py              # ML prediction script
├── test_model.py           # ML model testing
└── plant_disease_efficientnetb4.h5  # ML model file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PYTHON_EXECUTABLE_PATH` | Path to Python executable | `/usr/bin/python3` |
| `PREDICTION_SCRIPT_PATH` | Path to prediction script | `base_path('predict.py')` |
| `FILESYSTEM_DISK` | File storage disk | `public` |
| `DB_CONNECTION` | Database connection | `mysql` |

### Supported Plant Diseases

The system can detect 38 different plant disease categories:

- **Apple**: Apple scab, Black rot, Cedar apple rust, Healthy
- **Blueberry**: Healthy
- **Cherry**: Powdery mildew, Healthy
- **Corn/Maize**: Cercospora leaf spot, Common rust, Northern Leaf Blight, Healthy
- **Grape**: Black rot, Esca, Leaf blight, Healthy
- **Orange**: Haunglongbing (Citrus greening)
- **Peach**: Bacterial spot, Healthy
- **Pepper**: Bacterial spot, Healthy
- **Potato**: Early blight, Late blight, Healthy
- **Raspberry**: Healthy
- **Soybean**: Healthy
- **Squash**: Powdery mildew
- **Strawberry**: Leaf scorch, Healthy
- **Tomato**: 10 different diseases + Healthy

## 🧪 Testing

### Run PHP Tests
```bash
php artisan test
```

### Run Frontend Tests
```bash
npm test
```

### Test ML Model
```bash
php artisan tinker
>>> app(\App\Http\Controllers\PredictionController::class)->testModel(request());
```

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   # Set production environment
   APP_ENV=production
   APP_DEBUG=false
   
   # Configure database
   DB_HOST=your_db_host
   DB_DATABASE=your_db_name
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   
   # Configure ML model paths
   PYTHON_EXECUTABLE_PATH=/usr/bin/python3
   PREDICTION_SCRIPT_PATH=/var/www/html/predict.py
   ```

2. **Optimize for Production**
   ```bash
   composer install --optimize-autoloader --no-dev
   npm run build
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Set up Queue Worker (optional)**
   ```bash
   php artisan queue:work
   ```

### Docker Deployment

```dockerfile
FROM php:8.1-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && pip3 install tensorflow pillow numpy

# Copy application
COPY . /var/www/html
WORKDIR /var/www/html

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Install Node.js dependencies and build
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/html
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PSR-12 coding standards for PHP
- Use TypeScript for all frontend code
- Write tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Plant disease dataset from [PlantVillage](https://plantvillage.psu.edu/)
- EfficientNet architecture from Google Research
- Laravel framework and ecosystem
- React and TypeScript communities

## 📞 Support

For support and questions:

- **Documentation**: Check the documentation files in this repository
- **Issues**: Create an issue on GitHub
- **Email**: Contact the development team

## 🔄 Changelog

### Version 1.0.0
- Initial release with plant disease detection
- Support for 38 disease categories
- Web interface with React/TypeScript
- RESTful API with Laravel
- ML model integration with TensorFlow

---

**Note**: This is a comprehensive plant disease detection system designed for educational and research purposes. For production use in agricultural settings, additional validation and testing is recommended.