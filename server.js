const express = require('express');
const postsRouter = require('./posts/postRouter');
const server = express();

server.use(express.json());
server.use(logger);
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`method: ${req.method}`);
  console.log(`path: ${req.url}`);
  console.log(`time: ${new Date().toISOString}`);
  next();
}

module.exports = server;
