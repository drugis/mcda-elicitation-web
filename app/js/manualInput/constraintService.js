'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = [];
  var ConstraintService = function () {
    function defined() {
      return function (value, label) {
        if (value === undefined || isNaN(value) || value === null) {
          return 'Invalid ' + label;
        }
      };
    }
    function integer() {
      return function (value, label) {
        if (value % 1 !== 0) {
          return label + ' must be integer';
        }
      };
    }
    function positive() {
      return function (value, label) {
        if (value < 0) {
          return label + ' must be positive';
        }
      };
    }
    function belowOrEqualTo(belowWhat) {
      return function (value, label, parameters) {
        if (isFinite(belowWhat) && value > belowWhat) {
          return label + ' must be below or equal to ' + belowWhat;
        }
        if (!isFinite(belowWhat) && value > parameters[belowWhat]) {
          return label + ' must be below or equal to ' + parameters[belowWhat];
        }
      };
    }
    function above(aboveWhat) {
      return function (value, label) {
        if (value <= aboveWhat) {
          return label + ' must be above ' + aboveWhat;
        }
      };
    }
    function aboveOrEqualTo(aboveWhat) {
      return function (value, label, parameters) {
        if (isFinite(aboveWhat) && value < aboveWhat) {
          return label + ' must be above or equal to ' + aboveWhat;
        }
        if (!isFinite(aboveWhat) && value < parameters[aboveWhat]) {
          return label + ' must be above or equal to ' + parameters[aboveWhat];
        }
      };
    }
    function notNaNOrNull() {
      return function (value, label) {
        if (isNaN(value) || value === null) {
          return 'Invalid ' + label;
        }
      };
    }

    return {
      defined: defined,
      integer: integer,
      positive: positive,
      belowOrEqualTo: belowOrEqualTo,
      above: above,
      aboveOrEqualTo: aboveOrEqualTo,
      notNaNOrNull: notNaNOrNull
    };
  };
  return dependencies.concat(ConstraintService);
});