import passport from 'passport';
import mongoose from 'mongoose';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

const User = mongoose.model('User');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, callback) => User.findOne({ email }).then((user) => {
  if (!user) {
    return callback(null, false, { message: 'Incorrect email or password' });
  }

  return user.comparePassword(password).then((match) => {
    if (match) {
      return callback(null, user);
    }
    return callback(null, false, { message: 'incorrect email or password' });
  });
})));

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
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
