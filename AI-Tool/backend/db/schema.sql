CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT,
  role VARCHAR(30) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  venue VARCHAR(180) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Lahore',
  event_date TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  seat_label VARCHAR(12) NOT NULL,
  seat_type VARCHAR(20) NOT NULL DEFAULT 'standard',
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  UNIQUE(event_id, seat_label),
  CHECK (status IN ('available', 'booked', 'blocked'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_ref VARCHAR(30) UNIQUE NOT NULL,
  user_name VARCHAR(120) NOT NULL,
  user_email VARCHAR(180) NOT NULL,
  event_id INTEGER NOT NULL REFERENCES events(id),
  total_amount NUMERIC(10,2) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'mock_paid',
  booking_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_seats (
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id INTEGER NOT NULL REFERENCES seats(id),
  price NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (booking_id, seat_id),
  UNIQUE(seat_id)
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_seats_event_status ON seats(event_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
