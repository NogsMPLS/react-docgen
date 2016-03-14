/*
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 *
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getNameOrValue;

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var types = _recast2['default'].types.namedTypes;

/**
 * If node is an Identifier, it returns its name. If it is a literal, it returns
 * its value.
 */

function getNameOrValue(path, raw) {
  var node = path.node;
  switch (node.type) {
    case types.Identifier.name:
      return node.name;
    case types.Literal.name:
      return raw ? node.raw : node.value;
    default:
      throw new TypeError('Argument must be an Identifier or a Literal');
  }
}

module.exports = exports['default'];