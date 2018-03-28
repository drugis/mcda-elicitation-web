'use strict';
define(['clipboard', 'lodash'], function(Clipboard, _) {
  var dependencies = ['$scope', '$state', '$stateParams', '$modal',
    'EffectsTableService',
    'WorkspaceResource',
    'isMcdaStandalone',
    'OrderingService',
    'mcdaRootPath'
  ];

  var EvidenceController = function($scope, $state, $stateParams, $modal,
    EffectsTableService,
    WorkspaceResource,
    isMcdaStandalone,
    OrderingService,
    mcdaRootPath
  ) {
    // functions
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editCriterion = editCriterion;
    $scope.editAlternative = editAlternative;
    $scope.criterionUp = criterionUp;
    $scope.criterionDown = criterionDown;
    $scope.alternativeUp = alternativeUp;
    $scope.alternativeDown = alternativeDown;
    $scope.downloadWorkspace = downloadWorkspace;
    $scope.getIndex = getIndex;

    // init
    $scope.scales = $scope.workspace.scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;
    $scope.problem = $scope.workspace.problem;
    $scope.isStandAlone = isMcdaStandalone;

    OrderingService.getOrderedCriteriaAndAlternatives($scope.problem, $stateParams).then(function(orderings) {
      $scope.alternatives = orderings.alternatives;
      $scope.criteria = orderings.criteria;
      $scope.rows = EffectsTableService.buildEffectsTable($scope.problem.valueTree, orderings.criteria);
    });

    $scope.$watch('workspace.scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);
    new Clipboard('.clipboard-button');

    HTMLElement.prototype.click = function() {
      var evt = this.ownerDocument.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      this.dispatchEvent(evt);
    };

    function editTherapeuticContext() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/evidence/editTherapeuticContext.html',
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

    function getIndex(list, id) {
      for (var i = 0; i < list.length; ++i) {
        if (list[i].id === id) {
          return i;
        }
      }
      return -1;
    }

    function criterionUp(idx) {
      var mem = $scope.criteria[idx];
      $scope.criteria[idx] = $scope.criteria[idx - 1];
      $scope.criteria[idx - 1] = mem;
      OrderingService.saveOrdering($stateParams, $scope.criteria, $scope.alternatives);
      $scope.rows = EffectsTableService.buildEffectsTable($scope.problem.valueTree, $scope.criteria);
    }

    function criterionDown(idx) {
      var mem = $scope.criteria[idx];
      $scope.criteria[idx] = $scope.criteria[idx + 1];
      $scope.criteria[idx + 1] = mem;
      OrderingService.saveOrdering($stateParams, $scope.criteria, $scope.alternatives);
      $scope.rows = EffectsTableService.buildEffectsTable($scope.problem.valueTree, $scope.criteria);
    }

    function alternativeUp(idx) {
      var mem = $scope.alternatives[idx];
      $scope.alternatives[idx] = $scope.alternatives[idx - 1];
      $scope.alternatives[idx - 1] = mem;
      OrderingService.saveOrdering($stateParams, $scope.criteria, $scope.alternatives);
      $scope.rows = EffectsTableService.buildEffectsTable($scope.problem.valueTree, $scope.criteria);
    }

    function alternativeDown(idx) {
      var mem = $scope.alternatives[idx];
      $scope.alternatives[idx] = $scope.alternatives[idx + 1];
      $scope.alternatives[idx + 1] = mem;
      OrderingService.saveOrdering($stateParams, $scope.criteria, $scope.alternatives);
      $scope.rows = EffectsTableService.buildEffectsTable($scope.problem.valueTree, $scope.criteria);
    }

    function editCriterion(criterion, criterionKey) {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/evidence/editCriterion.html',
        controller: 'EditCriterionController',
        resolve: {
          criterion: function() {
            return criterion;
          },
          criterionId: function() {
            return criterionKey;
          },
          criteria: function() {
            return _.pick($scope.problem.criteria, 'title');
          },
          valueTree: function() {
            return $scope.valueTree;
          },
          callback: function() {
            return function(newCriterion, favorabilityChanged) {
              $scope.workspace.problem.criteria[criterionKey] = _.omit(newCriterion, 'id');
              if (favorabilityChanged) {
                var toRemove = !!_.find($scope.valueTree.children[0].criteria, function(crit) {
                  return crit === criterionKey;
                }) ? 0 : 1;
                var toAdd = toRemove === 1 ? 0 : 1;
                _.remove($scope.valueTree.children[toRemove].criteria, function(crit) {
                  return crit === criterionKey;
                });
                $scope.valueTree.children[toAdd].criteria.push(criterionKey);
              }
              // update criterionOrder
              var ordering = OrderingService.getNewOrdering($scope.workspace.problem);
              OrderingService.saveOrdering($stateParams, ordering.criteria, ordering.alternatives);
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
        templateUrl: mcdaRootPath + 'js/evidence/editAlternative.html',
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
              $scope.workspace.problem.alternatives[alternative.id].title = newAlternative.title;
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
      var problemWithTitle = _.merge({}, $scope.problem, { title: $scope.workspace.title });
      var data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(problemWithTitle, null, 2));
      link.href = 'data:' + data;
      link.click();
    }
  };
  return dependencies.concat(EvidenceController);
});