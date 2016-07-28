'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultPropsHandler;

var _getPropertyName = require('../utils/getPropertyName');

var _getPropertyName2 = _interopRequireDefault(_getPropertyName);

var _getMemberValuePath = require('../utils/getMemberValuePath');

var _getMemberValuePath2 = _interopRequireDefault(_getMemberValuePath);

var _printValue = require('../utils/printValue');

var _printValue2 = _interopRequireDefault(_printValue);

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var _resolveToValue = require('../utils/resolveToValue');

var _resolveToValue2 = _interopRequireDefault(_resolveToValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var _recast$types = _recast2.default.types;
var types = _recast$types.namedTypes;
var visit = _recast$types.visit;


function getDefaultValue(path) {
  var node = path.node;
  var defaultValue;
  if (types.Literal.check(node)) {
    defaultValue = node.raw;
  } else {
    path = (0, _resolveToValue2.default)(path);
    node = path.node;
    defaultValue = (0, _printValue2.default)(path);
  }
  if (typeof defaultValue !== 'undefined') {
    return {
      value: defaultValue,
      computed: types.CallExpression.check(node) || types.MemberExpression.check(node) || types.Identifier.check(node)
    };
  }
}

function defaultPropsHandler(documentation, componentDefinition) {
  var defaultPropsPath = (0, _getMemberValuePath2.default)(componentDefinition, 'defaultProps');
  if (!defaultPropsPath) {
    return;
  }

  defaultPropsPath = (0, _resolveToValue2.default)(defaultPropsPath);
  if (!defaultPropsPath) {
    return;
  }

  if (types.FunctionExpression.check(defaultPropsPath.node)) {
    // Find the value that is returned from the function and process it if it is
    // an object literal.
    visit(defaultPropsPath.get('body'), {
      visitFunction: function visitFunction() {
        return false;
      },
      visitReturnStatement: function visitReturnStatement(path) {
        var resolvedPath = (0, _resolveToValue2.default)(path.get('argument'));
        if (types.ObjectExpression.check(resolvedPath.node)) {
          defaultPropsPath = resolvedPath;
        }
        return false;
      }
    });
  }

  if (types.ObjectExpression.check(defaultPropsPath.node)) {
    defaultPropsPath.get('properties').filter(function (propertyPath) {
      return types.Property.check(propertyPath.node);
    }).forEach(function (propertyPath) {
      var propDescriptor = documentation.getPropDescriptor((0, _getPropertyName2.default)(propertyPath));
      var defaultValue = getDefaultValue(propertyPath.get('value'));
      if (defaultValue) {
        propDescriptor.defaultValue = defaultValue;
      }
    });
  }
}