'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal'
  ];
  var manualInputTableDirective = function(
    $modal
  ) {
    return {
      restrict: 'E',
      scope: {
        'inputType': '=',
        'state': '=',
        'criteriaRows': '=',
        'checkInputData': '='
      },
      templateUrl: './manualInputTableDirective.html',
      link: function(scope) {
        scope.editUnitOfMeasurement = editUnitOfMeasurement;
        scope.editSoE = editSoE;

        initializeConstraints();

        function initializeConstraints() {
          _.forEach(scope.state.criteria, function(criterion) {
            _.forEach(criterion.dataSources, function(dataSource) {
              setConstraints(dataSource.unitOfMeasurement.selectedOption.type, dataSource.id);
            });
          });
        }

        function editUnitOfMeasurement(row) {
          $modal.open({
            templateUrl: './editUnitOfMeasurement.html',
            controller: 'EditUnitOfMeasurementController',
            size: 'tiny',
            resolve: {
              callback: function() {
                return function(values) {
                  var criterion = _.find(scope.state.criteria, ['id', row.criterion.id]);
                  var dataSource = _.find(criterion.dataSources, ['id', row.dataSource.id]);
                  dataSource.unitOfMeasurement = values;
                  row.dataSource.unitOfMeasurement = values;
                  setConstraints(values.selectedOption.label, row.dataSource.id);
                  scope.checkInputData();
                };
              },
              currentValues: function() {
                return row.dataSource.unitOfMeasurement;
              }
            }
          });
        }

        function editSoE(row) {
          $modal.open({
            templateUrl: './editStrengthOfEvidence.html',
            controller: 'EditStrengthOfEvidenceController',
            size: 'tiny',
            resolve: {
              callback: function() {
                return function(values) {
                  var criterion = _.find(scope.state.criteria, ['id', row.criterion.id]);
                  var dataSource = _.find(criterion.dataSources, ['id', row.dataSource.id]);
                  dataSource.strengthOfEvidence = values.strengthOfEvidence;
                  dataSource.uncertainties = values.uncertainties;
                  row.dataSource.strengthOfEvidence = values.strengthOfEvidence;
                  row.dataSource.uncertainties = values.uncertainties;
                };
              },
              currentValues: function() {
                return {
                  strengthOfEvidence: row.dataSource.strengthOfEvidence,
                  uncertainties: row.dataSource.uncertainties
                };
              }
            }
          });
        }

        function setConstraints(type, dataSourceId) {
          var effectRow = scope.state.inputData.effect[dataSourceId];
          scope.state.inputData.effect[dataSourceId] = setEffectCellConstraint(effectRow, type);
          var distributionRow = scope.state.inputData.distribution[dataSourceId];
          scope.state.inputData.distribution[dataSourceId] = setDistributionCellConstraint(distributionRow, type);
        }

        function setEffectCellConstraint(effectRow, type) {
          return _.mapValues(effectRow, function(cell) {
            cell.constraint = type;
            return cell;
          });
        }

        function setDistributionCellConstraint(distributionRow, type) {
          return _.mapValues(distributionRow, function(cell) {
            if (cell.inputParameters.id === 'value' || cell.inputParameters.id === 'normal') {
              cell.constraint = type;
            }
            return cell;
          });
        }
      }
    };
  };
  return dependencies.concat(manualInputTableDirective);
});
