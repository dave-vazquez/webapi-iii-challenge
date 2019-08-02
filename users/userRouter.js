const express = require('express');
const router = express.Router();
const userDb = require('../users/userDb');
const postDb = require('../posts/postDb');

router.get('/', (req, res) => {
  userDb.get().then(users => {
    res.status(200).json({
      success: true,
      users
    });
  });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

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

router.put('/:id', validateUserId, (req, res) => {
  const id = req.user.id;
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
      success: false, err;
    });
});

//custom middleware
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
