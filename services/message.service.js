const { Message } = require('../models');

// GET ALL MESSAGES FOR AN EVENT
exports.getEventMessagesService = async (eventId, limit = 50) => {
  const messages = await Message.findAll({
    where: { event_id: eventId },
    include: {
      association: 'sender',
      attributes: ['id', 'username'],
    },
    order: [['createdAt', 'ASC']],
    limit,
  });
  return messages;
};

// CREATE MESSAGE
exports.createMessageService = async (userId, eventId, content) => {
  const message = await Message.create({
    content,
    user_id: userId,
    event_id: eventId,
  });

  return await Message.findByPk(message.id, {
    include: {
      association: 'sender',
      attributes: ['id', 'username'],
    },
  });
};

// DELETE MESSAGE
exports.deleteMessageService = async (messageId, userId) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    return null;
  }

  if (message.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  await message.destroy();
  return true;
};

// EDIT MESSAGE
exports.updateMessageService = async (messageId, userId, newContent) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    return null;
  }

  if (message.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  await message.update({ content: newContent });
  return message;
};