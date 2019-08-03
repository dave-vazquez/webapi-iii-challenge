const express = require('express');
const postsRouter = require('./posts/postRouter');
const usersRouter = require('./users/userRouter');
const server = express();

const motd = process.env.MOTD ? process.env.MOTD : 'No message today';

server.use(express.json());
server.use(logger);
server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//custom middleware
function logger(req, res, next) {
  console.log(`method: ${req.method}`);
  console.log(`path: ${req.url}`);
  console.log(`time: ${new Date().toISOString()}`);
  next();
}

module.exports = server;
