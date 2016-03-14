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

var _getPropertyName = require('./getPropertyName');

var _getPropertyName2 = _interopRequireDefault(_getPropertyName);

var _utilsGetTypeAnnotation = require('../utils/getTypeAnnotation');

var _utilsGetTypeAnnotation2 = _interopRequireDefault(_utilsGetTypeAnnotation);

var _utilsGetMemberValuePath = require('../utils/getMemberValuePath');

var _utilsGetMemberValuePath2 = _interopRequireDefault(_utilsGetMemberValuePath);

var _utilsIsReactComponentClass = require('../utils/isReactComponentClass');

var _utilsIsReactComponentClass2 = _interopRequireDefault(_utilsIsReactComponentClass);

var _utilsIsStatelessComponent = require('../utils/isStatelessComponent');

var _utilsIsStatelessComponent2 = _interopRequireDefault(_utilsIsStatelessComponent);

var _utilsIsUnreachableFlowType = require('../utils/isUnreachableFlowType');

var _utilsIsUnreachableFlowType2 = _interopRequireDefault(_utilsIsUnreachableFlowType);

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var _utilsResolveToValue = require('../utils/resolveToValue');

var _utilsResolveToValue2 = _interopRequireDefault(_utilsResolveToValue);

var types = _recast2['default'].types.namedTypes;

/**
 * Given an React component (stateless or class) tries to find the
 * flow type for the props. If not found or not one of the supported
 * component types returns null.
 */

exports['default'] = function (path) {
  var typePath = undefined;

  if ((0, _utilsIsReactComponentClass2['default'])(path)) {
    var superTypes = path.get('superTypeParameters');

    if (superTypes.value) {
      typePath = superTypes.get('params').get(1);
    } else {
      var propsMemberPath = (0, _utilsGetMemberValuePath2['default'])(path, 'props');
      if (!propsMemberPath) {
        return null;
      }

      typePath = (0, _utilsGetTypeAnnotation2['default'])(propsMemberPath.parentPath);
    }
  } else if ((0, _utilsIsStatelessComponent2['default'])(path)) {
    var param = path.get('params').get(0);

    typePath = (0, _utilsGetTypeAnnotation2['default'])(param);
  }

  if (typePath && types.GenericTypeAnnotation.check(typePath.node)) {
    typePath = (0, _utilsResolveToValue2['default'])(typePath.get('id'));
    if (!typePath || types.Identifier.check(typePath.node) || (0, _utilsIsUnreachableFlowType2['default'])(typePath)) {
      return;
    }

    typePath = typePath.get('right');
  }

  return typePath;
};

module.exports = exports['default'];