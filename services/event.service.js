const { Op } = require("sequelize");
const { User, Event, EventParticipants } = require("../models");

module.exports = {
  // READ ALL EVENTS — Get all events, optionally filtered by zipcode
  async getAllEventsService(zipcode) {
    const where = {};
    if (zipcode) where.zipcode = zipcode;

    const events = await Event.findAll({
      where,
      order: [["createdAt", "DESC"]], // newest first
    });
    return events;
  },

  // READ MY EVENTS — Get all events created by a specific user
  async getMyEventsService(userId) {
    const events = await Event.findAll({
      where: { creator_id: userId },
      order: [["createdAt", "DESC"]],
    });
    return events;
  },

  // READ ONE EVENT — Get event by ID, include the users participating
  async getEventByIdService(eventId) {
    const event = await Event.findByPk(eventId, {
      include: {
        association: "participants",
      },
    });
    return event;
  },

  // CREATE EVENT
  async createEventService(eventData, creatorId) {
    const event = await Event.create({
      ...eventData,
      creator_id: creatorId,
    });
    return event;
  },

  // UPDATE EVENT (full) — client sends EVERY field
  async updateEventService(eventId, userId, updates) {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return null;
    }

    if (event.creator_id !== userId) {
      throw new Error("Unauthorized");
    }

    await event.update(updates);
    return event;
  },

  // UPDATE EVENT (partial) — change only the fields sent
  // Only copy over fields we allow, so nobody can change columns we didn't intend (like id or creator_id).
  async partialUpdateEventService(eventId, userId, requestBody) {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return null;
    }

    if (event.creator_id !== userId) {
      throw new Error("Unauthorized");
    }

    const allowed = [
      "name",
      "description",
      "category",
      "time",
      "address",
      "zipcode",
      "facilities_id",
    ];
    const updates = {};

    for (const field of allowed) {
      if (field in requestBody) {
        updates[field] = requestBody[field];
      }
    }

    await event.update(updates);
    return event;
  },

  // DELETE EVENT
  async deleteEventService(eventId, userId) {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return false;
    }

    if (event.creator_id !== userId) {
      throw new Error("Unauthorized");
    }

    await event.destroy();
    return true;
  },

  /**
   * $$$-Funtion Creation: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Most Recent Change: 08/08/2026, [Md Shamin Ahsan Anaph]
   *
   * $$$-Function Description:
   *    Adds user to an event using the userId and eventId
   * (the eventId should be in the body)
   *
   * $$$-Component Using This Function:
   *    event controller uses this function
   *
   * $$$-Description of Variables:
   *    user and event are the objects retured by sequalize query using id
   *    existing is a row in the eventParticipants table
   * */
  async addUserToEvent(userId, eventId) {
    const user = await User.findByPk(userId);
    const event = await Event.findByPk(eventId);

    if (!user || !event) {
      throw new Error("User or Event not found");
    }

    // Check if user already in event
    const existing = await EventParticipants.findOne({
      where: { user_id: userId, event_id: eventId },
    });

    if (existing) {
      throw new Error("User is already participating in this event");
    }

    //add user to the event
    // (addParticipants is a auto generated sequalize fucntion
    // created by using the as: participants in belongs to many)
    return await event.addParticipants(user);
  },

  async getUserAttendEvents(userId) {
    const user = await User.findByPk(userId, {
      include: {
        association: "participatingEvents",
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.participatingEvents;
  },
};
