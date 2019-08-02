const server = require('./server');
require('dotenv').config();

const port = process.env.PORT ? process.env.PORT : 5000;

server.listen(port, () => {
  console.log(`listening on port ${port}.`);
});
