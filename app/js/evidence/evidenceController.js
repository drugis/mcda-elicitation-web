'use strict';
define(['clipboard', 'require'], function(Clipboard, require) {
  var _ = require('lodash');
  var dependencies = ['$scope', '$stateParams', '$modal',
    'EffectsTableService',
    'WorkspaceResource',
    'mcdaRootPath'
  ];

  var EvidenceController = function($scope, $stateParams, $modal,
    EffectsTableService,
    WorkspaceResource,
    mcdaRootPath) {
    // functions
    $scope.isExact = isExact;
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editCriterion = editCriterion;

    // init
    $scope.scales = $scope.workspace.scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;
    $scope.problem = $scope.workspace.problem;
    $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
    $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;
    $scope.isStandAlone = mcdaRootPath === '/app/';
    $scope.references = {
      has: _.find($scope.effectsTableData, function(effectsTableRow) {
        return _.find(effectsTableRow.criteria, function(criterion) {
          return criterion.value.source;
        });
      })
    };

    $scope.$watch('workspace.scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);
    var clipboard = new Clipboard('.clipboard-button');

    function isExact(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    }

    function editTherapeuticContext() {
      $modal.open({
        templateUrl: '/app/js/evidence/editTherapeuticContext.html',
        controller: 'EditTherapeuticContextController',
        resolve: {
          therapeuticContext: function() {
            return $scope.problem.description;
          },
          callback: function() {
            return function(newTherapeuticContext) {
              $scope.problem.description = newTherapeuticContext;
              WorkspaceResource.save($stateParams, $scope.workspace);
            };
          }
        }
      });
    }

    function editCriterion(criterion) {
      $modal.open({
        templateUrl: '/app/js/evidence/editCriterion.html',
        controller: 'EditCriterionController',
        resolve: {
          criterion: function() {
            return criterion;
          },
          callback: function() {
            return function(newCriterion) {
              criterion = newCriterion;
              $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
              WorkspaceResource.save($stateParams, $scope.workspace);
            };
          }
        }
      });
    }

  };
  return dependencies.concat(EvidenceController);
});