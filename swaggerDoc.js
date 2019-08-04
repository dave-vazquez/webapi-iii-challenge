const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const description = `

**lambda-posts** is a practice API built with [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) middleware that allows you to store, access, and update information about posts and the users that created them.

This is the work of an assignment given to students in [Lambda School's](https://go.lambdaschool.com) [Full Stack Web Development Track](https://lambdaschool.com/courses/full-stack-web-development), as a part of their Back-End curriculum.

A link to the repository for this API can be found [here](https://github.com/dave-vazquez/webapi-iii-challenge/tree/dave-vazquez).`;

const options = {
  swaggerDefinition: {
    openapi: '3.0.n',
    info: {
      title: 'lambda-posts',
      version: 'v1.0.0',
      description,
      license: {
        name: 'MIT',
        url:
          'https://github.com/dave-vazquez/webapi-iii-challenge/blob/master/LICENSE'
      }
    },
    servers: [
      {
        url: 'https://lambda-posts.herokuapp.com/api'
      }
    ]
  },
  apis: ['./users/userRouter.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
