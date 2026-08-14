const userService = require("../services/user.service")

//Updates editable fields for the authenticated user's own profile.
async function updateMyProfile(req, res, next) {
    try {
        const name = req.body.name?.trim();
        const username = req.body.username?.trim();

        if (!name || !username) {
            return res.status(400).json({
                error: "Display name and username are required"
            });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({
                error: "Username must be between 3 and 20 characters",
            });
        }

        const updatedUser = await userService.updateMyProfileService(
            req.user.id,
            name,
            username,
        );

        return res.json(updatedUser);
    }   catch(error) {
        if (error.message === "Username already taken"){
            return res.status(409).json({
                error: "That username is already taken",
            });
        }
        if (error.message === "User not found") {
            return res.status(404).json({
                error: "User not found",
            });
        }
        next(error);
    }
}

async function followUser(req, res, next) {
    try{
        const followerId = req.user.id;
        const followingId = req.params.userId;

        // A user should not be able to follow their own account
        if (followerId === followingId) {
            return res.status(400).json({
                error: "You cannot follow yourself",
            });
        }

       const result = await userService.followUserService(
        followerId,
        followingId,
       );

       return res.json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({
                error: "User not found"
            });
        }

        next(error);
    }
}

//Removes the logged-in users follow relationship with another user
async function unfollowUser(req, res, next) {
    try{
        const followerId = req.user.id;
        const followingId = req.params.userId;

        const result = await userService.unfollowUserService(
            followerId,
            followingId,
        );
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

async function getMyFollows(req, res, next) {
    try {
        const result = await userService.getMyFollowsService(req.user.id);

        return res.json(result);
    } catch (error) {
        if (error.message === "User not found"){
            return res.status(404).json({
                error: "User not found",
            });
        }

        next(error);
    }
}

module.exports = {
    updateMyProfile,
    followUser,
    unfollowUser,
    getMyFollows,
};