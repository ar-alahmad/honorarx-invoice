-- Add security and performance indexes
-- This migration adds indexes for frequently queried fields

-- Index for email lookups (most common query)
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");

-- Index for password reset tokens
CREATE INDEX IF NOT EXISTS "idx_users_reset_token" ON "users"("resetToken");

-- Index for email verification codes
CREATE INDEX IF NOT EXISTS "idx_users_verification_code" ON "users"("emailVerificationCode");

-- Index for email verification expiry
CREATE INDEX IF NOT EXISTS "idx_users_verification_expiry" ON "users"("emailVerificationExpiry");

-- Index for reset token expiry
CREATE INDEX IF NOT EXISTS "idx_users_reset_token_expiry" ON "users"("resetTokenExpiry");

-- Index for last login tracking
CREATE INDEX IF NOT EXISTS "idx_users_last_login" ON "users"("lastLoginAt");

-- Index for email verification status
CREATE INDEX IF NOT EXISTS "idx_users_email_verified" ON "users"("isEmailVerified");

-- Composite index for active sessions (if using database sessions)
CREATE INDEX IF NOT EXISTS "idx_sessions_user_expires" ON "sessions"("userId", "expiresAt");

-- Index for session tokens
CREATE INDEX IF NOT EXISTS "idx_sessions_token" ON "sessions"("token");
