'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'swap',
    'isMcdaStandalone',
    'WorkspaceSettingsService',
    'EffectsTableService'
  ];
  var CriterionCardDirective = function(
    $modal,
    swap,
    isMcdaStandalone,
    WorkspaceSettingsService,
    EffectsTableService
  ) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'canGoUp': '=',
        'canGoDown': '=',
        'goUp': '=',
        'goDown': '=',
        'removeCriterion': '=',
        'idx': '=',
        'editCriterion': '=',
        'isInput': '=',
        'saveOrdering': '=',
        'saveWorkspace': '=',
        'editMode': '=',
        'scales': '=',
        'alternatives': '=',
        'effectsTableInfo': '='
      },
      templateUrl: '../effectsTable/criterionCardDirective.html',
      link: function(scope) {
        scope.isStandalone = isMcdaStandalone;
        scope.criterionUp = criterionUp;
        scope.criterionDown = criterionDown;
        scope.dataSourceDown = dataSourceDown;
        scope.dataSourceUp = dataSourceUp;
        scope.removeDataSource = removeDataSource;
        scope.editDataSource = editDataSource;

        updateSettings();
        setIsCellAnalysisViable();
        
        scope.$on('elicit.settingsChanged', updateSettings);
        scope.$watch('scales',setIsCellAnalysisViable );

        function setIsCellAnalysisViable() {
          scope.isCellAnalysisViable = EffectsTableService.createIsCellAnalysisViableForCriterionCard(
            scope.criterion, scope.alternatives, scope.effectsTableInfo, scope.scales
          );
        }

        function updateSettings() {
          scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
          scope.isValueView = WorkspaceSettingsService.isValueView();
        }

        function criterionUp() {
          scope.goUp(scope.idx);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function criterionDown() {
          scope.goDown(scope.idx);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function dataSourceDown(criterion, idx) {
          swapAndSave(criterion.dataSources, idx, idx + 1);
        }

        function dataSourceUp(criterion, idx) {
          swapAndSave(criterion.dataSources, idx, idx - 1);
        }

        function removeDataSource(dataSource) {
          scope.criterion.dataSources = _.reject(scope.criterion.dataSources, ['id', dataSource.id]);
        }

        function editDataSource(dataSource, dataSourceIndex) {
          $modal.open({
            template: scope.isInput ? require('../manualInput/addDataSource.html') : require('../evidence/editDataSource.html'),
            controller: 'EditDataSourceController',
            resolve: {
              callback: function() {
                return function(newDataSource) {
                  if (dataSource) {
                    scope.criterion.dataSources[dataSourceIndex] = newDataSource;
                    if (!scope.isInput) {
                      scope.saveWorkspace(scope.criterion);
                    }
                  } else {
                    scope.criterion.dataSources.push(newDataSource);
                  }
                };
              },
              dataSources: function() {
                return scope.criterion.dataSources;
              },
              dataSource: function() {
                return dataSource;
              }
            }
          });
        }

        // private
        function swapAndSave(array, idx, newIdx) {
          swap(array, idx, newIdx);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }
      }
    };
  };
  return dependencies.concat(CriterionCardDirective);
});
