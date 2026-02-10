-- V1041: Add role column to staff_members for ACL system
ALTER TABLE staff_members ADD COLUMN role VARCHAR(30) NOT NULL DEFAULT 'MANAGER';

-- Update existing staff to MANAGER (closest to current full-access, minus billing/staff)
UPDATE staff_members SET role = 'MANAGER' WHERE role = 'MANAGER';
