const { DataTypes } = require("sequelize")
const db = require('../db')
const Event = db.define(
    'event',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.ENUM('sports', 'arts', 'education', 'entertainment', 'recreation'),
            allowNull: false
        },
        creator_id: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    }
)
module.exports = Event