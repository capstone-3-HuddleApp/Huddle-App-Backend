const { DataTypes } = require("sequelize");
const db = require('../db');

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
      type: DataTypes.ENUM('sports', 'arts', 'education', 'entertainment'),
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING, // STRING not INTEGER — zips can have leading zeros (e.g. "02134")
      allowNull: false,
      validate: {
        is: /^\d{5}(-\d{4})?$/, // matches 12345 or 12345-6789
      },
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    facilities_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
  },
);

module.exports = Event;