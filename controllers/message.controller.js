const {
  getEventMessagesService,
  createMessageService,
  deleteMessageService,
  updateMessageService,
} = require('../services/message.service');

// Every handler is async because DB calls take time (we await them).
// If a call fails, catch hands the error to next(err) -> the error handler in
// app.js. That stops one bad request from crashing the whole server.

// GET ALL MESSAGES FOR AN EVENT — GET /api/messages/event/:eventId
exports.getEventMessages = async (req, res, next) => {
    console.log('hit')
  try {
    const messages = await getEventMessagesService(req.params.eventId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// CREATE MESSAGE — POST /api/messages
exports.createMessage = async (req, res, next) => {
  try {
    const { eventId, content } = req.body;

    if (!eventId || !content) {
      return res.status(400).json({
        error: 'eventId and content are required',
      });
    }

    const message = await createMessageService(req.user.id, eventId, content);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// DELETE MESSAGE — DELETE /api/messages/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const success = await deleteMessageService(req.params.id, req.user.id);

    if (!success) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(204).send();
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: 'Only the creator can delete this message' });
    }
    next(err);
  }
};

// EDIT MESSAGE — PATCH /api/messages/:id
exports.updateMessage = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const message = await updateMessageService(req.params.id, req.user.id, content);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: 'Only the creator can edit this message' });
    }
    next(err);
  }
};