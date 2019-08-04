const express = require('express');
const router = express.Router();
const userDb = require('./userDb');
const postDb = require('../posts/postDb');

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *      - users
 *    summary: Represents all users in the database.
 *    description: >
 *      This resources presents all users in the database.
 *      Each user is identified by a number `id`.
 *    responses:
 *      '200':
 *        description: All users in database were returned successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserList'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */
router.get('/', (req, res) => {
  userDb.get().then(users => {
    res.status(200).json({
      success: true,
      users
    });
  });
});

/********************************************************
 *                   GET api/users/:id                  *
 ********************************************************/

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    tags:
 *      - users
 *    summary: Represents a single user.
 *    description: >
 *      This resources presents an individual **user** in the database.
 *      The user is identified by a numeric `id`
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id of the **user** to get
 *    responses:
 *      '200':
 *        description: A **user** was returned successfuly.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example:
 *              success: true
 *              users:
 *                id: 11
 *                name: Dave Vazquez
 *      '404':
 *        description: A **user** by the specified id was not found.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NotFoundError'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

/********************************************************
 *                GET api/users/:id/posts               *
 ********************************************************/

/**
 * @swagger
 * /users/{id}/posts:
 *  get:
 *    tags:
 *      - users
 *    summary: Represents all posts created by a specified user.
 *    description: >
 *      This resources presents all **posts** created by a single **user** in the database.
 *      The user is identified by a numeric `id`.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id` of the **user**
 *    responses:
 *      '200':
 *        description: All **posts** were returned successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *            example:
 *              success: true
 *              posts:
 *                - id: 41
 *                  text: ayo whaddup
 *                  postedBy: "Dave Vazquez"
 *                - id: 42
 *                  text: chillin
 *                  postedBy: "Dave Vazquez"
 *      '404':
 *        description: A **user** by the specified `id` was not found.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NotFoundError'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */
router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.user.id;

  userDb
    .getUserPosts(id)
    .then(posts => {
      res.status(200).json({
        success: true,
        posts
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/********************************************************
 *                    POST api/users/                   *
 ********************************************************/

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *      - users
 *    summary: Adds a new user to the database.
 *    description: >
 *      This request adds a new **user** to the database.
 *    requestBody:
 *      description: Represents a new **user** defined by a single `name` field.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewUser'
 *    responses:
 *      '201':
 *        description: A new **user** was created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '400':
 *        description: The request body is invalid.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BadRequestError'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */
router.post('/', validateUser, (req, res) => {
  userDb
    .insert(req.user)
    .then(user => {
      res.status(201).json({
        success: true,
        user
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/********************************************************
 *                POST api/users/:id/posts              *
 ********************************************************/

/**
 * @swagger
 * /users/{id}/posts:
 *  post:
 *    tags:
 *      - users
 *    summary: Adds a new post to the database.
 *    description: >
 *      This request adds a new **post** to the database created by a **user**.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id` of the **user**
 *    requestBody:
 *      description: Represents a new **post** defined by a single `text` field.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewPostBody'
 *    responses:
 *      '201':
 *        description: A new **post** was successfully created.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewPostResponse'
 *      '400':
 *        description: The request body is invalid.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BadRequestErrorNewPost'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */

router.post('/:id/posts', validatePost, (req, res) => {
  const user_id = req.params.id;
  const text = req.post.text;

  postDb
    .insert({
      text,
      user_id
    })
    .then(post => {
      res.status(201).json({
        success: true,
        post
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/********************************************************
 *                    PUT api/users/:id                 *
 ********************************************************/

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    tags:
 *      - users
 *    summary: Updates an existing user.
 *    description: >
 *      This request updates an existing **user** in the database.
 *      The user is identified by a numeric `id`.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id` of the **user**
 *    requestBody:
 *      description: Represents a new **user** defined by a single `name` field to replace the *existing* **user**.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewUser'
 *    responses:
 *      '200':
 *        description: The **user** was succesfully updated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatedUser'
 *      '400':
 *        description: The request body is invalid.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BadRequestErrorNewUser'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  userDb
    .update(id, user)
    .then(user => {
      res.status(200).json({
        success: true,
        user
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/********************************************************
 *                  DELETE api/users/:id                *
 ********************************************************/

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    tags:
 *      - users
 *    summary: Removes a user from the database.
 *    description: >
 *      This request removes an existing users from the database.
 *      The user is identified by a numeric `id`.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id` of the **user**.
 *    responses:
 *      '200':
 *        description: The user was successfully removed from the database.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RemovedUser'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.user.id;

  userDb
    .remove(id)
    .then(user => {
      res.status(200).json({
        success: true,
        user
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/********************************************************
 *                      MIDDLE-WARE                     *
 ********************************************************/
async function validateUserId(req, res, next) {
  try {
    const id = req.params.id;
    const user = await userDb.getById(id);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({
        success: false,
        message: 'Could not find a user by that id.'
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      err
    });
  }
}

function validateUser(req, res, next) {
  const user = req.body;

  if (!user.name) {
    res.status(400).json({
      success: false,
      message: 'Please provide a name for the user.'
    });
  } else {
    req.user = user;
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  if (!post.text) {
    res.status(400).json({
      success: false,
      message: 'Please provide text for the post.'
    });
  } else {
    req.post = post;
    next();
  }
}

/********************************************************
 *                  SWAGGER COMPONENTS                  *
 ********************************************************/

/**
 * @swagger
 * components:
 *  schemas:
 *    UserList:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        users:
 *          type: array
 *          example:
 *            - id: 1
 *              name: Frodo Baggins
 *            - id: 2
 *              name: Samwise Gamgee
 *            - id: 3
 *              name: Meriadoc Brandybuck
 *            - id: 4
 *              name: Peregrin Took
 *    User:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        user:
 *          type: object
 *          example:
 *            id: 11
 *            name: Dave Vazquez
 *
 *    RemovedUser:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        user:
 *          type: integer
 *          example:
 *            id: 13
 *
 *    UpdatedUser:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        user:
 *          type: integer
 *          example: 11
 *
 *    NewUser:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          example: Mac Demarco
 *
 *    NewPostBody:
 *      type: object
 *      properties:
 *        text:
 *          type: string
 *          example: This is a new post.
 *
 *    Posts:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        user:
 *          type: object
 *          example:
 *
 *    NewPostResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        post:
 *          type: object
 *          example:
 *            id: 43,
 *            text: This is a new post.
 *            user_id: 11
 *
 *    NotFoundError:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: A user by that id was not found.
 *
 *    BadRequestError:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: Please provide a name for the user.
 *
 *    BadRequestErrorNewPost:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: Please provide text for the post.
 *
 *    BadRequestErrorNewUser:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: Please provide a name for the user.
 *
 *    ServerError:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        err:
 *          type: object
 *          example: // error object returned by database
 */

module.exports = router;
