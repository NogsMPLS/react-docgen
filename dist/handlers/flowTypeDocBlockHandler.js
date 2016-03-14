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
exports['default'] = flowTypeDocBlockHandler;

var _utilsSetPropDescription = require('../utils/setPropDescription');

var _utilsSetPropDescription2 = _interopRequireDefault(_utilsSetPropDescription);

var _utilsGetFlowTypeFromReactComponent = require('../utils/getFlowTypeFromReactComponent');

var _utilsGetFlowTypeFromReactComponent2 = _interopRequireDefault(_utilsGetFlowTypeFromReactComponent);

/**
 * This handler tries to find flow Type annotated react components and extract
 * its types to the documentation. It also extracts docblock comments which are
 * inlined in the type definition.
 */

function flowTypeDocBlockHandler(documentation, path) {
  var flowTypesPath = (0, _utilsGetFlowTypeFromReactComponent2['default'])(path);

  if (!flowTypesPath) {
    return;
  }

  flowTypesPath.get('properties').each(function (propertyPath) {
    return (0, _utilsSetPropDescription2['default'])(documentation, propertyPath);
  });
}

module.exports = exports['default'];