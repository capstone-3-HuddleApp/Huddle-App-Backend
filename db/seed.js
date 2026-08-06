// db/seed.js — reset the tables and fill them with sample data.  Run: npm run seed
// Gives you (and your teammates) the same predictable rows to build against.
require('dotenv').config();
const { db, User, Event } = require('../models');

const seed = async () => {
  try {
    // force: true DROPS every table and recreates it empty.
    // Perfect for a seed script — never do this to real user data.
    await db.sync({ force: true });
    console.log('🌱 Database reset.');


    // Sample users. In real life these rows come from Auth0 logins (auth0Id is
    // the token's "sub"). Here we fake a couple so the users table isn't empty.
    const users = await User.bulkCreate([
      { auth0Id: 'auth0|seed-ada', username: 'ada', email: 'ada@example.com', name: 'Ada Lovelace' },
      { auth0Id: 'auth0|seed-alan', username: 'alan', email: 'alan@example.com', name: 'Alan Turing' },
    ]);
    console.log('🌱 Sample users created.');

    // Events need a real creator_id, so we pull the UUIDs off the users we
    // just created above instead of hardcoding them — hardcoded UUIDs would
    // break the moment the users table's IDs are regenerated on the next seed.
    const [ada, alan] = users;

    await Event.bulkCreate([
      {
        name: 'Community Art Fair',
        description: 'Local artists showcase paintings, sculpture, and crafts',
        category: 'arts',
        time: new Date('2026-09-12T14:00:00'),
        address: '555 West 42 Street',
        zipcode: '10036',
        creator_id: ada.id,
        facilities_id: "0004a8532521d7d9879f82f67f7fb2e5",
      },
      {
        name: 'Pickup Basketball Tournament',
        description: '3v3 tournament open to all skill levels',
        category: 'sports',
        time: new Date('2026-09-20T10:00:00'),
        address: '123 Riverside Drive',
        zipcode: '10024',
        creator_id: alan.id,
        facilities_id: "0004a8532521d7d9879f82f67f7fb2e5",
      },
      {
        name: 'Intro to Python Workshop',
        description: 'Beginner-friendly coding workshop, laptops provided',
        category: 'education',
        time: new Date('2026-09-15T18:30:00'),
        address: '10 Astor Place',
        zipcode: '10003',
        creator_id: alan.id,
        facilities_id: "0004a8532521d7d9879f82f67f7fb2e5",
      },
      {
        name: 'Outdoor Movie Night',
        description: 'Family-friendly screening in the park, bring a blanket',
        category: 'entertainment',
        time: new Date('2026-09-18T20:00:00'),
        address: '1 Central Park West',
        zipcode: '10023',
        creator_id: ada.id,
        facilities_id: "0004a8532521d7d9879f82f67f7fb2e5",
      },
    ]);
    console.log('🌱 Sample events created.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await db.close(); // close the connection so the script can exit
    console.log('🌱 Done. Connection closed.');
  }
};

seed();