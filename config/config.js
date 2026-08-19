require('dotenv').config();

const config = {
  dialect: 'postgres',
  url: process.env.DATABASE_URL, // Neon connection string from .env
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
};

module.exports = {
  development: config,
  production: config,
};