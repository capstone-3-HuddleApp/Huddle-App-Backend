const express = require("express");
const router = express.Router();
const eventController = require('../controllers/event.controller')

// CREATE — POST /api/users/:userId/event
//Add user to event 
router.post('/:userId/events', eventController.addUserToEvent);



module.exports = router;
