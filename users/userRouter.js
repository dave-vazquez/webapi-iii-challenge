const express = require('express');
const router = express.Router();
const userDb = require('../users/userDb');

router.post('/', (req, res) => {});

router.post('/:id/posts', (req, res) => {});

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

router.get('/:id/posts', (req, res) => {});

router.delete('/:id', (req, res) => {});

router.put('/:id', (req, res) => {});

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

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
