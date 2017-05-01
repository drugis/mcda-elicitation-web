'use strict';
define(['angular',
    'angular-mocks',
    'mcda/manualInput/manualInputService'
  ],
  function() {
    describe('The manualInputService', function() {
      beforeEach(module('manualInput.manualInputService'));

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
          var criteria = {};
          var result = ManualInputService.createProblem(criteria, treatments, title, description, performanceTable);
          var expectedResult = {};
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
