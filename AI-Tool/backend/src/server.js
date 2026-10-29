require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', app: 'SeatFlow API' });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Database connection failed. Check backend/.env.' });
  }
});
app.use('/api/events', require('./routes/events'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error. Check the backend terminal for details.' });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`SeatFlow API running at http://localhost:${port}`));
