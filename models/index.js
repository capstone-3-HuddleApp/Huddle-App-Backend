// models/index.js — one place to collect all models and their relationships.
// Lets the rest of the app grab them from here: const { Task } = require('./models')

const db = require('../db');
const User = require('./user.model');
const Event = require('./event.model');
const EventParticipants = require('./eventParticipants.model');
const Message = require('./message.model');
// ---------- associations ----------

// Ownership
User.hasMany(Event, { foreignKey: 'creator_id', as: 'createdEvents' })
Event.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' })

// Participation (many-to-many)
User.belongsToMany(Event, {
  through: EventParticipants,
  foreignKey: 'user_id',
  otherKey: 'event_id',
  as: 'participatingEvents'
})
Event.belongsToMany(User, {
  through: EventParticipants,
  foreignKey: 'event_id',
  otherKey: 'user_id',
  as: 'participants'
})

//message associations
Message.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'sender',
})

Message.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event'
});

User.hasMany(Message, {
  foreignKey: 'user_id',
  as: 'messages'
});

Event.hasMany(Message, {
  foreignKey: 'event_id',
  as: 'messages',
})


module.exports = { db, User, Event, EventParticipants, Message };
