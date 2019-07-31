const express = require('express');
const postDb = require('./postDb');
const router = express.Router();

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

router.delete('/:id', validatePostId, (req, res) => {});

router.put('/:id', validatePostId, (req, res) => {});

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
        message: 'Could not find a Post by that id.'
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      err
    });
  }
}

module.exports = router;
