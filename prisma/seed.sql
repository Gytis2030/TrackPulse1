-- Demo seed data for local development
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt")
VALUES ('demo_user', 'demo@trackpulse.dev', 'Demo Producer', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;
