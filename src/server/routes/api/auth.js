import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';

const User = mongoose.Schema('User');
const router = express.Router();

router.use('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'something is not right'
      });
    }

    return req.login(user, { session: false }, (loginErr) => {
      if (loginErr) {
        return res.send(loginErr);
      }

      const token = null;
      return res.json({ user: token });
    });
  })(req, res);
});
