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
exports['default'] = flowTypeHandler;

var _utilsGetFlowType = require('../utils/getFlowType');

var _utilsGetFlowType2 = _interopRequireDefault(_utilsGetFlowType);

var _utilsGetPropertyName = require('../utils/getPropertyName');

var _utilsGetPropertyName2 = _interopRequireDefault(_utilsGetPropertyName);

var _utilsGetFlowTypeFromReactComponent = require('../utils/getFlowTypeFromReactComponent');

var _utilsGetFlowTypeFromReactComponent2 = _interopRequireDefault(_utilsGetFlowTypeFromReactComponent);

/**
 * This handler tries to find flow Type annotated react components and extract
 * its types to the documentation. It also extracts docblock comments which are
 * inlined in the type definition.
 */

function flowTypeHandler(documentation, path) {
  var flowTypesPath = (0, _utilsGetFlowTypeFromReactComponent2['default'])(path);

  if (!flowTypesPath) {
    return;
  }

  flowTypesPath.get('properties').each(function (propertyPath) {
    var propDescriptor = documentation.getPropDescriptor((0, _utilsGetPropertyName2['default'])(propertyPath));
    var valuePath = propertyPath.get('value');
    var type = (0, _utilsGetFlowType2['default'])(valuePath);

    if (type) {
      propDescriptor.flowType = type;
      propDescriptor.required = !propertyPath.node.optional;
    }
  });
}

module.exports = exports['default'];