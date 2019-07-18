'use strict';
define(['lodash'], function(_) {
  var dependencies = ['significantDigits'];

  var ToStringService = function(significantDigits) {
    function eventsSampleSizeToString(cell) {
      return cell.firstParameter + ' / ' + cell.secondParameter;
    }

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

    function valueSEToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      return cell.firstParameter + percentage + ' (' + cell.secondParameter + percentage + ')';
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

    function valueSampleSizeToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      var value = cell.firstParameter;
      var sampleSize = cell.secondParameter;
      var returnString = value + percentage + ' (' + sampleSize + ')';
      return returnString;
    }

    function emptyToString() {
      return 'empty cell';
    }

    function textToString(cell) {
      return cell.firstParameter;
    }

    function isPercentage(cell) {
      return cell.constraint ===  'Proportion (percentage)';
    }

    return {
      gammaToString: gammaToString,
      normalToString: normalToString,
      betaToString: betaToString,
      valueToString: valueToString,
      valueSEToString: valueSEToString,
      valueCIToString: valueCIToString,
      eventsSampleSizeToString: eventsSampleSizeToString,
      valueSampleSizeToString: valueSampleSizeToString,
      emptyToString: emptyToString,
      textToString: textToString
    };
  };
  return dependencies.concat(ToStringService);
});