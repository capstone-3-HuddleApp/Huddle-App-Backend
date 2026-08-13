const { DataTypes } = require("sequelize");
const db = require("../db");

// Connects the user doing the following to the user being followed
const UserFollows = db.define(
    "user_follows",
    {
        follower_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        following_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                //Prevents the same user from following another user more than once.
                unique: true,
                fields: ["follower_id", "following_id"],
            },
        ],
    },
);

module.exports = UserFollows;