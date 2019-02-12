/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import mongoose from 'mongoose';

const UserClaim = mongoose.Schema({
  type: {
    type: String,
    index: true,
  },
  value: {
    type: String,
  },
});

export default mongoose.model('UserClaim', UserClaim);
