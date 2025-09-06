-- Ensure dev user and database exist (safe to run even if DB was initialized)
DO
$$
BEGIN
   -- Create role if it does not exist
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'devuser') THEN
      CREATE ROLE devuser WITH LOGIN PASSWORD 'devpass';
   END IF;
EXCEPTION
   WHEN others THEN
      -- ignore errors to keep init idempotent
      RAISE NOTICE 'Could not ensure devuser: %', SQLERRM;
END
$$;

-- Create database if missing and grant privileges
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'meta_ad_studio') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE meta_ad_studio');
   END IF;
EXCEPTION
   WHEN others THEN
      RAISE NOTICE 'Could not ensure database meta_ad_studio: %', SQLERRM;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE meta_ad_studio TO devuser;
