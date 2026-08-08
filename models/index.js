// models/index.js — one place to collect all models and their relationships.
// Lets the rest of the app grab them from here: const { Task } = require('./models')

const db = require('../db');
const User = require('./user.model');
const Event = require('./event.model');
const EventParticipants = require('./eventParticipants.model');
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



module.exports = { db, User, Event, EventParticipants };
