'use strict';
define(['clipboard', 'lodash'], function(Clipboard, _) {
  var dependencies = ['$scope', '$state', '$stateParams', '$modal',
    'WorkspaceResource',
    'isMcdaStandalone',
    'OrderingService',
    'mcdaRootPath',
    'swap'
  ];
  var EvidenceController = function($scope, $state, $stateParams, $modal,
    WorkspaceResource,
    isMcdaStandalone,
    OrderingService,
    mcdaRootPath,
    swap
  ) {
    // functions
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editAlternative = editAlternative;
    $scope.alternativeUp = alternativeUp;
    $scope.alternativeDown = alternativeDown;
    $scope.downloadWorkspace = downloadWorkspace;

    // init
    $scope.scales = $scope.workspace.scales.observed;
    $scope.problem = $scope.workspace.problem;
    $scope.isStandAlone = isMcdaStandalone;
    $scope.useFavorability = _.find($scope.problem.criteria, function(criterion) {
      return criterion.hasOwnProperty('isFavorable');
    });
    $scope.showDecimal = false;

    OrderingService.getOrderedCriteriaAndAlternatives($scope.problem, $stateParams).then(function(orderings) {
      $scope.alternatives = orderings.alternatives;
      $scope.criteria = orderings.criteria;
    });

    $scope.$watch('workspace.scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);
    new Clipboard('.clipboard-button');

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

    function alternativeUp(idx) {
      swapAndSave($scope.alternatives, idx, idx - 1);
    }

    function alternativeDown(idx) {
      swapAndSave($scope.alternatives, idx, idx + 1);
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

      // let js simulate mouse click 
      link.click = function() {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
      };
      link.click();
    }

    // private
    function swapAndSave(array, idx, newIdx) {
      swap(array, idx, newIdx);
      OrderingService.saveOrdering($stateParams, $scope.criteria, $scope.alternatives);
    }
  };
  return dependencies.concat(EvidenceController);
});
