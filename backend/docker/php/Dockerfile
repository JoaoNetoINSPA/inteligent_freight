FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    git \
    curl \
    zip \
    unzip

RUN docker-php-ext-install pdo pdo_mysql mysqli

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]

