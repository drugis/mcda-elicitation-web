'use strict';
define(['clipboard', 'lodash'], function(Clipboard, _) {
  var dependencies = ['$scope', '$state', '$stateParams', '$modal',
    'EffectsTableService',
    'WorkspaceResource',
    'isMcdaStandalone'
  ];

  var EvidenceController = function($scope, $state, $stateParams, $modal,
    EffectsTableService,
    WorkspaceResource,
    isMcdaStandalone) {
    // functions
    $scope.isExact = isExact;
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editCriterion = editCriterion;
    $scope.editAlternative = editAlternative;
    $scope.downloadWorkspace = downloadWorkspace;

    // init
    $scope.scales = $scope.workspace.scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;
    $scope.problem = $scope.workspace.problem;
    $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
    $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;
    $scope.isStandAlone = isMcdaStandalone;
    $scope.references = {
      has: _.find($scope.problem.criteria, function(criterion) {
        return criterion.source;
      })
    };

    $scope.$watch('workspace.scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);
    new Clipboard('.clipboard-button');

    function isExact(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    }

    function editTherapeuticContext() {
      $modal.open({
        templateUrl: '/js/evidence/editTherapeuticContext.html',
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

    function editCriterion(criterion, criterionKey) {
      $modal.open({
        templateUrl: '/js/evidence/editCriterion.html',
        controller: 'EditCriterionController',
        resolve: {
          criterion: function() {
            return criterion;
          },
          criteria: function() {
            return _.pick($scope.problem.criteria, 'title');
          },
          callback: function() {
            return function(newCriterion) {
              $scope.workspace.problem.criteria[criterionKey] = newCriterion;
              WorkspaceResource.save($stateParams, $scope.workspace).$promise.then(function() {
                $state.reload();
              });
            };
          }
        }
      });

    }

    function editAlternative(alternative) {
      $modal.open({
        templateUrl: '/js/evidence/editAlternative.html',
        controller: 'EditAlternativeController',
        resolve: {
          alternative: function() {
            return alternative;
          },
          alternatives: function() {
            return $scope.problem.alternatives;
          },
          callback: function() {
            return function(newAlternative) {
              alternative.title = newAlternative.title;
              WorkspaceResource.save($stateParams, $scope.workspace).$promise.then(function() {
                $state.reload();
              });
            };
          }
        }
      });
    }

    function downloadWorkspace() {
      var link = document.createElement('a');
      link.download = 'problem' + $scope.workspace.id + '.json';
      var problemWithTitle = _.merge({}, $scope.problem, {title: $scope.workspace.title});
      var data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(problemWithTitle, null, 2));
      link.href = 'data:' + data;
      link.click();
    }

    HTMLElement.prototype.click = function() {
      var evt = this.ownerDocument.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      this.dispatchEvent(evt);
    };

  };
  return dependencies.concat(EvidenceController);
});