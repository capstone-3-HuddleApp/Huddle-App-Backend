const { Op } = require("sequelize");
const { User, Event, EventParticipants } = require("../models");

module.exports = {
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
