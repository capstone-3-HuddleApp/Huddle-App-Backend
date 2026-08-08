const express = require("express");
const router = express.Router();
const eventController = require('../controllers/event.controller')

//READ - Get /api/users/:userId/events
//returns all the events a user is participating in
router.get('/:userId/events', eventController.getUserAttendEvents);

// CREATE — POST /api/users/:userId/events
//Add user to event 
router.post('/:userId/events', eventController.addUserToEvent);




module.exports = router;
