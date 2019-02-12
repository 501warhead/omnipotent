/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import mongoose from 'mongoose';

const User = mongoose.Schema({
  email: {
    type: String,
    index: true,
  },
  hash: String,
  claims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserClaim' }],
});

export default mongoose.model('User', User);
