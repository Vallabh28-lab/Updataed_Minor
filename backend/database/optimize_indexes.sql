-- ============================================================================
-- Legal AI Platform - Database Optimization Script
-- ============================================================================

\c lawyerdb;

-- Lawyer Table Indexes
CREATE INDEX IF NOT EXISTS idx_lawyers_specialization ON lawyers(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyers_experience ON lawyers(experience_years DESC);
CREATE INDEX IF NOT EXISTS idx_lawyers_spec_exp ON lawyers(specialization, experience_years DESC);
CREATE INDEX IF NOT EXISTS idx_lawyers_location ON lawyers USING GIST(location);

-- Lawyer Mapping Table Indexes
CREATE INDEX IF NOT EXISTS idx_lawyer_mapping_type ON lawyer_mapping(lawyer_type);
CREATE INDEX IF NOT EXISTS idx_lawyer_mapping_domain ON lawyer_mapping(legal_domain);
CREATE INDEX IF NOT EXISTS idx_lawyer_mapping_terms_gin ON lawyer_mapping USING GIN(to_tsvector('english', common_legal_terms));
CREATE INDEX IF NOT EXISTS idx_lawyer_mapping_clauses_gin ON lawyer_mapping USING GIN(to_tsvector('english', common_clauses));
CREATE INDEX IF NOT EXISTS idx_lawyer_mapping_risks_gin ON lawyer_mapping USING GIN(to_tsvector('english', risk_keywords));

-- Analyses Table Indexes
CREATE INDEX IF NOT EXISTS idx_analyses_job_id ON analyses(job_id);
CREATE INDEX IF NOT EXISTS idx_analyses_category ON analyses(legal_category);

-- Analyze tables
ANALYZE lawyers;
ANALYZE lawyer_mapping;
ANALYZE analyses;
