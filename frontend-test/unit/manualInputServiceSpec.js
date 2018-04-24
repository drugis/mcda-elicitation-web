'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function (angular) {
  var MISSING_OR_INVALID = 'Missing or invalid input';
  var NULL_PARAMETERS = {
    firstParameter: {
      constraints: []
    },
    secondParameter: {
      constraints: []
    },
    thirdParameter: {
      constraints: []
    }
  };
  var manualInputService;
  fdescribe('The manualInputService', function () {
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function (ManualInputService) {
      manualInputService = ManualInputService;
    }));
    describe('getInputError', function () {
      it('should run all the constraints of a cell\'s parameters, returning the first error found', function () {
        var cell = {
          firstParameter: 10,
          secondParameter: 20,
          inputParameters: {
            firstParameter: {
              constraints: [
                function () { }
              ]
            },
            secondParameter: {
              constraints: [
                function () { },
                function () { return 'error message' }
              ]
            }
          }
        };
        var result = manualInputService.getInputError(cell);
        expect(result).toBe('error message');
      });
    });

    describe('inputToString,', function () {
      var cell;
      describe('for incorrect input', function () {
        it('should return the invalid input message', function () {
          var cell = {
            firstParameter: 10,
            inputParameters: {
              firstParameter: {
                constraints: [function () { return 'error'; }]
              }
            }
          };
          var result = manualInputService.inputToString(cell);
          expect(result).toEqual(MISSING_OR_INVALID);
        });
      });
      describe('for distributions,', function () {
        beforeEach(function () {
          cell = {
            inputType: 'distribution'
          };
        });
        describe('for assisted inputs,', function () {
          beforeEach(function () {
            cell.inputMethod = 'assistedDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.thirdParameter = 150;
            cell.inputParameters = angular.copy(NULL_PARAMETERS);
          });
          describe('for dichotomous inputs,', function () {
            beforeEach(function () {
              cell.dataType = 'dichotomous';
            });
            it('should render correct inputs', function () {
              var expectedResult = '30 / 40\nDistribution: Beta(31, 12)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for continuous inputs,', function () {
            beforeEach(function () {
              cell.dataType = 'continuous';
            });
            describe('for inputs with standard error', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'assistedContinuousStdErr';
              });
              it('should render correct inputs', function () {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 40)';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('for inputs with standard deviation', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'assistedContinuousStdDev';
              });
              it('should render correct inputs', function () {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 3.266)';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
          describe('for other inputs,', function () {
            beforeEach(function () {
              cell.dataType = 'other';
              cell.inputParameters.id = 'assistedOther';
            });
            it('should render correct inputs', function () {
              var expectedResult = '30\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
        });
        describe('for manual inputs,', function () {
          beforeEach(function () {
            cell.inputMethod = 'manualDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.inputParameters = angular.copy(NULL_PARAMETERS);
          });
          describe('for beta distributions', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'manualBeta';
            });
            it('should render correct inputs', function () {
              var expectedResult = 'Beta(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for normal distributions', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'manualNormal';
            });
            it('should render correct inputs', function () {
              var expectedResult = 'Normal(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for gamma distributions', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'manualGamma';
            });
            it('should render correct inputs', function () {
              var expectedResult = 'Gamma(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
        });
      });
      describe('for effects,', function () {
        beforeEach(function () {
          cell = {
            inputType: 'effect',
            inputParameters: angular.copy(NULL_PARAMETERS)
          };
        });
        describe('for dichotomous,', function () {
          beforeEach(function () {
            cell.dataType = 'dichotomous';
            cell.firstParameter = 0.5;
          });
          describe('for decimal input', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousDecimal';
            });
            it('should render correct inputs', function () {
              var expectedResult = '0.5\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for decimal inputs with sample size', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousDecimalSampleSize';
              cell.secondParameter = 100;
            });
            it('should render correct inputs with sample size', function () {
              var expectedResult = '0.5 (100)\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function () {
              cell.isNormal = true;
              var expectedResult = '0.5 (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage input', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousPercentage';
            });
            it('should render correct inputs', function () {
              delete cell.secondParameter;
              var expectedResult = '0.5%\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage inputs with sample size', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousPercentageSampleSize';
              cell.firstParameter = 50;
              cell.secondParameter = 100;
            }); it('should render correct inputs with sample size', function () {
              var expectedResult = '50% (100)\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function () {
              cell.isNormal = true;
              var expectedResult = '50% (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for fraction input', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousFraction';
              cell.firstParameter = 50;
              cell.secondParameter = 100;
            });
            it('should render correct inputs', function () {
              var expectedResult = '50 / 100\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function () {
              cell.isNormal = true;
              var expectedResult = '50 / 100\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
        });
        describe('for continuous,', function () {
          beforeEach(function () {
            cell.dataType = 'continuous';
            cell.firstParameter = 50;
            cell.secondParameter = 5;
            cell.thirdParameter = 100;
          });
          describe('for parameter of interest mean,', function () {
            beforeEach(function () {
              cell.parameterOfInterest = 'mean';
            });
            describe('without dispersion', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'continuousMeanNoDispersion';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with standard error', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'continuousMeanStdErr';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50 (5)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render correct inputs with normal distribution', function () {
                var normalCell = angular.copy(cell);
                normalCell.isNormal = true;
                var expectedResult = '50 (5)\nNormal(50, 5)';
                var result = manualInputService.inputToString(normalCell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'continuousMeanConfidenceInterval';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50 (5; 100)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render correct inputs with normal distribution', function () {
                var normalCell = angular.copy(cell);
                normalCell.isNormal = true;
                var expectedResult = '50 (5; 100)\nNormal(50, ' + (100 - 5) / (2 * 1.96) + ')';
                var result = manualInputService.inputToString(normalCell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
          describe('for parameter of interest median', function () {
            beforeEach(function () {
              cell.parameterOfInterest = 'median';
            });
            describe('without dispersion', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'continuousMedianNoDispersion';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'continuousMedianConfidenceInterval';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50 (5; 100)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
          describe('for parameter of interest cumulative probability', function () {
            beforeEach(function () {
              cell.parameterOfInterest = 'cumulativeProbability';
              cell.scale = 'percentage';
            });
            describe('without dispersion', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'cumulativeProbabilityValue';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50%\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'cumulativeProbabilityValueCI';
              });
              it('should render correct inputs', function () {
                var expectedResult = '50% (5%; 100%)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
        });
      });
    });

    describe('prepareInputData', function () {
      it('should prepare the cells of the table for input', function () {
        var treatments = {
          alternative1: {
            title: 'alternative1',
            hash: 'alternative1'
          },
          alternative2: {
            title: 'alternative2',
            hash: 'alternative2'
          }
        };
        var criteria = [{
          title: 'criterion 1 title',
          hash: 'criterion 1 title',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other'
        }, {
          title: 'criterion 2 title',
          hash: 'criterion 2 title',
          inputType: 'effect',
          dataType: 'other'
        }];
        var result = manualInputService.prepareInputData(criteria, treatments);
        var expectedResult = {
          'criterion 1 title': {
            alternative1: criteria[0],
            alternative2: criteria[0]
          },
          'criterion 2 title': {
            alternative1: criteria[1],
            alternative2: criteria[1]
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should preserve data if there is old data supplied and the criterion type has not changed', function () {
        var treatments = {
          alternative1: {
            title: 'alternative1',
            hash: 'alternative1'
          },
          alternative2: {
            title: 'alternative2',
            hash: 'alternative2'
          }
        };
        var criteria = [{
          title: 'criterion 1 title',
          hash: 'criterion 1 title',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other'
        }, {
          title: 'criterion 2 title',
          hash: 'criterion 2 title',
          inputType: 'effect',
          dataType: 'other'
        }];

        var oldInputData = {
          'criterion 2 title': {
            alternative1: {
              title: 'criterion 2 oldtitle',
              hash: 'criterion 2 title',
              inputType: 'distribution',
              inputMethod: 'manualDistribution'
            },
            alternative2: criteria[1]
          }
        };
        var result = manualInputService.prepareInputData(criteria, treatments, oldInputData);

        var expectedResult = {
          'criterion 1 title': {
            alternative1: criteria[0],
            alternative2: criteria[0]
          },
          'criterion 2 title': {
            alternative1: oldInputData['criterion 2 title']['alternative1'],
            alternative2: criteria[1]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createProblem', function () {
      var title = 'title';
      var description = 'A random description of a random problem';
      var treatments = {
        alternative1: {
          title: 'alternative1',
          hash: 'alternative1'
        },
        alternative2: {
          title: 'alternative2',
          hash: 'alternative2'
        }
      };
      it('should create a problem, ready to go to the workspace', function () {
        var criteria = [{
          title: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true,
          hash: 'favorable criterion',
          inputType: 'effect',
          dataType: 'other'
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          hash: 'unfavorable criterion',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other'
        }];
        var inputData = {
          'favorable criterion': {
            alternative1: {
              title: 'favorable criterion',
              inputType: 'effect',
              dataType: 'other',
              firstParameter: 10,
              inputParameters: {
                id: 'value'
              }
            },
            alternative2: {
              title: 'favorable criterion',
              inputType: 'effect',
              dataType: 'other',
              firstParameter: 5,
              secondParameter: 3,
              thirdParameter: 7,
              inputParameters: {
                id: 'valueCI'
              }
            }
          },
          'unfavorable criterion': {
            alternative1: {
              title: 'unfavorable criterion',
              inputType: 'distribution',
              inputMethod: 'assistedDistribution',
              dataType: 'other',
              firstParameter: 20,
              inputParameters: {
                id: 'assistedOther'
              }
            },
            alternative2: {
              title: 'unfavorable criterion',
              inputType: 'distribution',
              inputMethod: 'assistedDistribution',
              dataType: 'other',
              firstParameter: 30,
              inputParameters: {
                id: 'assistedOther'
              }
            }
          }
        };
        var result = manualInputService.createProblem(criteria, treatments, title, description, inputData, true);
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
              scale: [-Infinity, Infinity],
              source: undefined,
              sourceLink: undefined,
              strengthOfEvidence: undefined
            },
            'unfavorable criterion': {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity],
              source: undefined,
              sourceLink: undefined,
              strengthOfEvidence: undefined
            }
          },
          alternatives: {
            alternative1: {
              title: 'alternative1'
            },
            alternative2: {
              title: 'alternative2'
            }
          },
          performanceTable: [{
            alternative: 'alternative1',
            criterion: 'favorable criterion',
            performance: {
              type: 'exact',
              value: 10,
              input: undefined
            }
          }, {
            alternative: 'alternative2',
            criterion: 'favorable criterion',
            performance: {
              type: 'exact',
              value: 5,
              input: {
                value: 5,
                lowerBound: 3,
                upperBound: 7
              }
            }
          }, {
            alternative: 'alternative1',
            criterion: 'unfavorable criterion',
            performance: {
              type: 'exact',
              value: 20,
              input: undefined
            }
          }, {
            alternative: 'alternative2',
            criterion: 'unfavorable criterion',
            performance: {
              type: 'exact',
              value: 30,
              input: undefined
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    xdescribe('createInputFromOldWorkspace', function () {
      it('should calculate the effects table input parameters from the performanceTable of the old workspace', function () {
        var criteria = [{
          title: 'criterion 1',
          hash: 'c1'
        }, {
          title: 'criterion 2',
          hash: 'c2',
          dataSource: 'study',
          dataType: 'dichotomous'
        }, {
          title: 'criterion 3',
          hash: 'c3',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 4',
          hash: 'c4',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 5',
          hash: 'c5',
          dataSource: 'study',
          dataType: 'survival'
        }];
        var alternatives = [{
          title: 'alternative 1',
          hash: 'a1'
        }];
        var oldWorkspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1'
              },
              crit2: {
                title: 'criterion 2'
              },
              crit3: {
                title: 'criterion 3'
              },
              crit4: {
                title: 'criterion 4'
              },
              crit5: {
                title: 'criterion 5'
              }
            },
            alternatives: {
              alt1: {
                title: 'alternative 1'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: {
                type: 'exact',
                value: 1337
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt1',
              performance: {
                type: 'dbeta',
                parameters: {
                  alpha: 12,
                  beta: 23
                }
              }
            }, {
              criterion: 'crit3',
              alternative: 'alt1',
              performance: {
                type: 'dt',
                parameters: {
                  dof: 123,
                  stdErr: 2.3,
                  mu: 30
                }
              }
            }, {
              criterion: 'crit4',
              alternative: 'alt1',
              performance: {
                type: 'dnorm',
                parameters: {
                  sigma: 1.2,
                  mu: 23
                }
              }
            }, {
              criterion: 'crit5',
              alternative: 'alt1',
              performance: {
                type: 'dsurv',
                parameters: {
                  alpha: 12.001,
                  beta: 23.001,
                  summaryMeasure: 'mean'
                }
              }
            },]
          }
        };
        var inputData = {
          c1: {
            a1: {
              type: 'exact',
              value: undefined
            }
          },
          c2: {
            a1: {
              type: 'dbeta',
              count: undefined,
              sampleSize: undefined
            }
          },
          c3: {
            a1: {
              type: 'dt',
              mu: undefined,
              stdErr: undefined,
              sampleSize: undefined
            }
          },
          c4: {
            a1: {
              type: 'dnorm',
              stdErr: undefined,
              mu: undefined
            }
          },
          c5: {
            a1: {
              type: 'dsurv',
              events: undefined,
              exposure: undefined,
              summaryMeasure: undefined
            }
          }
        };
        var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace, inputData);
        var expectedResult = {
          c1: {
            a1: {
              type: 'exact',
              value: 1337,
              isInvalid: false,
              label: '1337\nDistribution: none',
              exactType: 'exact'
            }
          },
          c2: {
            a1: {
              type: 'dbeta',
              count: 11,
              sampleSize: 33,
              isInvalid: false,
              label: '11 / 33\nDistribution: beta'
            }
          },
          c3: {
            a1: {
              type: 'dt',
              mu: 30,
              stdErr: 2.3,
              sampleSize: 124,
              isInvalid: false,
              continuousType: 'SEt',
              label: '30 (2.3), 124\nDistribution: Student\'s t'
            }
          },
          c4: {
            a1: {
              type: 'dnorm',
              mu: 23,
              stdErr: 1.2,
              isInvalid: false,
              continuousType: 'SEnorm',
              label: '23 (1.2)\nDistribution: normal'
            }
          },
          c5: {
            a1: {
              type: 'dsurv',
              events: 12,
              exposure: 23,
              summaryMeasure: 'mean',
              isInvalid: false,
              label: '12 / 23\nDistribution: gamma',
              timeScale: undefined
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    xdescribe('copyWorkspaceCriteria', function () {
      it('should copy the criteria from the oldworkspace to the format used by the rest of the manual input, preserving units and value tree', function () {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'bla',
                source: 'single study',
                sourceLink: 'http://www.drugis.org',
                unitOfMeasurement: 'Proportion'
              },
              crit2: {
                title: 'criterion 2',
                source: 'single study',
                sourceLink: 'http://www.drugis.org',
                unitOfMeasurement: 'Response size'
              },
              crit3: {
                title: 'criterion 3',
                source: 'single study',
              },
              crit4: {
                title: 'criterion 4',
                source: 'single study',
              },
              crit5: {
                title: 'criterion 5',
                source: 'single study',
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              performance: {
                type: 'dsurv',
                parameters: {
                  summaryMeasure: 'mean',
                  time: 200,
                }
              }
            }, {
              criterion: 'crit2',
              performance: {
                type: 'dbeta'
              }
            }, {
              criterion: 'crit3',
              performance: {
                type: 'dt'
              }
            }, {
              criterion: 'crit4',
              performance: {
                type: 'dnorm'
              }
            }, {
              criterion: 'crit5',
              performance: {
                type: 'exact'
              }
            }],
            valueTree: {
              title: 'Benefit-risk balance',
              children: [{
                title: 'Favourable effects',
                criteria: ['crit1', 'crit2']
              }, {
                title: 'Unfavourable effects',
                criteria: ['crit3', 'crit4', 'crit5']
              }]
            }
          }
        };
        var result = manualInputService.copyWorkspaceCriteria(workspace);
        var expectedResult = [{
          title: 'criterion 1',
          description: 'bla',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'study',
          dataType: 'survival',
          isFavorable: true,
          summaryMeasure: 'mean',
          timePointOfInterest: 200,
          timeScale: 'time scale not set',
          unitOfMeasurement: 'Proportion'
        }, {
          title: 'criterion 2',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          isFavorable: true,
          dataSource: 'study',
          dataType: 'dichotomous',
          unitOfMeasurement: 'Response size'
        }, {
          title: 'criterion 3',
          source: 'single study',
          isFavorable: false,
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 4',
          source: 'single study',
          isFavorable: false,
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 5',
          isFavorable: false,
          source: 'single study'
        }];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
