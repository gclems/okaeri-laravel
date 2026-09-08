# syntax=docker/dockerfile:1

# ============================================================
# Base PHP / FrankenPHP
# ============================================================

FROM ghcr.io/gclems/okaeri-laravel-base:php8.5 AS base

WORKDIR /app


# ============================================================
# Composer dependencies - development
# ============================================================

FROM base AS vendor-dev

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

RUN composer install \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts


# ============================================================
# Frontend build
# ============================================================

FROM vendor-dev AS frontend

# Node 26 uniquement pour le build
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
    && curl -fsSL https://deb.nodesource.com/setup_26.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN php artisan package:discover --ansi

RUN node --version
RUN npm --version

RUN npm ci

RUN npm run build


# ============================================================
# Composer dependencies - production
# ============================================================

FROM base AS vendor-prod

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts


# ============================================================
# Production
# ============================================================

FROM base AS production

ENV APP_ENV=production \
    APP_DEBUG=false \
    SERVER_NAME=:80

COPY --from=vendor-prod /app/vendor ./vendor

COPY . .

COPY --from=frontend /app/public/build ./public/build

RUN mkdir -p \
    storage/app \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data \
        storage \
        bootstrap/cache

COPY Caddyfile /etc/frankenphp/Caddyfile

EXPOSE 80

CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]
