-- Coffee Shop Loyalty System Database Schema
-- Created by Claude Opus + Kimi (Boss)

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    total_points INTEGER DEFAULT 0,
    lifetime_spent DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP
);

-- Points transactions
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    type VARCHAR(20) CHECK (type IN ('earn', 'redeem', 'expire', 'bonus')),
    points INTEGER NOT NULL,
    order_id UUID,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    total_amount DECIMAL(10,2) NOT NULL,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rewards catalog
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    quantity_available INTEGER DEFAULT -1, -- -1 = unlimited
    is_active BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_transactions_customer ON points_transactions(customer_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Initial rewards data
INSERT INTO rewards (name, description, points_required) VALUES
('กาแฟฟรี 1 แก้ว', 'แลกกาแฟร้อน/เย็น 1 แก้ว', 100),
('เค้กฟรี 1 ชิ้น', 'แลกเค้กใดก็ได้ 1 ชิ้น', 150),
('ส่วนลด 50 บาท', 'ส่วนลด 50 บาทสำหรับครั้งถัดไป', 500),
('เสื้อร้านกาแฟ', 'เสื้อคอลเลคชั่นพิเศษ', 2000);
