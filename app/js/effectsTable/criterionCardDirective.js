'use strict';
define(['lodash'], function (_) {
  var dependencies = [
    '$modal',
    'swap',
    'isMcdaStandalone',
    'WorkspaceSettingsService',
    'EffectsTableService'
  ];
  var CriterionCardDirective = function (
    $modal,
    swap,
    isMcdaStandalone,
    WorkspaceSettingsService,
    EffectsTableService
  ) {
    return {
      restrict: 'E',
      scope: {
        criterion: '=',
        canGoUp: '=',
        canGoDown: '=',
        goUp: '=',
        goDown: '=',
        removeCriterion: '=',
        criterionIndex: '=',
        editCriterion: '=',
        isInput: '=',
        saveOrdering: '=',
        saveWorkspace: '=',
        editMode: '=',
        scales: '=',
        alternatives: '=',
        effectsTableInfo: '=',
        problemCriterion: '='
      },
      templateUrl: '../effectsTable/criterionCardDirective.html',
      link: function (scope) {
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
        scope.$watch('scales', setIsCellAnalysisViable);

        function setIsCellAnalysisViable() {
          scope.isCellAnalysisViable = EffectsTableService.createIsCellAnalysisViableForCriterionCard(
            scope.criterion,
            scope.alternatives,
            scope.effectsTableInfo,
            scope.scales
          );
        }

        function updateSettings() {
          scope.workspaceSettings = WorkspaceSettingsService.setWorkspaceSettings();
          scope.isValueView = WorkspaceSettingsService.isValueView();
        }

        function criterionUp() {
          scope.goUp(scope.criterionIndex);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function criterionDown() {
          scope.goDown(scope.criterionIndex);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function dataSourceDown(criterion, dataSourceIndex) {
          swapAndSave(
            criterion.dataSources,
            dataSourceIndex,
            dataSourceIndex + 1
          );
        }

        function dataSourceUp(criterion, dataSourceIndex) {
          swapAndSave(
            criterion.dataSources,
            dataSourceIndex,
            dataSourceIndex - 1
          );
        }

        function removeDataSource(dataSource) {
          scope.criterion.dataSources = _.reject(scope.criterion.dataSources, [
            'id',
            dataSource.id
          ]);
        }

        function editDataSource(dataSource, dataSourceIndex) {
          $modal.open({
            template: scope.isInput
              ? require('../manualInput/addDataSource.html')
              : require('../evidence/editDataSource.html'),
            controller: 'EditDataSourceController',
            resolve: {
              callback: function () {
                return function (newDataSource) {
                  if (dataSource) {
                    scope.criterion.dataSources[dataSourceIndex] = _.merge(
                      {},
                      dataSource,
                      newDataSource
                    );
                    if (!scope.isInput) {
                      scope.problemCriterion.dataSources[
                        dataSourceIndex
                      ] = newDataSource;
                      scope.saveWorkspace(
                        scope.problemCriterion,
                        scope.criterion.id
                      );
                    }
                  } else {
                    scope.criterion.dataSources.push(newDataSource);
                  }
                };
              },
              dataSources: function () {
                return scope.isInput
                  ? scope.criterion.dataSources
                  : scope.problemCriterion.dataSources;
              },
              dataSource: function () {
                return scope.isInput
                  ? scope.criterion.dataSources[dataSourceIndex]
                  : scope.problemCriterion.dataSources[dataSourceIndex];
              }
            }
          });
        }

        function swapAndSave(array, dataSourceIndex, newDataSourceIndex) {
          swap(array, dataSourceIndex, newDataSourceIndex);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }
      }
    };
  };
  return dependencies.concat(CriterionCardDirective);
});
