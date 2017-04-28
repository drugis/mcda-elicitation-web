'use strict';
define([], function() {
  var dependencies = [];
  var ManualInputService = function() {
    var step1Data = {};

    function saveStep1Data(data) {
      step1Data = data;
    }

    function getStep1Data() {
      return step1Data;
    }
    return {
      saveStep1Data: saveStep1Data,
      getStep1Data: getStep1Data
    };
  };

  return dependencies.concat(ManualInputService);
});
