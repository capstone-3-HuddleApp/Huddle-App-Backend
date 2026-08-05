const { DataTypes } = require("sequelize")
const db = require('../db')

const EventParticipants = db.define(
    'event_participants',
    {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        joined_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'event_id']
            }
        ]
    }
)

module.exports = EventParticipants