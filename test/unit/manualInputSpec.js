'use strict';
define(['angular',
    'angular-mocks',
    'mcda/manualInput/manualInputService'
  ],
  function(angular,angularMocks, ManualInputService) {
    fdescribe('The manualInputService', function() {
      var manualInputService;

      beforeEach(function() {
        module('manualInput.manualInputService');
          manualInputService = ManualInputService;
      });

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
          var criteria = {
            title: 'criterion title',
            description: 'some crit description',
            unitOfMeasurement: 'particles',
            scale: [0, 1]
          };
          var performanceTable = [{
            alternative: 'treatment1',
            criterion: 'criterion title',
            performance: {
              type: 'exact',
              value: 10
            }
          }, {
            alternative: 'treatment2',
            criterion: 'criterion title',
            performance: {
              type: 'exact',
              value: 5
            }
          }];
          var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable);
          var expectedResult = {};
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
