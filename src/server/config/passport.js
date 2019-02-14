import passport from 'passport';
import mongoose from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';

const User = mongoose.model('User');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new Strategy(opts, (jwtPayload, done) => {
  User.findOne({ id: jwtPayload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));
