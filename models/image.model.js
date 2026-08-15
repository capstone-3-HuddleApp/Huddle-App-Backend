const { DataTypes } = require("sequelize");
const db = require("../db");

const Image = db.define("image", {
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM("profile", "event"),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "events",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Image;
