const express = require("express");
const router = express.Router();
const eventController = require('../controllers/event.controller')
const userController = require("../controllers/user.controller")
const { requireAuth } = require("../middleware/auth")

//Updates only the currently authenticated user's editable profile fields
router.patch("/me", requireAuth, userController.updateMyProfile);

//Returns the logged-in users follower and following lists
router.get("/me/follows/:id", requireAuth, userController.getMyFollows);

//Returns the user search by id
router.get('/whoAmI/:id', requireAuth, userController.whoAmI)

//Creates a one-way follow relationship with another user
router.post("/:userId/follow", requireAuth, userController.followUser);

//Removes a one-way follow relationship with another user
router.delete("/:userId/follow", requireAuth, userController.unfollowUser);

//READ - Get /api/users/:userId/events
//returns all the events a user is participating in
router.get('/:userId/events', eventController.getUserAttendEvents);

// CREATE — POST /api/users/:userId/events
//Add user to event 
router.post('/:userId/events', eventController.addUserToEvent);




module.exports = router;
