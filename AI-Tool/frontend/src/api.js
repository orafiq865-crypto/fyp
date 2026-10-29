const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const demoEvents = [
  {
    id: 'demo-1',
    title: 'Neon Nights Music Festival',
    category: 'Music',
    venue: 'Arena Stadium',
    city: 'Lahore',
    event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    description: 'An unforgettable live music experience with artists, lights, and a high-energy crowd.',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
    base_price: 3500,
    capacity: 60
  },
  {
    id: 'demo-2',
    title: 'Champions League Final',
    category: 'Sports',
    venue: 'City Sports Ground',
    city: 'Lahore',
    event_date: new Date(Date.now() + 21 * 86400000).toISOString(),
    description: 'Catch the big match live with an electric stadium atmosphere.',
    image_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    base_price: 2500,
    capacity: 60
  },
  {
    id: 'demo-3',
    title: 'Future Tech Summit',
    category: 'Conference',
    venue: 'Expo Convention Centre',
    city: 'Lahore',
    event_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    description: 'A full day of technology talks, networking, and product showcases.',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    base_price: 1800,
    capacity: 60
  }
];

let demoMode = true;
const demoBookings = [];
const bookedSeatIds = new Set();

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function withDemoFallback(liveRequest, demoRequest) {
  if (demoMode) return demoRequest();

  try {
    return await liveRequest();
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    demoMode = true;
    return demoRequest();
  }
}

function eventSeats(event) {
  return Array.from({ length: 60 }, (_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 10));
    const seatNumber = (index % 10) + 1;
    const id = Number(event.id.slice(-1)) * 100 + index + 1;
    return {
      id,
      seat_label: `${row}${String(seatNumber).padStart(2, '0')}`,
      seat_type: seatNumber <= 2 || seatNumber >= 9 ? 'premium' : 'standard',
      status: bookedSeatIds.has(id) ? 'booked' : 'available'
    };
  });
}

function demoPrice(basePrice, occupied, capacity) {
  const occupancy = capacity > 0 ? occupied / capacity : 0;
  return Math.round(Number(basePrice) * (1 + Math.min(0.35, occupancy * 0.35)));
}

function getDemoEvents() {
  return demoEvents.map((event) => {
    const occupied = eventSeats(event).filter((seat) => seat.status === 'booked').length;
    return {
      ...event,
      total_seats: event.capacity,
      booked_seats: occupied,
      current_price: demoPrice(event.base_price, occupied, event.capacity),
      occupancy_percent: Math.round((occupied / event.capacity) * 100)
    };
  });
}

function getDemoSeats(eventId) {
  const event = demoEvents.find((item) => item.id === eventId);
  if (!event) throw new Error('Event not found.');
  const seats = eventSeats(event);
  const booked = seats.filter((seat) => seat.status === 'booked').length;
  return { seats, price_per_seat: demoPrice(event.base_price, booked, event.capacity) };
}

export const isDemoMode = () => demoMode;
export const retryLiveApi = () => { demoMode = false; };

export const getEvents = () => withDemoFallback(
  () => request('/events'),
  () => getDemoEvents()
);

export const getSeats = (eventId) => withDemoFallback(
  () => request(`/events/${eventId}/seats`),
  () => getDemoSeats(eventId)
);

export const createBooking = (payload) => withDemoFallback(
  () => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  () => {
    const { eventId, seatIds, userName, userEmail } = payload;
    if (!eventId || !Array.isArray(seatIds) || seatIds.length < 1 || !userName?.trim() || !userEmail?.trim()) {
      throw new Error('Event, seats, name, and email are required.');
    }
    if (seatIds.length > 10) throw new Error('You can book up to 10 seats at a time.');
    if (new Set(seatIds).size !== seatIds.length) throw new Error('Duplicate seats are not allowed.');

    const { seats, price_per_seat: price } = getDemoSeats(eventId);
    const selected = seats.filter((seat) => seatIds.includes(seat.id));
    if (selected.length !== seatIds.length || selected.some((seat) => seat.status !== 'available')) {
      throw new Error('One or more seats are no longer available. Refresh and try again.');
    }

    selected.forEach((seat) => bookedSeatIds.add(seat.id));
    const booking = {
      booking_ref: `SF-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      seats: selected.map((seat) => seat.seat_label),
      total_amount: price * selected.length
    };
    demoBookings.push(booking);
    return { booking };
  }
);

export const getAdminOverview = () => withDemoFallback(
  () => request('/admin/overview'),
  () => {
    const booked = bookedSeatIds.size;
    const total = demoEvents.reduce((sum, event) => sum + event.capacity, 0);
    return {
      bookings: demoBookings.length,
      revenue: demoBookings.reduce((sum, booking) => sum + booking.total_amount, 0),
      occupancy_percent: total ? Math.round((booked / total) * 100) : 0,
      events: demoEvents.length
    };
  }
);
