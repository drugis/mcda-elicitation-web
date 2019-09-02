'use strict';
define(['angular'], function () {
  var dependencies = [];
  var ConstraintService = function () {
    var INTEGER = function (value, label) {
      if (value % 1 !== 0) {
        return label + ' must be integer';
      }
    };

    var DEFINED = function (value, label) {
      if (value === undefined || isNaN(value) || value === null) {
        return 'Invalid ' + label;
      }
    };

    var NOT_EMPTY = function (value, label) {
      if (value === undefined || value === null || value === '') {
        return 'Invalid ' + label;
      }
    };

    var POSITIVE = function (value, label) {
      if (value < 0) {
        return label + ' must be positive';
      }
    };

    var NOT_NAN_OR_NULL = function (value, label) {
      if (isNaN(value) || value === null) {
        return 'Invalid ' + label;
      }
    };

    function defined() {
      return {
        label: 'defined',
        validator: DEFINED
      };
    }

    function notEmpty() {
      return {
        label: 'notEmpty',
        validator: NOT_EMPTY
      };
    }

    function integer() {
      return {
        label: 'integer',
        validator: INTEGER
      };
    }

    function positive() {
      return {
        label: 'positive',
        validator: POSITIVE
      };
    }

    function notNaNOrNull() {
      return {
        label: 'notNanOrNull',
        validator: NOT_NAN_OR_NULL
      };
    }

    function belowOrEqualTo(belowWhat) {
      return {
        label: 'belowOrEqualTo',
        validator: function (value, label, parameters) {
          if (isFinite(belowWhat) && value > belowWhat) {
            return label + ' must be below or equal to ' + belowWhat;
          }
          if (!isFinite(belowWhat) && value > parameters[belowWhat]) {
            return label + ' must be below or equal to ' + parameters[belowWhat];
          }
        }
      };
    }

    function above(aboveWhat) {
      return {
        label: 'above',
        validator: function (value, label) {
          if (value <= aboveWhat) {
            return label + ' must be above ' + aboveWhat;
          }
        }
      };
    }

    function aboveOrEqualTo(aboveWhat) {
      return {
        label: 'aboveOrEqualTo',
        validator: function (value, label, parameters) {
          if (isFinite(aboveWhat) && value < aboveWhat) {
            return label + ' must be above or equal to ' + aboveWhat;
          }
          if (!isFinite(aboveWhat) && value < parameters[aboveWhat]) {
            return label + ' must be above or equal to ' + parameters[aboveWhat];
          }
        }
      };
    }
     
    function percentage(){
      return {
        label: 'Proportion (percentage)',
        validator: function(value){
          if(value < 0  || value > 100){
            return 'Value must be between 0 and 100';
          }
        }
      };
    }

    function decimal(){
      return {
        label: 'Proportion (decimal)',
        validator: function(value){
          if(value < 0  || value > 1){
            return 'Value must be between 0 and 1';
          }
        }
      };
    }

    return {
      defined: defined,
      notEmpty: notEmpty,
      integer: integer,
      positive: positive,
      belowOrEqualTo: belowOrEqualTo,
      above: above,
      aboveOrEqualTo: aboveOrEqualTo,
      notNaNOrNull: notNaNOrNull,
      decimal: decimal,
      percentage: percentage
    };
  };
  return dependencies.concat(ConstraintService);
});
