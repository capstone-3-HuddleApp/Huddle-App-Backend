const express = require("express");
const router = express.Router();
const eventController = require('../controllers/event.controller')


router.post('/:userId', eventController.addUserToEvent);



module.exports = router;
