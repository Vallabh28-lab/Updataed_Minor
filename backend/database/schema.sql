-- ============================================================================
-- Legal AI Platform - Complete Database Schema
-- ============================================================================

\c lawyerdb;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- 2. ENHANCED LAWYERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lawyers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience_years INTEGER NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    office_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    languages TEXT[],
    bar_registration_number VARCHAR(100) UNIQUE,
    consultation_fee DECIMAL(10, 2),
    rating DECIMAL(3, 2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    profile_photo TEXT,
    bio TEXT,
    location GEOGRAPHY(Point, 4326),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lawyers_specialization ON lawyers(specialization);
CREATE INDEX idx_lawyers_city ON lawyers(city);
CREATE INDEX idx_lawyers_rating ON lawyers(rating DESC);
CREATE INDEX idx_lawyers_location ON lawyers USING GIST(location);
CREATE INDEX idx_lawyers_verified_active ON lawyers(is_verified, is_active);

-- ============================================================================
-- 3. APPOINTMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    lawyer_id INTEGER REFERENCES lawyers(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    issue_summary TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled'))
);

CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_lawyer ON appointments(lawyer_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================================
-- 4. DOCUMENT ANALYSIS HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_analysis_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(100) UNIQUE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    legal_category VARCHAR(100),
    urgency_level VARCHAR(50),
    risk_score INTEGER,
    summary TEXT,
    keywords TEXT[],
    important_dates TEXT[],
    risky_clauses JSONB,
    recommended_lawyer_types JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_history_user ON document_analysis_history(user_id);
CREATE INDEX idx_history_job_id ON document_analysis_history(job_id);
CREATE INDEX idx_history_category ON document_analysis_history(legal_category);
CREATE INDEX idx_history_created ON document_analysis_history(created_at DESC);

-- ============================================================================
-- 5. LAWYER REVIEWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lawyer_reviews (
    id SERIAL PRIMARY KEY,
    lawyer_id INTEGER REFERENCES lawyers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lawyer_id, user_id)
);

CREATE INDEX idx_reviews_lawyer ON lawyer_reviews(lawyer_id);
CREATE INDEX idx_reviews_rating ON lawyer_reviews(rating DESC);

-- ============================================================================
-- 6. NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- 7. ANALYTICS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================================================
-- 8. ANALYSES TABLE (Enhanced)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    legal_category VARCHAR(100),
    urgency_level VARCHAR(50),
    risk_score INTEGER,
    summary TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analyses_job_id ON analyses(job_id);
CREATE INDEX idx_analyses_category ON analyses(legal_category);
CREATE INDEX idx_analyses_user ON analyses(user_id);

-- ============================================================================
-- 9. TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lawyers_updated_at BEFORE UPDATE ON lawyers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. TRIGGER FOR LAWYER RATING UPDATE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_lawyer_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE lawyers
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM lawyer_reviews
        WHERE lawyer_id = NEW.lawyer_id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM lawyer_reviews
        WHERE lawyer_id = NEW.lawyer_id
    )
    WHERE id = NEW.lawyer_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_after_review
AFTER INSERT OR UPDATE ON lawyer_reviews
FOR EACH ROW EXECUTE FUNCTION update_lawyer_rating();

-- ============================================================================
-- 11. SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample users
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('user@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCXE0hZUHW', 'John Doe', '9876543210', 'user'),
('admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCXE0hZUHW', 'Admin User', '9876543211', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample enhanced lawyers
INSERT INTO lawyers (name, specialization, experience_years, phone, email, office_address, city, state, languages, bar_registration_number, consultation_fee, rating, location) VALUES
('Anita Mehra', 'Corporate Lawyer', 15, '9876543210', 'anita.mehra@lawfirm.com', 'Tower A, BKC', 'Mumbai', 'Maharashtra', ARRAY['English', 'Hindi', 'Marathi'], 'BAR001MH', 5000.00, 4.8, ST_GeogFromText('POINT(72.8777 19.0760)')),
('Rajesh Kumar', 'Criminal Lawyer', 20, '9876543211', 'rajesh.kumar@lawfirm.com', 'Court Road', 'Delhi', 'Delhi', ARRAY['English', 'Hindi'], 'BAR002DL', 4000.00, 4.5, ST_GeogFromText('POINT(77.2090 28.6139)')),
('Priya Sharma', 'Family Lawyer', 10, '9876543212', 'priya.sharma@lawfirm.com', 'MG Road', 'Bangalore', 'Karnataka', ARRAY['English', 'Kannada', 'Hindi'], 'BAR003KA', 3500.00, 4.7, ST_GeogFromText('POINT(77.5946 12.9716)'))
ON CONFLICT (bar_registration_number) DO NOTHING;

-- ============================================================================
-- COMPLETE SCHEMA CREATED
-- ============================================================================

SELECT 'Database schema created successfully!' AS status;
