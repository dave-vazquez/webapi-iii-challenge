const express = require('express');
const postDb = require('./postDb');
const router = express.Router();
// router.use(express.json());
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

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json({
    success: true,
    post: req.post
  });
});

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

//custom middleware
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

module.exports = router;
