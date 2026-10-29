const router = require('express').Router();
const { getEvents, getEventById, getSeats } = require('../controllers/eventsController');

router.get('/', getEvents);
router.get('/:id/seats', getSeats);
router.get('/:id', getEventById);

module.exports = router;
