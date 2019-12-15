'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/results/results',
  'angular-patavi-client',
  'angularjs-slider'
], function(angular) {
  describe('The legendService', function() {
    var legendService;
    const compileMock = jasmine.createSpy();

    beforeEach(function() {
      angular.mock.module('elicit.smaaResults', function($provide) {
        $provide.value('$compile', compileMock);
      });
    });

    beforeEach(inject(function(LegendService) {
      legendService = LegendService;
    }));

    describe('replaceAlternativeNames', function() {
      it('should replace all titles with their legend/label', function() {
        var state = {
          problem: {
            alternatives: {
              alt1: {
                title: 'alt1 old title'
              },
              alt2: {
                title: 'alt2 old title'
              }
            }
          }
        };
        var legend = {
          alt1: {
            newTitle: 'new alt1 title'
          },
          alt2: {
            newTitle: 'new alt2 title'
          }
        };
        var expectedResult = {
          problem: {
            alternatives: {
              alt1: {
                title: 'new alt1 title'
              },
              alt2: {
                title: 'new alt2 title'
              }
            }
          }
        };
        var result = legendService.replaceAlternativeNames(legend, state);

        expect(result).toEqual(expectedResult);
      });

      it('should do nothing if there is no legend', function() {
        var state = {
          a: 'b'
        };
        var result = legendService.replaceAlternativeNames(undefined, state);
        expect(result).toEqual(state);
      });
    });

    describe('createButtonElement', function() {
      const lastPartOfTooltip = '">Labels</button></div>';
      const scope = {};

      const firstPartOfTooltipNoEdit = '<div class="legend"><button ' +
        'class="button export-button info small" ' +
        'tooltip-append-to-body="true" ' +
        'tooltip-html-unsafe="';

      const firstPartOfTooltipCanEdit = '<div class="legend"><button ' +
        'ng-click="editLegend()" ' +
        'class="button export-button info small" ' +
        'tooltip-append-to-body="true" ' +
        'tooltip-html-unsafe="';

      beforeEach(function() {
        compileMock.and.returnValue(function() { });
      });

      describe('when no legend is set', function() {
        var legend = undefined;

        it('should create a button tooltip for when the user can edit', function() {
          const canEdit = true;
          legendService.createButtonElement(legend, canEdit, scope);
          const tooltipHtml = 'Please click the button to create aliases for the alternatives to use in plots.';
          const expectedArguments = firstPartOfTooltipCanEdit + tooltipHtml + lastPartOfTooltip;
          expect(compileMock).toHaveBeenCalledWith(expectedArguments);
        });

        it('should create a button tooltip for when the editing is not allowed', function() {
          const canEdit = false;
          legendService.createButtonElement(legend, canEdit, scope);
          const tooltipHtml = 'No legend set.';
          const expectedArguments = firstPartOfTooltipNoEdit + tooltipHtml + lastPartOfTooltip;
          expect(compileMock).toHaveBeenCalledWith(expectedArguments);
        });
      });

      describe('when a legend is set', function() {
        var legend = {
          alt1: {
            newTitle: 'alt123',
            baseTitle: 'alt1'
          },
          alt2: {
            newTitle: 'alt234',
            baseTitle: 'alt2'
          }
        };

        it('should create a button tooltip for when the user can edit', function() {
          const canEdit = true;
          legendService.createButtonElement(legend, canEdit, scope);
          const tooltipHtml = '<table class=\'legend-table\'><tbody>' +
            '<tr><td><b>alt123</b>:</td><td>alt1</td></tr><tr><td><b>alt234</b>:</td><td>alt2</td></tr>' +
            '</tbody></table>Click to change';
          const expectedArguments = firstPartOfTooltipCanEdit + tooltipHtml + lastPartOfTooltip;
          expect(compileMock).toHaveBeenCalledWith(expectedArguments);
        });

        it('should create a button tooltip for when the editing is not allowed', function() {
          const canEdit = false;
          legendService.createButtonElement(legend, canEdit, scope);
          const tooltipHtml = '<table class=\'legend-table\'><tbody>' +
            '<tr><td><b>alt123</b>:</td><td>alt1</td></tr><tr><td><b>alt234</b>:</td><td>alt2</td></tr>' +
            '</tbody></table>';
          const expectedArguments = firstPartOfTooltipNoEdit + tooltipHtml + lastPartOfTooltip;
          expect(compileMock).toHaveBeenCalledWith(expectedArguments);
        });
      });
    });

    describe('createBaseCase', function() {
      it('should return the alternatives with base and new title the same', function() {
        const alternatives = [{
          id: 'alt1id',
          title: 'alt1'
        }, {
          id: 'alt2id',
          title: 'alt2'
        }];
        const result = legendService.createBaseCase(alternatives);
        const expectedResult = {
          alt1id: {
            baseTitle: 'alt1',
            newTitle: 'alt1'
          },
          alt2id: {
            baseTitle: 'alt2',
            newTitle: 'alt2'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
