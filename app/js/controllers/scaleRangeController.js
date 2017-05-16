'use strict';
define(function(require) {
  require("angular");
  var _ = require("lodash");

  var dependencies = [
    '$scope',
    '$state',
    '$stateParams',
    '$modalInstance',
    'intervalHull',
    'ScaleRangeService',
    'criteria',
    'observedScales',
    'callback'
  ];

  var ScaleRangeController = function(
    $scope,
    $state,
    $stateParams,
    $modalInstance,
    intervalHull,
    ScaleRangeService,
    criteria,
    observedScales,
    callback) {

    $scope.criteria = _.keyBy(criteria, 'id');
    $scope.observedScales = observedScales;

    // functions
    $scope.validChoice = validChoice;
    $scope.cancel = cancel;
    $scope.save = save;

    initialize($scope.observedScales);

    function validChoice() {
      if ($scope.choice) {
        return _.every($scope.choice, function(choice) {
          var complete = _.isNumber(choice.upper) && _.isNumber(choice.lower);
          return complete && (choice.upper > choice.lower);
        });
      }
      return false;
    }

    function initialize(observed) {
      var scales = {};
      var choices = {};
      _.forEach(_.toPairs(observed), function(criterion) {

        // Calculate interval hulls
        var criterionRange = intervalHull(criterion[1]);

        // Set inital model value
        var pvf = $scope.criteria[criterion[0]].pvf;
        var problemRange = pvf ? pvf.range : null;
        var from = problemRange ? problemRange[0] : criterionRange[0];
        var to = problemRange ? problemRange[1] : criterionRange[1];

        choices[criterion[0]] = {
          lower: from,
          upper: to
        };

        // Set scales for slider
        var criterionScale = $scope.criteria[criterion[0]].scale;
        scales[criterion[0]] = ScaleRangeService.calculateScales(criterionScale, from, to, criterionRange);

      });
      $scope.scales = scales;
      $scope.choice = choices;
    }

    function save() {
      var pvfObject = ScaleRangeService.createRanges($scope.choice);
      callback(pvfObject);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  };
  return dependencies.concat(ScaleRangeController);
});
