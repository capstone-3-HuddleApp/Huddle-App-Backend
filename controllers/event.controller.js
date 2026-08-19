const eventService = require("../services/event.service");

//Export controller functions directly
module.exports = {
  // Every handler is async because DB calls take time (we await them).
  // If a call fails, catch hands the error to next(err) -> the error handler in
  // app.js. That stops one bad request from crashing the whole server.

  async searchEvents(req, res, next) {
    try {
      let { query } = req.body;

      if (!query || query.trim().length < 2) {
        return res
          .status(400)
          .json({ error: "Search term must be at least 2 characters" });
      }

      query = query.trim().slice(0, 100);
      query = query.replace(/[%_]/g, "\\$&");

      const events = await eventService.searchEvents(query);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  // READ ALL — GET /api/events
  async getAllEvents(req, res, next) {
    try {
      const { zipcode, longitude, latitude } = req.query;
      const events = await eventService.getAllEventsService(
        zipcode,
        longitude,
        latitude,
      );
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  // READ MY EVENTS — GET /api/events/mine
  async getMyEvents(req, res, next) {
    try {
      const events = await eventService.getMyEventsService(req.user.id);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  //READ Guest EVENTS — GET /api/events/guest/:userId
  async getGuestEvents(req, res, next) {
    try {
      const events = await eventService.getMyEventsService(req.params.userId);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  async getEventsParticipating(req, res, nexr) {
    try {
      const events = await eventService.getEventsParticipatingService(
        req.user.id,
      );
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  // READ ONE — GET /api/events/:id
  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventByIdService(req.params.id);
      // always handle "not found"
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (err) {
      next(err);
    }
  },

  // CREATE — POST /api/events
  async createEvent(req, res, next) {
    try {
      const {
        name,
        description,
        category,
        time,
        address,
        zipcode,
        location,
        maxParticipants,
        facilities_id,
      } = req.body;

      // maxParticipants is optional
      if (
        !name ||
        !category ||
        !time ||
        !address ||
        !zipcode ||
        !location ||
        !facilities_id
      ) {
        return res.status(400).json({
          error:
            "name, category, time, address, zipcode, location, and facilities_id are required",
        });
      }

      const event = await eventService.createEventService(
        {
          name,
          description,
          category,
          time,
          address,
          zipcode,
          location,
          maxParticipants: maxParticipants || null, // Optional, defaults to null
          facilities_id,
        },
        req.user.id,
      );
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  },

  // UPDATE (full) — PUT /api/events/:id — client sends EVERY field
  async updateEvent(req, res, next) {
    try {
      const {
        name,
        description,
        category,
        time,
        address,
        zipcode,
        facilities_id,
      } = req.body;

      if (
        !name ||
        !category ||
        !time ||
        !address ||
        !zipcode ||
        !facilities_id
      ) {
        return res.status(400).json({
          error:
            "name, category, time, address, zipcode, and facilities_id are required",
        });
      }

      const event = await eventService.updateEventService(
        req.params.id,
        req.user.id,
        {
          name,
          description,
          category,
          time,
          address,
          zipcode,
          facilities_id,
        },
      );

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (err) {
      if (err.message === "Unauthorized") {
        return res
          .status(403)
          .json({ error: "Only the creator can update this event" });
      }
      next(err);
    }
  },

  // UPDATE (partial) — PATCH /api/events/:id — change only the fields sent
  async partialUpdateEvent(req, res, next) {
    try {
      const event = await eventService.partialUpdateEventService(
        req.params.id,
        req.user.id,
        req.body,
      );

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (err) {
      if (err.message === "Unauthorized") {
        return res
          .status(403)
          .json({ error: "Only the creator can update this event" });
      }
      next(err);
    }
  },

  // DELETE — DELETE /api/events/:id
  async deleteEvent(req, res, next) {
    try {
      const success = await eventService.deleteEventService(
        req.params.id,
        req.user.id,
      );

      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(204).send(); // 204 = No Content — deleted, nothing to return
    } catch (err) {
      if (err.message === "Unauthorized") {
        return res
          .status(403)
          .json({ error: "Only the creator can delete this event" });
      }
      next(err);
    }
  },

  /**
   * $$$-Funtion Creation: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Most Recent Change: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Function Description:
   *    Adds user to an event using the userId and eventId
   * (the eventId should be in the body)
   * $$$-Component Using This Function:
   *    Post /api/events/:id endpoint uses this function to addEvents
   * $$$-Description of Variables:
   *    userId is the uid from the query params
   *    eventId is a number passed from the req body
   *
   * */
  async addUserToEvent(req, res, next) {
    try {
      const { userId } = req.params;
      const { eventId } = req.body;

      const result = await eventService.addUserToEvent(userId, eventId);

      res.status(200).json({
        success: true,
        message: "User added to event successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * $$$-Funtion Creation: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Most Recent Change: 08/08/2026, [Md Shamin Ahsan Anaph]
   * $$$-Function Description:
   *    Gets all events a user is participating in
   * $$$-Component Using This Function:
   *    Get /api/events/:userId endpoint uses this function
   * $$$-Description of Variables:
   *    userId is the uid from the query params
   */
  async getUserAttendEvents(req, res, next) {
    try {
      const { userId } = req.params;

      const result = await eventService.getUserAttendEvents(userId);

      res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
