// models/index.js — one place to collect all models and their relationships.
// Lets the rest of the app grab them from here: const { Task } = require('./models')

const db = require('../db');
const User = require('./user.model');
const Event = require('./event.model');
const EventParticipants = require('./eventParticipants.model');
const Message = require('./message.model');
const UserFollows = require('./userFollows.model');
const Image = require('./image.model');
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

// Allows users to follow other users
User.belongsToMany(User, {
  through: UserFollows,
  as: "following",
  foreignKey: "follower_id",
  otherKey: "following_id",
});

User.belongsToMany(User, {
  through: UserFollows,
  as: "followers",
  foreignKey: "following_id",
  otherKey: "follower_id",
});

// Image ref associations

// Image belongs to User
Image.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// User has many Images
User.hasMany(Image, {
    foreignKey: 'user_id',
    as: 'images'
});

// Image belongs to Event
Image.belongsTo(Event, {
    foreignKey: 'event_id',
    as: 'event'
});

// Event has many Images
Event.hasMany(Image, {
    foreignKey: 'event_id',
    as: 'images'
});

module.exports = { db, User, Event, EventParticipants, UserFollows, Message, Image };
