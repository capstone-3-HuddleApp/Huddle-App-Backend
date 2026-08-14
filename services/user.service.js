const { Op } = require("sequelize");
const { User, UserFollows } = require("../models");

module.exports = {
    async updateMyProfileService(userId, name, username) {
        const usernameOwner = await User.findOne({
            where: {
                username,
                id: {[Op.ne]: userId},
            },
        });

        if(usernameOwner) {
            throw new Error("Username already taken");
        }

        const currentUser = await User.findByPk(userId);

        if (!currentUser) {
            throw new Error("User not found");
        }

        await currentUser.update({ name, username });

        return currentUser;
    },
    
    async followUserService(followerId, followingId) {
        const userToFollow = await User.findByPk(followingId);

        if (!userToFollow) {
            throw new Error("User not found");
        }

        await UserFollows.findOrCreate({
            where: {
                follower_id: followerId,
                following_id: followingId,
            },
        });

        return {
            message: "User followed successfully",
            following: true,
        };
    },

    async unfollowUserService(followerId, followingId) {
        await UserFollows.destroy({
            where: {
                follower_id: followerId,
                following_id: followingId,
            },
        });
        
        return {
            message: "User unfollowed successfully",
            following: false,
        };
    },

    async getMyFollowsService(userId) {
        const currentUser = await User.findByPk(userId, {
            include: [
                {
                    association: "followers",
                    attributes: ["id", "name", "username"],
                    through: {attributes: []},
                },
                {
                    association: "following",
                    attributes: ["id", "name", "username"],
                    through: {attributes: []},
                },
            ],
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        return {
            followers: currentUser.followers,
            following: currentUser.following,
            followerCount: currentUser.followers.length,
            followingCount: currentUser.following.length,
        };
    },

};