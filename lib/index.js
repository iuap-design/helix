'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyVM = exports.defComponent = exports.def = exports.createComponent = exports.createElement = undefined;

var _dom = require('./core/dom');

var _observe = require('./core/observe');

var _compiler = require('./core/compiler');

var _helix = require('./core/helix');

exports.createElement = _dom.createElement;
exports.createComponent = _dom.createComponent;
exports.def = _helix.def;
exports.defComponent = _helix.defComponent;
exports.applyVM = _helix.applyVM;