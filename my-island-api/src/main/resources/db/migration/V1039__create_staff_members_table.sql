-- Staff members table: allows owners/suppliers to invite team members
CREATE TABLE staff_members (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    owner_id BIGINT REFERENCES owners(id),
    supplier_id BIGINT REFERENCES suppliers(id),
    user_id BIGINT REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'INVITED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_staff_has_employer CHECK (owner_id IS NOT NULL OR supplier_id IS NOT NULL)
);

CREATE INDEX idx_staff_members_email ON staff_members(email);
CREATE INDEX idx_staff_members_owner_id ON staff_members(owner_id);
CREATE INDEX idx_staff_members_supplier_id ON staff_members(supplier_id);
CREATE INDEX idx_staff_members_user_id ON staff_members(user_id);

-- Add is_staff flag to users
ALTER TABLE users ADD COLUMN is_staff BOOLEAN NOT NULL DEFAULT FALSE;
