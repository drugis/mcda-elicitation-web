'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criteria', 'callback', 'oldCriterion', 'useFavorability'];
  var AddCriterionController = function($scope, $modalInstance, criteria, callback, oldCriterion, useFavorability) {
    // functions
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.addCriterion = addCriterion;
    $scope.cancel = $modalInstance.close;
    $scope.dataTypeChanged = dataTypeChanged;
    $scope.summaryMeasureChanged = summaryMeasureChanged;
    $scope.timeScaleChanged = timeScaleChanged;
    $scope.timePointOfInterestChanged = timePointOfInterestChanged;
    $scope.generateDescription = generateDescription;
    $scope.dataSourceChanged = dataSourceChanged;
    $scope.useFavorability = useFavorability;

    // vars
    $scope.blockedReason = '';
    $scope.criterion = {
      dataType: 'continuous',
      dataSource: 'study',
      isFavorable: false
    };
    $scope.isAddOperation = !oldCriterion;
    $scope.isAddingCriterion = false;

    // init
    if (oldCriterion) {
      $scope.criterion = _.cloneDeep(oldCriterion);
    }
    isCreationBlocked();

    function addCriterion(criterion) {
      $scope.isAddingCriterion = true;
      callback(criterion);
      $modalInstance.close();
    }

    function isCreationBlocked() {
      var criterion = $scope.criterion;
      $scope.blockedReasons = [];
      if (!criterion.title && !$scope.isAddingCriterion) {
        $scope.blockedReasons.push('No title entered');
      }
      if (isTitleDuplicate(criterion.title) && !$scope.isAddingCriterion && !oldCriterion) {
        $scope.blockedReasons.push('Duplicate title');
      }
      if (criterion.dataType === 'survival' && !criterion.timeScale) {
        $scope.blockedReasons.push('Missing time scale');
      }
      if (criterion.dataType === 'survival' && criterion.summaryMeasure === 'survivalAtTime' &&
        (criterion.timePointOfInterest === null || criterion.timePointOfInterest === undefined)) {
        $scope.isInvalidTimePointOfInterest = true;
        $scope.blockedReasons.push('Invalid time point of interest');
      } else {
        $scope.isInvalidTimePointOfInterest = false;
      }

      var regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
      if (criterion.sourceLink && !criterion.sourceLink.match(regex)) {
        $scope.blockedReasons.push('Invalid URL');
      }
    }

    function isTitleDuplicate(title) {
      return _.find(criteria, ['title', title]);
    }

    function dataTypeChanged() {
      if ($scope.criterion.dataType !== 'survival') {
        delete $scope.criterion.summaryMeasure;
        delete $scope.criterion.timeScale;
        delete $scope.criterion.timePointOfInterest;
        delete $scope.isInvalidTimePointOfInterest;
      } else {
        $scope.criterion.summaryMeasure = 'mean';
      }
      setUnit();
      generateDescription();
      isCreationBlocked();
    }

    function summaryMeasureChanged() {
      if ($scope.criterion.summaryMeasure !== 'survivalAtTime') {
        delete $scope.criterion.timePointOfInterest;
      } else {
        isCreationBlocked();
      }
      setUnit();
      generateDescription();
      isCreationBlocked();

    }

    function timeScaleChanged() {
      if ($scope.criterion.summaryMeasure === 'survivalAtTime') {
        generateDescription();
      } else {
        setUnit();
      }
      isCreationBlocked();

    }

    function timePointOfInterestChanged() {
      generateDescription();
      isCreationBlocked();

    }

    function setUnit() {
      var crit = $scope.criterion;
      if (crit.dataType === 'dichotomous' || (crit.dataType === 'survival' && crit.summaryMeasure === 'survivalAtTime')) {
        $scope.criterion.unitOfMeasurement = 'Proportion';
      } else if (crit.dataType === 'survival' && (crit.summaryMeasure === 'mean' || crit.summaryMeasure === 'median')) {
        $scope.criterion.unitOfMeasurement = crit.timeScale;
      } else {
        $scope.criterion.unitOfMeasurement = undefined;
      }
    }

    function generateDescription() {
      var criterion = $scope.criterion;
      if (criterion.summaryMeasure === 'mean') {
        criterion.description = 'Mean survival';
      } else if (criterion.summaryMeasure === 'median') {
        criterion.description = 'Median survival';
      } else if (criterion.summaryMeasure === 'survivalAtTime') {
        if (criterion.timePointOfInterest !== undefined && criterion.timePointOfInterest !== null && criterion.timeScale) {
          criterion.description = 'Survival at time ' + criterion.timePointOfInterest + ' (' + criterion.timeScale + ')';
        } else {
          delete criterion.description;
        }
      } else {
        delete criterion.description;
      }
    }

    function dataSourceChanged() {
      if ($scope.criterion.dataSource === 'exact') {
        $scope.criterion.dataType = 'exact';
      } else {
        $scope.criterion.dataType = 'continuous';
      }
    }
  };
  return dependencies.concat(AddCriterionController);
});