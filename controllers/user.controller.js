const { Op } = require("sequelize");
const { User, UserFollows } = require("../models");

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

        const usernameOwner = await User.findOne({
            where:{
                username,
                id: { [Op.ne]: req.user.id },
            },
        });

        if (usernameOwner) {
            return res.status(409).json({
                error: "That username is already taken",
            });
        }

        await req.user.update({ name, username });

        return res.json(req.user);
    }   catch(error) {
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

        // Make sure the user being followed exists
        const userToFollow = await User.findByPk(followingId);

        if (!userToFollow) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        // Create the relationship only if it does not already exist
        await UserFollows.findOrCreate({
            where: {
                follower_id: followerId,
                following_id: followingId,
            },
        });

        return res.json({
            message: "User followed successfully",
            following: true,
        });
    } catch (error) {
        next(error);
    }
}

//Removes the logged-in users follow relationship with another user
async function unfollowUser(req, res, next) {
    try{
        const followerId = req.user.id;
        const followingId = req.params.userId;

        await UserFollows.destroy({
            where: {
                follower_id: followerId,
                following_id: followingId,
            },
        });

        return res.json({
            message: "User unfollowed successfully",
            following: false,
        });
    } catch (error) {
        next(error);
    }
}

async function getMyFollows(req, res, next) {
    try {
        const currentUser = await User.findByPk(req.user.id, {
            include: [
                {
                    association: "followers",
                    attributes: ["id", "name", "username"],
                    through: {attributes: [] },
                },
                {
                    association: "following",
                    attributes: ["id", "name", "username"],
                    through: {attributes: []},
                },
            ],
        });

        return res.json({
            followers: currentUser.followers,
            following: currentUser.following,
            followerCount: currentUser.followers.length,
            followingCount: currentUser.following.length,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    updateMyProfile,
    followUser,
    unfollowUser,
    getMyFollows,
};