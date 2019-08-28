'use strict';
define(['lodash'], function(_) {
  var dependencies = ['significantDigits'];

  var ToStringService = function(significantDigits) {
    function gammaToString(cell) {
      return 'Gamma(' + significantDigits(cell.firstParameter) + ', ' + significantDigits(cell.secondParameter) + ')';
    }

    function normalToString(cell) {
      return 'Normal(' + significantDigits(cell.firstParameter) + ', ' + significantDigits(cell.secondParameter) + ')';
    }

    function betaToString(cell) {
      return 'Beta(' + significantDigits(cell.firstParameter) + ', ' + significantDigits(cell.secondParameter) + ')';
    }

    function valueToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      return cell.firstParameter + percentage;
    }

    function valueCIToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      var returnString = cell.firstParameter + percentage + ' (';
      if (cell.lowerBoundNE) {
        returnString += 'NE; ';
      } else {
        returnString += cell.secondParameter + percentage + '; ';
      }
      if (cell.upperBoundNE) {
        returnString += 'NE)';
      } else {
        returnString += cell.thirdParameter + percentage + ')';
      }
      return returnString;
    }

    function emptyToString() {
      return 'empty cell';
    }

    function textToString(cell) {
      return cell.firstParameter;
    }

    function isPercentage(cell) {
      return cell.constraint ===  'percentage';
    }

    return {
      gammaToString: gammaToString,
      normalToString: normalToString,
      betaToString: betaToString,
      valueToString: valueToString,
      valueCIToString: valueCIToString,
      emptyToString: emptyToString,
      textToString: textToString
    };
  };
  return dependencies.concat(ToStringService);
});
