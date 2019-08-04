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
 *    summary: represents a user
 *    description: >
 *      This resources presents an individual user in the database.
 *      Each user is identified by a numeric `id`
 *    responses:
 *      '200':
 *        description: all users in database were returned successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                users:
 *                  type: array
 *              example:
 *                success: true
 *                users:
 *                  - id: 1
 *                    name: Frodo Baggins
 *                  - id: 2
 *                    name: Samwise Gamgee
 *                  - id: 3
 *                    name: Meriadoc Brandybuck
 *                  - id: 4
 *                    name: Peregrin Took
 *      '500':
 *        description: internal server error
 *
 *
 *
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
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

/********************************************************
 *                GET api/users/:id/posts               *
 ********************************************************/
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

module.exports = router;
