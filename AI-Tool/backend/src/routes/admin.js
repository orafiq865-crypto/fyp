const router = require('express').Router();
const pool = require('../config/db');

router.get('/overview', async (req, res, next) => {
  try {
    const [bookings, revenue, occupancy, eventCount] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM bookings'),
      pool.query("SELECT COALESCE(SUM(total_amount), 0)::numeric AS total FROM bookings WHERE payment_status = 'mock_paid'"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status = 'booked')::int AS booked, COUNT(*)::int AS total FROM seats"),
      pool.query('SELECT COUNT(*)::int AS count FROM events')
    ]);
    const booked = occupancy.rows[0].booked;
    const total = occupancy.rows[0].total;
    res.json({
      bookings: bookings.rows[0].count,
      revenue: Number(revenue.rows[0].total),
      occupancy_percent: total ? Math.round(booked / total * 100) : 0,
      events: eventCount.rows[0].count
    });
  } catch (error) { next(error); }
});

module.exports = router;
