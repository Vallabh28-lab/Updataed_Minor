# Legal Case Analysis Dashboard

A comprehensive legal management system with separate frontend and backend architecture.

## Project Structure

```
MINOR/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── README.md
```

## Frontend (React + Vite)

### Features
- Dashboard with case statistics
- Lawyer directory with search and reviews
- Appointment management
- Consultation booking system
- Document analysis
- User authentication

### Setup
```bash
cd frontend
npm install
npm run dev
```

## Backend (Node.js + Express)

### Features
- RESTful API endpoints
- User authentication
- Case management
- Lawyer directory
- Appointment booking
- Document upload and analysis

### Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Cases
- `GET /api/cases` - Get all cases
- `POST /api/cases` - Create new case
- `GET /api/cases/search` - Search cases

### Lawyers
- `GET /api/lawyers` - Get all lawyers
- `GET /api/lawyers/search` - Search lawyers
- `GET /api/lawyers/:id/reviews` - Get lawyer reviews
- `POST /api/lawyers/:id/reviews` - Add lawyer review

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Reschedule appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Documents
- `GET /api/documents` - Get user documents
- `POST /api/documents/upload` - Upload document
- `POST /api/documents/analyze` - Analyze document

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB (planned)
- JWT Authentication
- Multer (file uploads)

## Development

1. Start backend server: `cd backend && npm run dev`
2. Start frontend dev server: `cd frontend && npm run dev`
3. Access application at `http://localhost:5173`