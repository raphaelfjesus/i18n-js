'use strict';

var I18n = require('./lib/i18n');

module.exports = function i18n(options) {
  return new I18n(options);
};

module.exports.I18n = I18n;