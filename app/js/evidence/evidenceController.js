'use strict';
define(['clipboard', 'lodash'], function(Clipboard, _) {
  var dependencies = ['$scope', '$state', '$stateParams', '$modal',
    'WorkspaceResource',
    'isMcdaStandalone',
    'OrderingService',
    'mcdaRootPath'
  ];

  var EvidenceController = function($scope, $state, $stateParams, $modal,
    WorkspaceResource,
    isMcdaStandalone,
    OrderingService,
    mcdaRootPath
  ) {
    // functions
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editAlternative = editAlternative;
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
      return _.findIndex(list, ['id', id]);
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
      link.click();
    }

    // private
    function swapAndSave(array, idx, newIdx) {
      var mem = array[idx];
      array[idx] = array[newIdx];
      array[newIdx] = mem;
      OrderingService.saveOrdering($stateParams, $scope.criteria, $scope.alternatives);
    }
  };
  return dependencies.concat(EvidenceController);
});
