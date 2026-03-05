SELECT 'CREATE DATABASE insurance_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'insurance_db')\gexec

\connect insurance_db

CREATE SCHEMA IF NOT EXISTS quote;
CREATE SCHEMA IF NOT EXISTS policy;
