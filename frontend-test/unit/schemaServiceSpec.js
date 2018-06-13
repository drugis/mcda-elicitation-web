'use strict';
define(['angular-mocks', 'mcda/benefitRisk/benefitRisk'], function() {

  var generateUuidMock = jasmine.createSpy('generateUuid');
  var currentSchemaVersion = '1.1.0';
  var schemaService;

  describe('The SchemaService', function() {
    beforeEach(module('elicit.benefitRisk', function($provide) {
      $provide.value('generateUuid', generateUuidMock);
      $provide.value('currentSchemaVersion', currentSchemaVersion);
    }));

    beforeEach(inject(function(SchemaService) {
      schemaService = SchemaService;
    }));

    describe('updateWorkspaceToCurrentSchema (includes updateProblemToCurrentSchema)', function() {
      it('it should do nothing to a workspace of the current version', function() {
        var workspace = {
          problem: exampleProblem()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        expect(result).toEqual(workspace);
      });
      it('it should update a workspace without schemaversion to the current version', function() {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: { type: 'dnorm' }
            }]
          }
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                unitOfMeasurement: 'ms',
                dataSources: [{
                  id: undefined,
                  inputType: 'distribution',
                  inputMethod: 'manualDistribution',
                  uncertainties: 'unc',
                  source: 'source'
                }]
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              dataSource: undefined,
              performance: { type: 'dnorm' }
            }],
            schemaVersion: '1.1.0'
          },
        };
        expect(result).toEqual(expectedResult);
      });
      it('it should update a workspace of version 1.0.0 to the current version', function() {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: { type: 'dnorm' }
            }],
            valueTree: {
              children: [{
                children: {
                  criteria: ['crit1']
                }
              }, {
                criteria: []
              }]
            }
          }
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                unitOfMeasurement: 'ms',
                isFavorable: true,
                dataSources: [{
                  id: undefined,
                  inputType: 'distribution',
                  inputMethod: 'manualDistribution',
                  uncertainties: 'unc',
                  source: 'source'
                }]
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              dataSource: undefined,
              performance: { type: 'dnorm' }
            }],
            schemaVersion: '1.1.0'
          },
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
