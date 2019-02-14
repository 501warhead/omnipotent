import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;
const SALT_WORK_FACTOR = 10;

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: {
    type: String
  },
  resetToken: {
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Number
  },
  claims: [{ type: String }]
});

const reasons = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

User.statics.failedLogin = reasons;

User.virtual('isLocked').get(() => !!(this.lockUntil && this.lockUntil > Date.now()));

User.methods.comparePassword = (password, callback) => {
  bcrypt.compare(password, this.hash, (err, isMatch) => {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
};

User.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    return bcrypt.hash(user.password, salt, (lerr, hash) => {
      if (lerr) return next(lerr);

      user.password = hash;
      return next();
    });
  });
});

User.methods.incLoginAttempts = (callback) => {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, callback);
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, callback);
};

User.statics.getAuthenticated = (username, password, callback) => {
  this.findOne({ username }, (err, user) => {
    if (err) return callback(err);

    if (!user) {
      return callback(null, null, reasons.NOT_FOUND);
    }

    if (user.isLocked) {
      return user.incLoginAttempts((lerr) => {
        if (lerr) return callback(lerr);
        return callback(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    return User.comparePassword(password, (cErr, isMatch) => {
      if (cErr) return callback(cErr);

      if (isMatch) {
        if (!user.loginAttempts && !user.lockUntil) return callback(null, user);

        const updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };
        return user.update(updates, (llerr) => {
          if (llerr) return callback(llerr);
          return callback(null, user);
        });
      }

      return user.incLoginAttempts((logErr) => {
        if (logErr) return callback(logErr);
        return callback(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
};

module.exports = mongoose.model('User', User);
