
/**
 *   Create  ->  POST    /api/events
 *   Read    ->  GET     /api/events   (all)
 *               GET     /api/events/:id   (one)
 *   Update  ->  PUT     /api/events/:id
 *   Update  ->  PATCH   /api/events/:id
 *   Delete  ->  DELETE  /api/events/:id
 *

 */

const {requireAuth} = require('../middleware/auth')

const express = require('express');
const { Event } = require('../models');
const {
  getAllEvents,
  getMyEvents,
  getEventsParticipating,
  getEventById,
  createEvent,
  updateEvent,
  partialUpdateEvent,
  deleteEvent,
  getGuestEvents,
  searchEvents,
} = require('../controllers/event.controller');

const router = express.Router();


// READ ALL — GET /api/events
router.get('/', requireAuth, getAllEvents);
 
// READ MY EVENTS — GET /api/events/mine
router.get('/mine', requireAuth, getMyEvents);

router.get('/guest/:userId', requireAuth, getGuestEvents)
 
//READ EVENTS PARTICIPATING - Get /api/events/participating
router.get('/participating', requireAuth, getEventsParticipating);

// READ ONE — GET /api/events/:id
router.get('/:id', requireAuth, getEventById);
 
// CREATE — POST /api/events
router.post('/', requireAuth, createEvent);
 
// UPDATE (full) — PUT /api/events/:id — client sends EVERY field
router.put('/:id', requireAuth, updateEvent);
 
// UPDATE (partial) — PATCH /api/events/:id — change only the fields sent
router.patch('/:id', requireAuth, partialUpdateEvent);
 
// DELETE — DELETE /api/events/:id
router.delete('/:id', requireAuth, deleteEvent);

router.post('/search', requireAuth, searchEvents);
 
module.exports = router;
 
