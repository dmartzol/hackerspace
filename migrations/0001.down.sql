BEGIN;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS accounts;
DROP EXTENSION IF EXISTS citext;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS "uuid-ossp";
COMMIT;
