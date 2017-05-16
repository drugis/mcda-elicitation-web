'use strict';
define(['angular-mocks', 'mcda/manualInput/manualInputService'], function() {
  describe('The manualInputService', function() {
    var manualInputService;
    beforeEach(module('elicit.manualInputService'));
    beforeEach(inject(function(ManualInputService) {
      manualInputService = ManualInputService;
    }));

    describe('createProblem', function() {
      it('should create a problem, ready to go to the workspace', function() {
        var title = 'title';
        var description = 'A random description of a random problem';
        var treatments = {
          treatment1: {
            name: 'treatment1'
          },
          treatment2: {
            name: 'treatment2'
          }
        };
        var criteria = [{
          name: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true
        }, {
          name: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false
        }];
        var performanceTable = {
          'favorable criterion': {
            'treatment1': 10,
            'treatment2': 5
          },
          'unfavorable criterion': {
            'treatment1': 20,
            'treatment2': 30
          }
        };
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable);
        var expectedResult = {
          title: title,
          description: description,
          valueTree: {
            title: 'Benefit-risk balance',
            children: [{
              title: 'Favourable effects',
              criteria: ['favorable criterion']
            }, {
              title: 'Unfavourable effects',
              criteria: ['unfavorable criterion']
            }]
          },
          criteria: {
            'favorable criterion': {
              title: 'favorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [5, 10]
            },
            'unfavorable criterion': {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [20, 30]
            }
          },
          alternatives: {
            treatment1: {
              title: 'treatment1'
            },
            treatment2: {
              title: 'treatment2'
            }
          },
          performanceTable: [{
            alternative: 'treatment1',
            criterion: 'favorable criterion',
            performance: {
              type: 'exact',
              value: 10
            }
          }, {
            alternative: 'treatment2',
            criterion: 'favorable criterion',
            performance: {
              type: 'exact',
              value: 5
            }
          }, {
            alternative: 'treatment1',
            criterion: 'unfavorable criterion',
            performance: {
              type: 'exact',
              value: 20
            }
          }, {
            alternative: 'treatment2',
            criterion: 'unfavorable criterion',
            performance: {
              type: 'exact',
              value: 30
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('preparePerformanceTable', function() {
      it('should prepare a zero initialized table', function() {
        var treatments = {
          treatment1: {
            name: 'treatment1'
          },
          treatment2: {
            name: 'treatment2'
          }
        };
        var criteria = [{
          name: 'criterion 1 title'
        }, {
          name: 'criterion 2 title'
        }];
        var result = manualInputService.preparePerformanceTable(criteria, treatments);
        var expectedResult = {
          'criterion 1 title': {
            treatment1: 0,
            treatment2: 0
          },
          'criterion 2 title': {
            treatment1: 0,
            treatment2: 0
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

  });
});
