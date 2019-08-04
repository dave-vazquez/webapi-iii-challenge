const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const specs = require('./swaggerDoc');
const postsRouter = require('./posts/postRouter');
const usersRouter = require('./users/userRouter');
const server = express();

const motd = process.env.MOTD ? process.env.MOTD : 'No message today';

// CORS middle-Ware
server.use(cors());

// Express Middle-Ware
server.use(express.json());

// Logger Middle-Ware
server.use(logger);

// Routes
server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

// Swagger-UI Middle-Ware
server.use('/assets', express.static('assets'));
server.use(
  '/',
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    customCss: '.swagger-ui .topbar {display: none',
    customSiteTitle: 'Lambda Posts',
    customfavIcon: './assets/favicon.ico'
  })
);

/********************************************************
 *                  LOGGER MIDDLE-WARE                  *
 ********************************************************/
function logger(req, res, next) {
  console.log(`method: ${req.method}`);
  console.log(`path: ${req.url}`);
  console.log(`time: ${new Date().toISOString()}`);
  next();
}

module.exports = server;
