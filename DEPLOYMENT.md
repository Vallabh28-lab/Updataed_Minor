# Legal AI Platform - Production Deployment Guide

## 🚀 System Overview

**Stack:**
- Frontend: React + Vite
- Backend: FastAPI (Python 3.11)
- Database: PostgreSQL 16 + PostGIS
- OCR: Tesseract + PyMuPDF
- AI: Google Gemini API
- Authentication: JWT + bcrypt
- Deployment: Docker + Railway/Render

## 📋 Prerequisites

1. **Docker & Docker Compose** (latest version)
2. **PostgreSQL 16** with PostGIS extension
3. **Tesseract OCR** binaries
4. **Gemini API Key** from Google AI Studio
5. **Node.js 18+** for frontend

## 🔧 Local Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:vallabh@localhost:5432/lawyerdb
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secret_key_minimum_32_characters
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ENVIRONMENT=development
EOF

# Initialize database
psql -U postgres -d lawyerdb -f database/schema.sql
psql -U postgres -d lawyerdb -f database/optimize_indexes.sql

# Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000
EOF

# Run frontend
npm run dev
```

## 🐳 Docker Deployment

### Build and Run

```bash
cd backend

# Set environment variables
export GEMINI_API_KEY="your_key_here"
export JWT_SECRET="your_secret_key_here"
export DB_PASSWORD="secure_password"

# Build and start services
docker-compose up -d --build

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Verify Deployment

```bash
# Check health
curl http://localhost:8000/health

# Check database
docker exec -it legal_ai_db psql -U postgres -d lawyerdb -c "\dt"
```

## ☁️ Cloud Deployment

### Option 1: Railway

**Backend:**

1. Create new project on Railway
2. Add PostgreSQL service with PostGIS
3. Add Backend service from GitHub
4. Set environment variables:
   ```
   DATABASE_URL=<railway_postgres_url>
   GEMINI_API_KEY=<your_key>
   JWT_SECRET=<random_32_char_string>
   PORT=8000
   ```
5. Deploy

**Frontend:**

1. Deploy to Vercel:
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

2. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

### Option 2: Render

**Backend:**

1. Create new Web Service
2. Connect GitHub repository
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 4`
5. Add PostgreSQL database
6. Set environment variables

**Frontend:**

1. Create Static Site
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🔐 Security Checklist

- [ ] Change default database password
- [ ] Generate secure JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set CORS allowed origins
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity

## 📊 Database Backup

```bash
# Backup
docker exec legal_ai_db pg_dump -U postgres lawyerdb > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i legal_ai_db psql -U postgres lawyerdb < backup_20241210.sql
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Load testing
pip install locust
locust -f tests/load_test.py --host=http://localhost:8000
```

## 📈 Monitoring

**Logs:**
```bash
# Backend logs
docker logs -f legal_ai_backend

# Database logs
docker logs -f legal_ai_db

# Application logs
tail -f backend/logs/app_$(date +%Y%m%d).log
```

**Metrics:**
- API response times
- Database query performance
- OCR processing time
- Document upload success rate
- Authentication success rate

## 🔄 CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          railway up --service backend
```

## 🆘 Troubleshooting

### Common Issues:

**1. Tesseract not found:**
```bash
# Install Tesseract
apt-get install tesseract-ocr
```

**2. Database connection failed:**
```bash
# Check PostgreSQL running
docker ps | grep postgres

# Test connection
psql postgresql://postgres:password@localhost:5432/lawyerdb
```

**3. OCR processing slow:**
- Enable GPU acceleration
- Use pdf2image optimization
- Implement caching

**4. Memory issues:**
- Increase Docker memory limit
- Optimize database queries
- Enable connection pooling

## 📞 Support

- Documentation: `/docs` endpoint
- API Docs: `http://localhost:8000/docs`
- GitHub Issues: Create issue for bugs
- Email: support@legalai.com

## 🎯 Performance Optimization

1. **Database:**
   - Connection pooling (10 connections)
   - Query optimization with indexes
   - VACUUM ANALYZE regularly

2. **Backend:**
   - Async processing for OCR
   - Background tasks for emails
   - Response caching (Redis)

3. **Frontend:**
   - Code splitting
   - Lazy loading
   - CDN for static assets

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | PostgreSQL connection string | Yes | - |
| GEMINI_API_KEY | Google Gemini API key | Yes | - |
| JWT_SECRET | Secret for JWT tokens | Yes | - |
| SMTP_EMAIL | Email for notifications | No | - |
| SMTP_PASSWORD | SMTP password | No | - |
| PORT | Backend port | No | 8000 |
| ENVIRONMENT | Environment (dev/prod) | No | production |

## 🚦 Production Readiness

- ✅ Authentication & Authorization
- ✅ Database migrations
- ✅ Error handling & logging
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Health checks
- ✅ Docker containerization
- ✅ Database backups
- ✅ Monitoring setup

## 📦 Project Structure

```
MINOR/
├── backend/
│   ├── main.py                      # Main FastAPI app
│   ├── lawyer_matcher.py            # Lawyer matching logic
│   ├── services/
│   │   ├── auth_service.py          # Authentication
│   │   ├── appointment_service.py   # Appointments
│   │   ├── lawyer_locator.py        # Location search
│   │   └── recommendation_engine.py # Advanced scoring
│   ├── database/
│   │   ├── schema.sql               # Database schema
│   │   └── optimize_indexes.sql     # Performance indexes
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── DocumentAnalysis.jsx
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎉 Deployment Success!

Your Legal AI Platform is now production-ready with:
- Intelligent OCR + AI document analysis
- Lawyer type recommendations
- Nearby lawyer discovery with PostGIS
- Appointment booking system
- JWT authentication
- Complete database schema
- Docker containerization
- Cloud deployment guides

**Access:**
- Frontend: https://your-app.vercel.app
- Backend API: https://your-api.railway.app
- API Docs: https://your-api.railway.app/docs

Happy Deploying! 🚀
