const router = require('express').Router();
const { createBooking, getBookings } = require('../controllers/bookingsController');

router.get('/', getBookings);
router.post('/', createBooking);

module.exports = router;
