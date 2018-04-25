'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var PerformanceService = function() {
    function buildExactPerformance(value, input) {
      return {
        type: 'exact',
        value: value,
        input: input
      };
    }

    function buildExactConfidencePerformance(cell) {
      return buildExactPerformance(cell.firstParameter, {
        value: cell.firstParameter,
        lowerBound: cell.secondParameter,
        upperBound: cell.thirdParameter
      });
    }

    function buildNormalPerformance(mu, sigma, input) {
      return {
        type: 'dnorm',
        parameters: {
          mu: mu,
          sigma: sigma
        },
        input: input
      };
    }

    function buildBetaPerformance(alpha, beta, input) {
      return buildAlphaBetaPerformance('dbeta', alpha, beta, input);
    }

    function buildGammaPerformance(alpha, beta, input) {
      return buildAlphaBetaPerformance('dgamma', alpha, beta, input);
    }

    function buildStudentTPerformance(mu, sigma, dof, input) {
      return {
        type: 'dt',
        parameters: {
          mu: mu,
          stdErr: sigma,
          dof: dof
        },
        input: input
      };
    }

    // privates

    function buildAlphaBetaPerformance(type, alpha, beta, input) {
      return {
        type: type,
        parameters: {
          alpha: alpha,
          beta: beta
        },
        input: input
      };
    }

    return {
      buildExactPerformance: buildExactPerformance,
      buildExactConfidencePerformance: buildExactConfidencePerformance,
      buildNormalPerformance: buildNormalPerformance,
      buildBetaPerformance: buildBetaPerformance,
      buildGammaPerformance: buildGammaPerformance,
      buildStudentTPerformance: buildStudentTPerformance
    };
  };
  return dependencies.concat(PerformanceService);
});
