import IProblem from '@shared/interface/Problem/IProblem';
import Ajv, {ErrorObject} from 'ajv';

export function validateProblem(problem: IProblem): ErrorObject[] {
  const ajv = loadSchemas();
  if (!ajv.validate('problem.json', problem)) {
    return ajv.errors;
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
