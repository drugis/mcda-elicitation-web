import IAlternative from '@shared/interface/IAlternative';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {IRelativePerformanceTableEntry} from '@shared/interface/Problem/IRelativePerformanceTableEntry';
import {TPerformanceTableEntry} from '@shared/interface/Problem/TPerformanceTableEntry';
import {isAbsoluteEntry} from '@shared/workspaceService';
import Ajv from 'ajv';
import _ from 'lodash';

export function validateJsonSchema(problem: IProblem): string[] {
  const ajv = loadSchemas();
  if (!ajv.validate('problem.json', problem)) {
    return _.map(ajv.errors, (error) => `${error.dataPath} ${error.message}`);
  } else {
    return [];
  }
}

function loadSchemas(): Ajv {
  let ajv = new Ajv({allErrors: true});
  loadSchema(ajv, 'problem.json');
  loadSchema(ajv, 'dataSource.json');
  loadSchema(ajv, 'relativeEntry.json');
  loadSchema(ajv, 'absoluteEntry.json');
  loadSchema(ajv, 'emptyPerformance.json');

  loadSchema(ajv, 'valueEffect.json');
  loadSchema(ajv, 'valueSEEffect.json');
  loadSchema(ajv, 'valueCIEffect.json');
  loadSchema(ajv, 'valueSampleSizeEffect.json');
  loadSchema(ajv, 'eventsSampleSizeEffect.json');
  loadSchema(ajv, 'rangeEffect.json');

  loadSchema(ajv, 'normalDistribution.json');
  loadSchema(ajv, 'tDistribution.json');
  loadSchema(ajv, 'betaDistribution.json');
  loadSchema(ajv, 'gammaDistribution.json');
  loadSchema(ajv, 'survivalDistribution.json');
  loadSchema(ajv, 'rangeDistribution.json');
  return ajv;
}

function loadSchema(ajv: Ajv, schemaName: string): void {
  const schema = require('schema-basePath/' + schemaName);
  ajv.addSchema(schema, schemaName);
}

export function validateWorkspaceConstraints(problem: IProblem): string[] {
  const constraints = [
    missingTitle,
    performanceTableWithInvalidAlternative,
    performanceTableWithInvalidCriterion,
    performanceTableWithMissingData,
    relativePerformanceWithBadMu,
    relativePerformanceWithBadCov
  ];
  return _(constraints)
    .map((constraint: (problem: IProblem) => string): string => {
      return constraint(problem);
    })
    .filter()
    .value();
}

export function missingTitle(problem: IProblem): string {
  return _.isEmpty(problem.title) ? 'Missing title' : undefined;
}

export function performanceTableWithInvalidAlternative({
  performanceTable,
  alternatives
}: IProblem): string {
  const entry = _.find(
    performanceTable,
    (tableEntry: TPerformanceTableEntry): boolean =>
      isAbsoluteEntry(tableEntry) && !alternatives[tableEntry.alternative]
  );
  if (entry && isAbsoluteEntry(entry)) {
    return `Performance table contains data for nonexistent alternative: "${entry.alternative}"`;
  }
}

export function performanceTableWithInvalidCriterion({
  performanceTable,
  criteria
}: IProblem): string {
  const entry = _.find(
    performanceTable,
    (tableEntry: TPerformanceTableEntry) => {
      return !criteria[tableEntry.criterion];
    }
  );
  if (entry) {
    return `Performance table contains data for nonexistent criterion: "${entry.criterion}"`;
  }
}

export function performanceTableWithMissingData(problem: IProblem): string {
  if (!hasEnoughEntries(problem)) {
    return 'Performance table is missing data';
  }
}

function hasEnoughEntries({
  alternatives,
  criteria,
  performanceTable
}: IProblem): boolean {
  return _.every(alternatives, (alternative: IAlternative): boolean => {
    return _.every(criteria, (criterion: IProblemCriterion): boolean => {
      return hasEntryForCoordinate(alternative, criterion, performanceTable);
    });
  });
}

function hasEntryForCoordinate(
  alternative: IAlternative,
  criterion: IProblemCriterion,
  performanceTable: TPerformanceTableEntry[]
): boolean {
  return _.some(
    performanceTable,
    (entry: TPerformanceTableEntry): boolean =>
      entry.criterion === criterion.id &&
      (!isAbsoluteEntry(entry) || entry.alternative === alternative.id)
  );
}

export function relativePerformanceWithBadMu(problem: IProblem): string {
  const entryWithBadMu = findEntryWithBadMu(problem);
  if (entryWithBadMu) {
    return `The mu of the criterion: "${entryWithBadMu.criterion}" refers to nonexistent alternative`;
  }
}

function findEntryWithBadMu({
  performanceTable,
  alternatives
}: IProblem): TPerformanceTableEntry {
  return _.find(
    performanceTable,
    (tableEntry: TPerformanceTableEntry): boolean =>
      !isAbsoluteEntry(tableEntry) &&
      checkForInvalidAlternativeInMu(tableEntry, alternatives)
  );
}

function checkForInvalidAlternativeInMu(
  entry: IRelativePerformanceTableEntry,
  alternatives: Record<string, IAlternative>
): boolean {
  return _.some(
    _.keys(entry.performance.distribution.parameters.relative.mu),
    (alternativeId: string) => !alternatives[alternativeId]
  );
}

export function relativePerformanceWithBadCov(problem: IProblem): string {
  const entryWithBadCov = findEntryWithBadCov(problem);
  if (entryWithBadCov) {
    return `The covariance matrix of criterion: "${entryWithBadCov.criterion}" refers to nonexistent alternative`;
  }
}

function findEntryWithBadCov(problem: IProblem): TPerformanceTableEntry {
  return _.find(
    problem.performanceTable,
    (tableEntry: TPerformanceTableEntry): boolean => {
      if (!isAbsoluteEntry(tableEntry)) {
        const {
          rownames,
          colnames
        } = tableEntry.performance.distribution.parameters.relative.cov;
        return checkForInvalidAlternativeInCov(
          rownames,
          colnames,
          problem.alternatives
        );
      }
    }
  );
}

function checkForInvalidAlternativeInCov(
  rowNames: string[],
  colNames: string[],
  alternatives: Record<string, IAlternative>
): boolean {
  return (
    _.some(rowNames, (rowVal: string): boolean => !alternatives[rowVal]) ||
    _.some(colNames, (colVal: string): boolean => !alternatives[colVal])
  );
}
