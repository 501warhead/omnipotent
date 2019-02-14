import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';

const router = new express.Router();
const User = mongoose.model('User');

router.post('/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }


});

module.exports = router;
