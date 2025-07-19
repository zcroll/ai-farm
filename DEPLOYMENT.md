# Deployment Guide for Plant Disease Detection App

This guide provides instructions for deploying the Plant Disease Detection App to a production environment.

## Prerequisites

- A web server (Apache, Nginx, etc.)
- PHP 8.1+ with required extensions
- Composer
- Node.js and NPM
- Python 3.8+ with TensorFlow
- MySQL or compatible database
- SSL certificate for secure connections

## Production Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd plant-app
```

### 2. Install Dependencies

```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

### 3. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit the `.env` file:
- Set `APP_ENV=production`
- Set `APP_DEBUG=false`
- Configure your database connection
- Set `PYTHON_EXECUTABLE_PATH` to the path of your Python installation
- Set `PREDICTION_SCRIPT_PATH` to the absolute path of the predict.py script

### 4. Set Up the Database

```bash
php artisan migrate --seed
```

### 5. Set Up Storage

```bash
php artisan storage:link
```

### 6. Set Proper Permissions

```bash
# Set proper ownership
chown -R www-data:www-data /path/to/your/app

# Set proper permissions
find /path/to/your/app -type f -exec chmod 644 {} \;
find /path/to/your/app -type d -exec chmod 755 {} \;
chmod -R 775 /path/to/your/app/storage
chmod -R 775 /path/to/your/app/bootstrap/cache
chmod +x /path/to/your/app/predict.py
```

### 7. Configure Web Server

#### Apache Configuration Example

Create a new virtual host configuration:

```apache
<VirtualHost *:80>
    ServerName plant-app.example.com
    DocumentRoot /path/to/your/app/public
    
    <Directory /path/to/your/app/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/plant-app-error.log
    CustomLog ${APACHE_LOG_DIR}/plant-app-access.log combined
    
    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName plant-app.example.com
    DocumentRoot /path/to/your/app/public
    
    <Directory /path/to/your/app/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/plant-app-error.log
    CustomLog ${APACHE_LOG_DIR}/plant-app-access.log combined
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    SSLCertificateChainFile /path/to/your/chain.crt
</VirtualHost>
```

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name plant-app.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name plant-app.example.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    root /path/to/your/app/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
```

### 8. Set Up Cron Job for Laravel Scheduler

```bash
# Add this to your crontab
* * * * * cd /path/to/your/app && php artisan schedule:run >> /dev/null 2>&1
```

### 9. Install Python Dependencies

```bash
pip install tensorflow pillow numpy
```

### 10. Test the Application

Visit your domain in a web browser and ensure everything is working correctly.

## Scaling Considerations

### Queue Workers

For better performance, consider using Laravel's queue system for processing predictions:

```bash
# Install supervisor
apt-get install supervisor

# Create a configuration file
nano /etc/supervisor/conf.d/plant-app-worker.conf
```

Add the following configuration:

```ini
[program:plant-app-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/app/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/your/app/storage/logs/worker.log
stopwaitsecs=3600
```

Then start the supervisor:

```bash
supervisorctl reread
supervisorctl update
supervisorctl start all
```

### Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Monitoring and Maintenance

- Set up regular backups for your database and uploaded images
- Monitor server resources, especially when processing large images
- Consider setting up monitoring tools like New Relic or Datadog
- Regularly update dependencies and security patches

## Troubleshooting

### Common Issues

1. **Permission Issues**: Ensure the web server has proper permissions to access storage and execute the Python script.
2. **Python Dependencies**: Make sure TensorFlow and other dependencies are installed correctly.
3. **Model Loading Errors**: Verify the model file exists and is accessible.

### Logs

Check these logs for troubleshooting:

- Laravel logs: `/path/to/your/app/storage/logs/laravel.log`
- Web server logs: `/var/log/apache2/` or `/var/log/nginx/`
- PHP-FPM logs: `/var/log/php8.1-fpm.log` 