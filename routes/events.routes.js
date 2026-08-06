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

const router = express.Router();

// Every handler is async because DB calls take time (we await them).
// If a call fails, catch hands the error to next(err) -> the error handler in
// app.js. That stops one bad request from crashing the whole server.


// READ ALL — GET /api/events
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { zipcode } = req.query;

    const where = {};
    if (zipcode) where.zipcode = zipcode;

    const events = await Event.findAll({
      where,
      order: [['createdAt', 'DESC']], // newest first
    });
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// READ MY EVENTS — GET /api/events/mine
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const events = await Event.findAll({
      where: { creator_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// READ ONE — GET /api/events/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id); // :id comes in on req.params
    if (!event) {
      return res.status(404).json({ error: 'Event not found' }); // always handle "not found"
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// CREATE — POST /api/events
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, category, time, address, zipcode, facilities_id } = req.body;

    if (!name || !category || !time || !address || !zipcode || !facilities_id) {
      return res.status(400).json({
        error: 'name, category, time, address, zipcode, and facilities_id are required',
      });
    }

    const event = await Event.create({
      name,
      description,
      category,
      time,
      address,
      zipcode,
      facilities_id,
      creator_id: req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});
// UPDATE (full) — PUT /api/events/:id — client sends EVERY field
router.put('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can update this event' });
    }

    const { name, description, category, time, address, zipcode, facilities_id } = req.body;

    if (!name || !category || !time || !address || !zipcode || !facilities_id) {
      return res.status(400).json({
        error: 'name, category, time, address, zipcode, and facilities_id are required',
      });
    }

    await event.update({ name, description, category, time, address, zipcode, facilities_id });
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// UPDATE (partial) — PATCH /api/events/:id — change only the fields sent
router.patch('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can update this event' });
    }

    // Only copy over fields we allow, so nobody can change columns we didn't intend (like id or creator_id).
    const allowed = ['name', 'description', 'category', 'time', 'address', 'zipcode', 'facilities_id'];
    const updates = {};
    for (const field of allowed) {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    }
    await event.update(updates);
    res.json(event);
  } catch (err) {
    next(err);
  }
});


// DELETE — DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.sendStatus(204); // 204 = No Content (nothing to send back)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
