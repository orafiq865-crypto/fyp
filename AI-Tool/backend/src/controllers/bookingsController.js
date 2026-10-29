const crypto = require('crypto');
const pool = require('../config/db');
const { calculateTicketPrice } = require('../utils/pricing');

async function createBooking(req, res, next) {
  const { eventId, seatIds, userName, userEmail } = req.body;
  if (!eventId || !Array.isArray(seatIds) || seatIds.length < 1 || !userName?.trim() || !userEmail?.trim()) {
    return res.status(400).json({ message: 'Event, seats, name, and email are required.' });
  }
  if (seatIds.length > 10) return res.status(400).json({ message: 'You can book up to 10 seats at a time.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const eventResult = await client.query('SELECT * FROM events WHERE id = $1 FOR SHARE', [eventId]);
    if (!eventResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Event not found.' });
    }

    const uniqueSeatIds = [...new Set(seatIds.map(Number))];
    if (uniqueSeatIds.length !== seatIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Duplicate seats are not allowed.' });
    }

    const seatResult = await client.query(
      `SELECT * FROM seats WHERE event_id = $1 AND id = ANY($2::int[]) AND status = 'available' FOR UPDATE`,
      [eventId, uniqueSeatIds]
    );
    if (seatResult.rowCount !== uniqueSeatIds.length) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'One or more seats are no longer available. Refresh and try again.' });
    }

    const occupiedResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM seats WHERE event_id = $1 AND status = 'booked'", [eventId]
    );
    const recentResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM bookings WHERE event_id = $1 AND created_at > NOW() - INTERVAL '1 hour'", [eventId]
    );
    const event = eventResult.rows[0];
    const price = calculateTicketPrice(event.base_price, occupiedResult.rows[0].count, event.capacity, recentResult.rows[0].count);
    const total = price * uniqueSeatIds.length;
    const bookingRef = `SF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const booking = await client.query(
      `INSERT INTO bookings (booking_ref, user_name, user_email, event_id, total_amount, payment_status)
       VALUES ($1, $2, $3, $4, $5, 'mock_paid') RETURNING *`,
      [bookingRef, userName.trim(), userEmail.trim().toLowerCase(), eventId, total]
    );
    for (const seat of seatResult.rows) {
      await client.query(
        'INSERT INTO booking_seats (booking_id, seat_id, price) VALUES ($1, $2, $3)',
        [booking.rows[0].id, seat.id, price]
      );
    }
    await client.query("UPDATE seats SET status = 'booked' WHERE id = ANY($1::int[])", [uniqueSeatIds]);
    await client.query('COMMIT');
    res.status(201).json({
      message: 'Demo booking confirmed. No real payment was processed.',
      booking: { ...booking.rows[0], seats: seatResult.rows.map(s => s.seat_label), price_per_seat: price }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

async function getBookings(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT b.*, e.title AS event_title, e.event_date, e.venue,
        ARRAY_AGG(s.seat_label ORDER BY s.seat_label) AS seats
      FROM bookings b
      JOIN events e ON e.id = b.event_id
      JOIN booking_seats bs ON bs.booking_id = b.id
      JOIN seats s ON s.id = bs.seat_id
      GROUP BY b.id, e.title, e.event_date, e.venue
      ORDER BY b.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) { next(error); }
}

module.exports = { createBooking, getBookings };
