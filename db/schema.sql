-- DomusCare — schema Neon PostgreSQL
-- Esegui nel SQL Editor del progetto Neon: https://console.neon.tech

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS leads_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    collaboration_type VARCHAR(120),
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS triage_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    who_for VARCHAR(80),
    autonomy_level VARCHAR(80),
    urgent_need VARCHAR(120),
    care_score SMALLINT,
    suggested_package VARCHAR(120),
    answers JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_contacts_created_at
    ON leads_contacts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_triage_submissions_created_at
    ON triage_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_triage_submissions_email
    ON triage_submissions (email);
