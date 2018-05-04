'use strict';
define(['lodash'], function (_) {
  var dependencies = ['$scope', '$modalInstance', 'criteria', 'callback', 'oldCriterion', 'useFavorability', 'generateUuid'];
  var AddCriterionController = function ($scope, $modalInstance, criteria, callback, oldCriterion, useFavorability, generateUuid) {
    // functions
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.addCriterion = addCriterion;
    $scope.cancel = $modalInstance.close;
    $scope.dataTypeChanged = dataTypeChanged;
    $scope.inputTypeChanged = inputTypeChanged;
    $scope.useFavorability = useFavorability;

    // init
    $scope.blockedReason = '';
    $scope.criterion = {
      id: generateUuid(),
      inputMetaData: {
        inputType: 'distribution',
        inputMethod: 'assistedDistribution',
        dataType: 'dichotomous',
        parameterOfInterest: 'eventProbability',
      },
      isFavorable: false
    };
    $scope.isAddOperation = !oldCriterion;
    $scope.isAddingCriterion = false;

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
      if (isTitleDuplicate(criterion.title) && !$scope.isAddingCriterion && (!oldCriterion || oldCriterion.title !== criterion.title)) {
        $scope.blockedReasons.push('Duplicate title');
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
      switch ($scope.criterion.inputMetaData.dataType) {
        case 'dichotomous':
          $scope.criterion.inputMetaData.parameterOfInterest = 'eventProbability';
          break;
        case 'continuous':
          $scope.criterion.inputMetaData.parameterOfInterest = 'mean';
          break;
        default:
          $scope.criterion.inputMetaData.parameterOfInterest = 'value';
      }
    }

    function inputTypeChanged(){
      if($scope.criterion.inputMetaData.inputType === 'distribution' && $scope.criterion.inputMetaData.dataType === 'other'){
        $scope.criterion.inputMetaData.dataType = 'dichotomous';
      }  
    }

  };
  return dependencies.concat(AddCriterionController);
});
