/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const User = new mongoose.Schema({
  email: {
    type: String,
    index: true,
  },
  hash: String,
  claims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserClaim' }],
});

User.methods.setPassword = password => {
  bcrypt.hash(password, saltRounds).then(hash => {
    this.hash = hash;
  });
};

User.methods.validatePassword = password => {
  let valid = false;
  bcrypt.compare(password, this.hash).then(match => {
    valid = match;
  });
  return valid;
};

export default mongoose.model('User', User);
