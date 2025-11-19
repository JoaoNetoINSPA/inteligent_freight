# Intelligent Freight - Backend API

Backend API built with **PHP 8.2** using custom **MVC architecture** without frameworks.

## Stack

- PHP 8.2 (pure, no frameworks)
- MySQL 8.0
- Nginx
- Docker & Docker Compose
- JWT Authentication (firebase/php-jwt)

## Architecture

Custom MVC implementation with:
- **Models**: Database layer with PDO
- **Views**: JSON API responses
- **Controllers**: Business logic
- **Core**: Router, Request, Response, Database connection, JWT, Middleware

## Setup

### Prerequisites
- Docker
- Docker Compose

### Installation

```bash
# Install Composer dependencies (if not using Docker)
composer install

# Start containers
docker-compose up -d

# Install dependencies inside container
docker-compose exec php composer install

# Check containers
docker-compose ps

# View logs
docker-compose logs -f
```

The API will be available at: `http://localhost:8080`

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "company_name": "ABC Logistics",
  "company_address": "123 Main St",
  "email": "admin@abc.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company and user registered successfully",
  "data": {
    "company_id": 1,
    "user_id": 1,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@abc.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "company": {...},
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Using the Token

All protected endpoints require the JWT token in the Authorization header:

```bash
GET /api/packages
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Check API status
- `POST /api/auth/register` - Register new company and admin user
- `POST /api/auth/login` - Login user

### Protected Endpoints (Require JWT)
- `GET /api/companies` - List all companies
- `GET /api/companies/{id}` - Get company details
- `GET /api/packages` - List all packages
- `POST /api/packages` - Create package
- `GET /api/packages/{id}` - Get package details
- `PUT /api/packages/{id}` - Update package
- `DELETE /api/packages/{id}` - Delete package
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details
- `DELETE /api/users/{id}` - Delete user

## Project Structure

```
backend/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   └── Dockerfile
│   └── mysql/
│       └── init.sql
├── public/
│   └── index.php
├── src/
│   ├── Core/
│   │   ├── Controller.php
│   │   ├── Database.php
│   │   ├── Model.php
│   │   ├── Request.php
│   │   ├── Response.php
│   │   ├── Router.php
│   │   ├── JWT.php
│   │   └── Middleware.php
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── CompanyController.php
│   │   ├── PackageController.php
│   │   └── UserController.php
│   ├── Models/
│   │   ├── Company.php
│   │   ├── User.php
│   │   └── Package.php
│   ├── Middleware/
│   │   └── AuthMiddleware.php
│   ├── config/
│   │   └── database.php
│   ├── bootstrap.php
│   └── routes.php
├── composer.json
├── docker-compose.yml
└── README.md
```

## Database

MySQL database with tables:
- `companies` - Shipping companies (multitenant)
- `users` - Company users (admin/sellers)
- `packages` - Freight packages

## Environment Variables

- `DB_HOST` - Database host (default: mysql)
- `DB_PORT` - Database port (default: 3306)
- `DB_NAME` - Database name (default: intelligent_freight)
- `DB_USER` - Database user (default: freight_user)
- `DB_PASS` - Database password (default: freight_password)
- `JWT_SECRET` - JWT secret key (change in production!)

## Stopping

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```
