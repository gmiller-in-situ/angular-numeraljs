'use strict';

(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('numeral'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['numeral'], function (numeral) {
      return (root.ngNumeraljs = factory(numeral));
    });
  } else {
    // Global Variables
    root.ngNumeraljs = factory(root.numeral);
  }
}(this, function (numeral) {
  return angular.module('ngNumeraljs', [])
    .provider('$numeraljsConfig', function () {
      var formats = {};

      this.defaultFormat = function (format) {
        numeral.defaultFormat(format);
      };
 
      // Takes short or long locale strings ('en' or 'en-us')
      this.locale = function (locale) {
        if (numeral.locales[locale] !== undefined) {
          return numeral.locale(locale);
        } else {
          return numeral.locale(locale.substring(0, 2));
        }
      };


      this.namedFormat = function (name, format) {
        formats[name] = format;
      };

      this.register = function (type, name, def) {
        numeral.register(type, name, def);
      };

      this.$get = function () {
        return {
          customFormat: function (name) {
            return formats[name] || name;
          },
          defaultFormat: this.defaultFormat,
          locale: this.locale,
          register: this.register,
          namedFormat: this.namedFormat
        };
      };
    })
    .filter('numeraljs', function ($numeraljsConfig) {
      return function (input, format) {
        if (input == null) {
          return input;
        }

        format = $numeraljsConfig.customFormat(format);

        return numeral(input).format(format);
      };
    });
}));
