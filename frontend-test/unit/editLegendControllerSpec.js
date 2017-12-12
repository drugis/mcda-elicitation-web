'use strict';
define(['angular-mocks', 'mcda/preferences/preferences'], function() {
  describe('Edit Legend controller', function() {

    var scope,
      legend,
      alternatives = {
        alt1: {
          title: 'alternative 1',
          id: 'alt1'
        },
        alt2: {
          title: 'alternative 2',
          id: 'alt2'
        }
      },
      callback;

    beforeEach(module('elicit.results'));

    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();

      $controller('EditLegendController', {
        $scope: scope,
        $modalInstance: {
          close: 'closeMock'
        },
        legend: legend,
        alternatives: alternatives,
        callback: callback
      });
    }));
    describe('initially', function() {
      it('scope should be initialised', function() {
        expect(scope.saveLegend).toBeDefined();
        expect(scope.isLabelMissing).toBeFalsy();
        expect(scope.close).toBe('closeMock');
        expect(scope.createSingleLetterLegend).toBeDefined();
        expect(scope.resetToBase).toBeDefined();
        expect(scope.checkForMissingLabel).toBeDefined();
        expect(scope.legend).toEqual({
          alt1: {
            baseTitle: 'alternative 1',
            newTitle: 'alternative 1',
          },
          alt2: {
            baseTitle: 'alternative 2',
            newTitle: 'alternative 2',
          }
        });
      });
    });
    describe('checkForMissingLabel', function() {
      it('should be truthy if a label is missing', function() {
        delete scope.legend.alt1.newTitle;
        scope.checkForMissingLabel();
        expect(scope.isLabelMissing).toBeTruthy();
        scope.legend.alt1.newTitle = 'alternative 1';
      });
    });
    describe('createSingleLetterLegend', function() {
      it('should set labels to single letters', function() {
        scope.createSingleLetterLegend();
        expect(scope.legend).toEqual({
          alt1: {
            baseTitle: 'alternative 1',
            newTitle: 'A'
          },
          alt2: {
            baseTitle: 'alternative 2',
            newTitle: 'B'
          }
        });
      });
    });
    describe('resetToBase', function() {
      it('should reset labels to their base', function() {
        scope.legend.alt1.newTitle = 'foo';
        scope.legend.alt2.newTitle = 'bar';
        scope.resetToBase();
        expect(scope.legend).toEqual({
          alt1: {
            baseTitle: 'alternative 1',
            newTitle: 'alternative 1'
          },
          alt2: {
            baseTitle: 'alternative 2',
            newTitle: 'alternative 2'
          }
        });
      });
    });  });
});