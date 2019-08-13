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

        function setConstraints(label, dataSourceId) {
          var effectRow = scope.state.inputData.effect[dataSourceId];
          scope.state.inputData.effect[dataSourceId] = _.mapValues(effectRow, function(cell) {
            cell.constraint = label;
            return cell;
          });
          var distributionRow = scope.state.inputData.distribution[dataSourceId];
          scope.state.inputData.distribution[dataSourceId] = _.mapValues(distributionRow, function(cell) {
            if (cell.inputParameters.id === 'value') {
              cell.constraint = label;
            }
            return cell;
          });
        }
      }
    };
  };
  return dependencies.concat(manualInputTableDirective);
});
