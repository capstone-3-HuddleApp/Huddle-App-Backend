const { DataTypes } = require("sequelize");
const db = require("../db");

const Message = db.define(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT, // TEXT for longer messages
      allowNull: false,
      validate: {
        notEmpty: true, // Can't be empty string
        len: [1, 3000], // Min 1 char, max 3000
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // Foreign key to User table
        key: "id",
      },
      onDelete: "CASCADE", // If user deleted, delete their messages
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events", // Foreign key to Event table
        key: "id",
      },
      onDelete: "CASCADE", // If event deleted, delete its messages
    }
  },
  {
    tableName: "Messages",
    timestamps: true, // Auto-manages createdAt/updatedAt
    indexes: [
      {
        fields: ["event_id"], // Speed up queries by event
      },
      {
        fields: ["user_id"], // Speed up queries by user
      },
      {
        fields: ["event_id", "createdAt"], // Optimize "get messages for event"
      },
    ],
  },
);

module.exports = Message