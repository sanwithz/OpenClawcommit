// Coffee Loyalty System - Backend API
// Based on Claude Opus architecture, implemented by Kimi

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/coffee_loyalty'
});

app.use(cors());
app.use(express.json());

// ============================================
// LOYALTY ENGINE (from Claude Opus design)
// ============================================
const LoyaltyEngine = {
  multipliers: {
    bronze: 1,
    silver: 1.2,
    gold: 1.5,
    platinum: 2
  },

  calculatePoints(customer, amount) {
    const basePoints = Math.floor(amount);
    return Math.floor(basePoints * this.multipliers[customer.tier]);
  },

  checkTierUpgrade(lifetimeSpent) {
    if (lifetimeSpent >= 10000) return 'platinum';
    if (lifetimeSpent >= 5000) return 'gold';
    if (lifetimeSpent >= 1000) return 'silver';
    return null;
  },

  calculateRedeemValue(points) {
    return Math.floor(points / 100) * 10; // 100 points = 10 THB
  }
};

// ============================================
// API ENDPOINTS
// ============================================

// Register new customer
app.post('/api/customers/register', async (req, res) => {
  try {
    const { phone, name } = req.body;
    
    const result = await pool.query(
      'INSERT INTO customers (phone, name) VALUES ($1, $2) RETURNING *',
      [phone, name]
    );
    
    res.json({ success: true, customer: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'เบอร์โทรนี้มีในระบบแล้ว' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get customer by phone
app.get('/api/customers/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM customers WHERE phone = $1',
      [phone]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบลูกค้า' });
    }
    
    res.json({ success: true, customer: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create order with points
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { customer_phone, total_amount, redeem_points = 0 } = req.body;
    
    // Get customer
    const customerResult = await client.query(
      'SELECT * FROM customers WHERE phone = $1',
      [customer_phone]
    );
    
    if (customerResult.rows.length === 0) {
      throw new Error('ไม่พบลูกค้า');
    }
    
    const customer = customerResult.rows[0];
    
    // Check if enough points
    if (redeem_points > customer.total_points) {
      throw new Error('คะแนนไม่พอ');
    }
    
    // Calculate points earned
    const pointsEarned = LoyaltyEngine.calculatePoints(customer, total_amount);
    const redeemValue = LoyaltyEngine.calculateRedeemValue(redeem_points);
    const finalAmount = total_amount - redeemValue;
    
    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total_amount, points_earned, points_redeemed, final_amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer.id, total_amount, pointsEarned, redeem_points, finalAmount]
    );
    
    // Update customer points
    const newPoints = customer.total_points - redeem_points + pointsEarned;
    const newLifetime = parseFloat(customer.lifetime_spent) + total_amount;
    
    // Check tier upgrade
    const newTier = LoyaltyEngine.checkTierUpgrade(newLifetime) || customer.tier;
    
    await client.query(
      `UPDATE customers 
       SET total_points = $1, lifetime_spent = $2, tier = $3, last_visit = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [newPoints, newLifetime, newTier, customer.id]
    );
    
    // Record transactions
    if (pointsEarned > 0) {
      await client.query(
        `INSERT INTO points_transactions (customer_id, type, points, order_id, description)
         VALUES ($1, 'earn', $2, $3, 'ซื้อสินค้า')`,
        [customer.id, pointsEarned, orderResult.rows[0].id]
      );
    }
    
    if (redeem_points > 0) {
      await client.query(
        `INSERT INTO points_transactions (customer_id, type, points, order_id, description)
         VALUES ($1, 'redeem', $2, $3, 'แลกคะแนน')`,
        [customer.id, -redeem_points, orderResult.rows[0].id]
      );
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      order: orderResult.rows[0],
      points_earned: pointsEarned,
      points_redeemed: redeem_points,
      new_total_points: newPoints,
      tier_upgraded: newTier !== customer.tier ? newTier : null
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Get available rewards
app.get('/api/rewards', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rewards WHERE is_active = true'
    );
    res.json({ success: true, rewards: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get customer transactions
app.get('/api/customers/:phone/transactions', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const result = await pool.query(`
      SELECT pt.* FROM points_transactions pt
      JOIN customers c ON pt.customer_id = c.id
      WHERE c.phone = $1
      ORDER BY pt.created_at DESC
      LIMIT 20
    `, [phone]);
    
    res.json({ success: true, transactions: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Coffee Loyalty API running on port ${port}`);
});
