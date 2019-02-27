import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';

const router = express.Router();
const User = mongoose.model('User');

router.param('id', (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if (err) {
      next(err);
    } else if (user) {
      req.userTarget = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});

router.put('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  
});

router.delete('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.userTarget) {
    const { userTarget } = req;
    User.deleteOne({ id: userTarget.id });
    return res.sendStatus(200);
  }
  return res.sendStatus(401);
});

module.exports = router;
