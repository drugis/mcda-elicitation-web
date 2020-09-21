'use strict';
define(['clipboard', 'lodash', 'angular'], function (Clipboard, _, angular) {
  var dependencies = [
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'WorkspaceResource',
    'isMcdaStandalone',
    'OrderingService',
    'PageTitleService',
    'WorkspaceSettingsService',
    'swap'
  ];
  var EvidenceController = function (
    $scope,
    $state,
    $stateParams,
    $modal,
    WorkspaceResource,
    isMcdaStandalone,
    OrderingService,
    PageTitleService,
    WorkspaceSettingsService,
    swap
  ) {
    // functions
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editAlternative = editAlternative;
    $scope.alternativeUp = alternativeUp;
    $scope.alternativeDown = alternativeDown;
    $scope.downloadWorkspace = downloadWorkspace;

    // init
    $scope.problem = angular.copy($scope.workspace.problem);
    $scope.isStandAlone = isMcdaStandalone;
    $scope.useFavorability = _.find($scope.problem.criteria, function (
      criterion
    ) {
      return criterion.hasOwnProperty('isFavorable');
    });
    $scope.showDecimal = false;
    PageTitleService.setPageTitle(
      'EvidenceController',
      ($scope.problem.title || $scope.workspace.title) + "'s overview"
    );
    $scope.scalesPromise.then(reloadOrderingsAndScales);

    $scope.$on('elicit.settingsChanged', function () {
      reloadOrderingsAndScales();
    });

    $scope.$watch(
      'workspace.problem',
      function () {
        $scope.problem = angular.copy($scope.workspace.problem);
      },
      true
    );

    new Clipboard('.clipboard-button');

    function reloadOrderingsAndScales() {
      var problem = WorkspaceSettingsService.usePercentage()
        ? $scope.baseState.percentified.problem
        : $scope.baseState.dePercentified.problem;
      OrderingService.getOrderedCriteriaAndAlternatives(
        problem,
        $stateParams
      ).then(function (orderings) {
        $scope.orderedAlternatives = orderings.alternatives;
        $scope.orderedCriteria = orderings.criteria;
        $scope.scalesPromise.then(function () {
          $scope.scales = WorkspaceSettingsService.usePercentage()
            ? $scope.workspace.scales.basePercentified
            : $scope.workspace.scales.base;
        });
      });
    }

    function editTherapeuticContext() {
      $modal.open({
        templateUrl: '../evidence/editTherapeuticContext.html',
        controller: 'EditTherapeuticContextController',
        resolve: {
          therapeuticContext: function () {
            return $scope.problem.description;
          },
          callback: function () {
            return function (newTherapeuticContext) {
              $scope.workspace.problem.description = newTherapeuticContext;
              WorkspaceResource.save($stateParams, $scope.workspace);
            };
          }
        }
      });
    }

    function alternativeUp(idx) {
      swapAndSave($scope.orderedAlternatives, idx, idx - 1);
    }

    function alternativeDown(idx) {
      swapAndSave($scope.orderedAlternatives, idx, idx + 1);
    }

    function editAlternative(alternative) {
      $modal.open({
        templateUrl: '../evidence/editAlternative.html',
        controller: 'EditAlternativeController',
        resolve: {
          alternative: function () {
            return alternative;
          },
          alternatives: function () {
            return $scope.problem.alternatives;
          },
          callback: function () {
            return function (newAlternative) {
              $scope.workspace.problem.alternatives[alternative.id].title =
                newAlternative.title;
              WorkspaceResource.save(
                $stateParams,
                $scope.workspace
              ).$promise.then(function () {
                $state.reload(); // workaround to not call reload with the argument passed to callback
              });
            };
          }
        }
      });
    }

    function downloadWorkspace() {
      var link = document.createElement('a');
      link.download = 'problem' + $scope.workspace.id + '.json';
      var problemWithTitle = _.merge({}, $scope.workspace.problem, {
        title: $scope.workspace.title
      });
      var data =
        'text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(problemWithTitle, null, 2));
      link.href = 'data:' + data;

      // let js simulate mouse click
      link.click = function () {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent(
          'click',
          true,
          true,
          this.ownerDocument.defaultView,
          1,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        this.dispatchEvent(evt);
      };
      link.click();
    }

    // private
    function swapAndSave(array, idx, newIdx) {
      swap(array, idx, newIdx);
      OrderingService.saveOrdering(
        $stateParams,
        $scope.orderedCriteria,
        $scope.orderedAlternatives
      );
    }
  };
  return dependencies.concat(EvidenceController);
});
