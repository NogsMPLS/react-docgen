'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = displayNameHandler;

var _getMemberValuePath = require('../utils/getMemberValuePath');

var _getMemberValuePath2 = _interopRequireDefault(_getMemberValuePath);

var _resolveName = require('../utils/resolveName');

var _resolveName2 = _interopRequireDefault(_resolveName);

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

var _resolveToValue = require('../utils/resolveToValue');

var _resolveToValue2 = _interopRequireDefault(_resolveToValue);

var _isExportsOrModuleAssignment = require('../utils/isExportsOrModuleAssignment');

var _isExportsOrModuleAssignment2 = _interopRequireDefault(_isExportsOrModuleAssignment);

var _resolveExportDeclaration = require('../utils/resolveExportDeclaration');

var _resolveExportDeclaration2 = _interopRequireDefault(_resolveExportDeclaration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var types = _recast2.default.types.namedTypes; /*
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

function getOrInferDisplayName(path) {
  var displayNamePath = (0, _getMemberValuePath2.default)(path, 'displayName');

  if (displayNamePath) {
    displayNamePath = (0, _resolveToValue2.default)(displayNamePath);
    if (!displayNamePath || !types.Literal.check(displayNamePath.node)) {
      return;
    }
    return displayNamePath.node.value;
  } else if (!displayNamePath && path.node.id) {
    return path.node.id.name;
  } else if (!displayNamePath && (0, _resolveName2.default)(path)) {
    return (0, _resolveName2.default)(path);
  }
}

function displayNameHandler(documentation, path) {
  var displayName;

  //If not immediately exported via ES6 or CommonJS exports or an ExpressionStatement
  if (!types.ExportNamedDeclaration.check(path.node) && !(0, _isExportsOrModuleAssignment2.default)(path) && !types.ExpressionStatement.check(path.node)) {
    displayName = getOrInferDisplayName(path);

    //ES6 Exports
  } else if (types.ExportNamedDeclaration.check(path.node)) {
    var declarationPath;
    var declaration = path.node.declaration;

    if (declaration.type === types.ClassDeclaration.name || declaration.type === types.FunctionDeclaration.name || declaration.type === types.FunctionExpression.name) {
      declarationPath = (0, _resolveExportDeclaration2.default)(path)[0];
    } else if (declaration.type === types.VariableDeclaration.name) {

      declarationPath = (0, _resolveExportDeclaration2.default)(path)[0].parentPath.parentPath.parentPath;
    }

    displayName = getOrInferDisplayName(declarationPath);

    //CommonJS export.X
  } else if ((0, _isExportsOrModuleAssignment2.default)(path)) {
    displayName = (0, _resolveToValue2.default)(path).get('expression', 'left', 'property', 'name').value;
  } else if (types.ExpressionStatement.check(path.node) && path.node.expression.id) {
    displayName = path.node.expression.id.name;
  }
  documentation.set('displayName', displayName);
}