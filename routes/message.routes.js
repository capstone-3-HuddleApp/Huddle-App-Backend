/**
 *   Create  ->  POST    /api/messages
 *   Read    ->  GET     /api/messages/event/:eventId (all for event)
 *   Update  ->  PATCH   /api/messages/:id
 *   Delete  ->  DELETE  /api/messages/:id
 */

const express = require('express');
const { requireAuth } = require('../middleware/auth');

const {
  getEventMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/message.controller');

const router = express.Router();

// GET ALL MESSAGES FOR AN EVENT — GET /api/messages/event/:eventId
router.get('/event/:eventId', requireAuth, getEventMessages);

// CREATE MESSAGE — POST /api/messages
router.post('/', requireAuth, createMessage);

// EDIT MESSAGE — PATCH /api/messages/:id
router.patch('/:id', requireAuth, updateMessage);

// DELETE MESSAGE — DELETE /api/messages/:id
router.delete('/:id', requireAuth, deleteMessage);

module.exports = router;