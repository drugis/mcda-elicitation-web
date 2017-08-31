'use strict';
define(['angular-mocks', 'mcda/results/results', 'angular-patavi-client', 'angularjs-slider'], function() {
  describe('The MCDAResultsService', function() {
    var resultsService;
    var pataviServiceMock = jasmine.createSpyObj('PataviServiceMock', ['somefunction']);

    beforeEach(function() {
      module('patavi', function() {});
      module('elicit.results', function($provide) {
        $provide.value('PataviService', pataviServiceMock);
      });
    });

    beforeEach(inject(function(MCDAResultsService) {
      resultsService = MCDAResultsService;
    }));

    // describe('getResults', function() { //TODO: write this test
    //   it('should return the next state', function() {
    //     expect(result).toEqual(expectedResult);
    //   });
    // });
    describe('resetModifiableScales', function() {
      it('it should reset the scales to their original values', function() {
        var alternatives = {
          alt1: 'alt1Id',
          alt2: 'alt2Id'
        };
        var observed = {
          crit1: {
            alt1: {
              '50%': 0.5,
              '2.5%': 0.1,
              '97.5': 0.9
            },
            alt2: {
              '50%': 0.05,
              '2.5%': 0.01,
              '97.5': 0.09
            },
            alt3: {
              '50%': 0.005,
              '2.5%': 0.001,
              '97.5': 0.009
            }
          }
        };
        var result = resultsService.resetModifiableScales(observed, alternatives);
        var expectedResult = {
          crit1: {
            alt1: {
              '50%': 0.5,
              '2.5%': 0.1,
              '97.5': 0.9
            },
            alt2: {
              '50%': 0.05,
              '2.5%': 0.01,
              '97.5': 0.09
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});