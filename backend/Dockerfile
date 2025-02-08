# Menggunakan PHP dengan Apache
FROM php:8.1-apache

# Install ekstensi PHP untuk koneksi ke MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Copy file PHP ke dalam kontainer
COPY ./ /var/www/html/

# Menyalakan Apache
RUN chown -R www-data:www-data /var/www/html
EXPOSE 80
