const express = require('express');
const postDb = require('./postDb');
const router = express.Router();

/********************************************************
 *                      GET api/posts                   *
 ********************************************************/
/**
 * @swagger
 * /api/posts:
 *  get:
 *    tags:
 *      - posts
 *    summary: Represents all posts in the database.
 *    description: >
 *      This resources presents all **posts** in the database.
 *    responses:
 *      '200':
 *        description: All **posts** in database were returned successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostList'
 *      '500':
 *        description: Internal Server Error.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServerError'
 */

router.get('/', (req, res) => {
  postDb
    .get()
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
 *                    GET api/posts/:id                 *
 ********************************************************/

/**
 * @swagger
 * /api/posts/{id}:
 *  get:
 *    tags:
 *      - posts
 *    summary: Represents a single post.
 *    description: >
 *      This resources presents an individual **post** in the database.
 *      The **post** is identified by a numeric `id`.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id of the **post** to return.
 *    responses:
 *      '200':
 *        description: A **post** was returned successfuly.
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
 *        description: A **post** by the specified id was not found.
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
router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json({
    success: true,
    post: req.post
  });
});

/********************************************************
 *                    PUT api/posts/:id                 *
 ********************************************************/

/**
 * @swagger
 * /api/posts/{id}:
 *  put:
 *    tags:
 *      - posts
 *    summary: Updates an existing post.
 *    description: >
 *      This request updates an existing **post** in the database.
 *      The post is identified by a numeric `id`.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id` of the **post**
 *    requestBody:
 *      description: Represents a new **post** defined by a single `text` field to replace the *existing* **post**.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewPost'
 *    responses:
 *      '200':
 *        description: The **user** was succesfully updated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatedPost'
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

router.put('/:id', validatePostId, validateRequestBody, (req, res) => {
  const id = req.params.id;
  const post = req.body;

  res.status(200);
  postDb
    .update(id, post)
    .then(post => {
      res.status(200).json({
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
 *                  DELETE api/posts/:id                *
 ********************************************************/

/**
 * @swagger
 * /api/posts/{id}:
 *  delete:
 *    tags:
 *      - posts
 *    summary: Removes a post from the database.
 *    description: >
 *      This request removes an existing **post** from the database.
 *      The **post** is identified by a numeric `id`.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric `id` of the **post**.
 *    responses:
 *      '200':
 *        description: The **post** was successfully removed from the database.
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

router.delete('/:id', validatePostId, (req, res) => {
  const id = req.post.id;
  postDb
    .remove(id)
    .then(post => {
      res.status(200).json({
        success: true,
        post
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: 'Could not remove post.'
      });
    });
});

/********************************************************
 *                      MIDDLE-WARE                     *
 ********************************************************/
async function validatePostId(req, res, next) {
  try {
    const id = req.params.id;
    const post = await postDb.getById(id);

    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({
        success: false,
        message: 'Could not find a post by that id.'
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      err
    });
  }
}

function validateRequestBody(req, res, next) {
  const post = req.body;

  if (!post.text || !post.user_id) {
    res.status(400).json({
      success: false,
      message: 'Please provide text and a user id.'
    });
  } else {
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
 *    PostList:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        posts:
 *          type: array
 *          example:
 *            - id: 1
 *              text: I wish the ring had never come to me. I wish none of this had happened.
 *              user_id: 1
 *            - id: 2
 *              text: I think we should get off the road. Get off the road! Quick!
 *              user_id: 1
 *            - id: 3
 *              text: Our business is our own.
 *              user_id: 1
 *            - id: 4
 *              text: Can you protect me from yourself?
 *              user_id: 2
 *    Post:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        post:
 *          type: object
 *          example:
 *            id: 1
 *            name: I wish the ringer had never come to me. I wish none of this had happened.
 *            user_id: 1
 *
 *    RemovedPost:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        post:
 *          type: integer
 *          example:
 *            id: 1
 *
 *    UpdatedPost:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: true
 *        post:
 *          type: integer
 *          example: 1
 *
 *    NewPost:
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
 *    NotFoundError:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *          example: false
 *        message:
 *          type: string
 *          example: A post by that id was not found.
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
 */

module.exports = router;
