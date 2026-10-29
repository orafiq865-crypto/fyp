// Educational dynamic-pricing example. Never trust client-submitted prices.
function calculateTicketPrice(basePrice, occupiedSeats, capacity, recentBookings = 0) {
  const occupancy = capacity > 0 ? occupiedSeats / capacity : 0;
  const occupancyMultiplier = 1 + Math.min(0.35, occupancy * 0.35);
  const velocityMultiplier = 1 + Math.min(0.15, recentBookings * 0.015);
  return Math.round(Number(basePrice) * occupancyMultiplier * velocityMultiplier);
}

module.exports = { calculateTicketPrice };
