// routes/index.js — one place to collect all routers.
// Lets app.js grab them from here: const { taskRouter } = require('./routes')

const facDbRouter = require('./facilities.routes')
const eventRouter = require('./events.routes');
const authRouter = require('./auth.routes');

// Add a new resource? Import its router above and add one line here.
module.exports = {
  facDbRouter,
  eventRouter,
  authRouter
};
