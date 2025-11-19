# Intelligent Freight - Frontend

Frontend application for the Intelligent Freight platform, a freight audit and management system. This React-based application provides a user interface for freight calculation, freight auditing, package management, and user administration for shipping companies.

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Installation

To install the project dependencies, run:

```sh
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## Development

To start the development server, run:

```sh
npm run dev
```

The application will be available at the URL shown in the terminal output (typically `http://localhost:5173`).

**Note:** Make sure the backend API is running on `http://localhost:8080` before starting the frontend.

## Backend Integration

The frontend is integrated with the backend API:
- Authentication uses JWT tokens stored in localStorage
- All API requests include the JWT token in the Authorization header
- Login and Signup redirect to the dashboard upon success
