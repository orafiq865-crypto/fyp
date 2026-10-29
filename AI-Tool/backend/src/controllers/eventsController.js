const pool = require('../config/db');
const { calculateTicketPrice } = require('../utils/pricing');

async function getEvents(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT e.*,
        COUNT(s.id)::int AS total_seats,
        COUNT(s.id) FILTER (WHERE s.status = 'booked')::int AS booked_seats
      FROM events e
      LEFT JOIN seats s ON s.event_id = e.id
      GROUP BY e.id
      ORDER BY e.event_date ASC
    `);
    const events = result.rows.map((event) => {
      const occupied = Number(event.booked_seats || 0);
      const capacity = Number(event.total_seats || event.capacity);
      return {
        ...event,
        current_price: calculateTicketPrice(event.base_price, occupied, capacity, Math.floor(occupied / 4)),
        occupancy_percent: capacity ? Math.round((occupied / capacity) * 100) : 0
      };
    });
    res.json(events);
  } catch (error) { next(error); }
}

async function getEventById(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT e.*,
        COUNT(s.id)::int AS total_seats,
        COUNT(s.id) FILTER (WHERE s.status = 'booked')::int AS booked_seats
      FROM events e LEFT JOIN seats s ON s.event_id = e.id
      WHERE e.id = $1 GROUP BY e.id
    `, [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Event not found.' });
    const event = result.rows[0];
    event.current_price = calculateTicketPrice(
      event.base_price, Number(event.booked_seats || 0),
      Number(event.total_seats || event.capacity), Math.floor(Number(event.booked_seats || 0) / 4)
    );
    res.json(event);
  } catch (error) { next(error); }
}

async function getSeats(req, res, next) {
  try {
    const event = await pool.query('SELECT id, base_price, capacity FROM events WHERE id = $1', [req.params.id]);
    if (!event.rowCount) return res.status(404).json({ message: 'Event not found.' });
    const seatResult = await pool.query(
      'SELECT id, seat_label, seat_type, status FROM seats WHERE event_id = $1 ORDER BY seat_label',
      [req.params.id]
    );
    const booked = seatResult.rows.filter(s => s.status === 'booked').length;
    const price = calculateTicketPrice(event.rows[0].base_price, booked, seatResult.rows.length || event.rows[0].capacity, Math.floor(booked / 4));
    res.json({ seats: seatResult.rows, price_per_seat: price });
  } catch (error) { next(error); }
}

module.exports = { getEvents, getEventById, getSeats };
