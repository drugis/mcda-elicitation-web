import ITestCriterionRow from './ITestCriterionRow';
import ITestCriterionRowWithUncertainty from './ITestCriterionRowWithUncertainty';

export const percentageCriterionWithEffectsPercentifiedEntered: ITestCriterionRow = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '%',
  alt1Value: '1',
  alt2Value: '1\n(0, 2)',
  alt3Value: '[1, 90]',
  alt4Value: '',
  alt5Value: 'text me',
  alt6Value: '',
  alt7Value: ''
};

export const decimalCriterionWithEffectsPercentifiedEntered: ITestCriterionRow = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '%',
  alt1Value: '100',
  alt2Value: '20\n(10, 50)',
  alt3Value: '[0, 90]',
  alt4Value: '',
  alt5Value: 'text me',
  alt6Value: '',
  alt7Value: ''
};

export const percentageCriterionWithEffectsDepercentifiedEntered: ITestCriterionRow = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '',
  alt1Value: '0.01',
  alt2Value: '0.01\n(0, 0.02)',
  alt3Value: '[0.01, 0.9]',
  alt4Value: '',
  alt5Value: 'text me',
  alt6Value: '',
  alt7Value: ''
};

export const decimalCriterionWithEffectsDepercentifiedEntered: ITestCriterionRow = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '',
  alt1Value: '1',
  alt2Value: '0.2\n(0.1, 0.5)',
  alt3Value: '[0, 0.9]',
  alt4Value: '',
  alt5Value: 'text me',
  alt6Value: '',
  alt7Value: ''
};

export const customCriterionWithEffectsEntered: ITestCriterionRow = {
  rowNumber: 3,
  dataSourceId: 'ds3Id',
  title: 'custom',
  unit: '',
  alt1Value: '1',
  alt2Value: '1\n(0, 2)',
  alt3Value: '[1, 90]',
  alt4Value: '',
  alt5Value: 'text me',
  alt6Value: '',
  alt7Value: ''
};

export const percentageCriterionWithDistributionsPercentifiedEntered: ITestCriterionRow = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '%',
  alt1Value: 'Normal(0, 0.5)',
  alt2Value: 'Beta(1, 5)',
  alt3Value: 'Gamma(1, 5)',
  alt4Value: '1',
  alt5Value: '[0, 90]',
  alt6Value: '',
  alt7Value: 'text me'
};

export const decimalCriterionWithDistributionsPercentifiedEntered: ITestCriterionRow = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '%',
  alt1Value: 'Normal(0, 50)',
  alt2Value: 'Beta(1, 5)',
  alt3Value: 'Gamma(1, 5)',
  alt4Value: '100',
  alt5Value: '[0, 90]',
  alt6Value: '',
  alt7Value: 'text me'
};

export const percentageCriterionWithDistributionsDepercentifiedEntered: ITestCriterionRow = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '',
  alt1Value: 'Normal(0, 0.005)',
  alt2Value: 'Beta(1, 5)',
  alt3Value: 'Gamma(1, 5)',
  alt4Value: '0.01',
  alt5Value: '[0, 0.9]',
  alt6Value: '',
  alt7Value: 'text me'
};

export const decimalCriterionWithDistributionsDepercentifiedEntered: ITestCriterionRow = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '',
  alt1Value: 'Normal(0, 0.5)',
  alt2Value: 'Beta(1, 5)',
  alt3Value: 'Gamma(1, 5)',
  alt4Value: '1',
  alt5Value: '[0, 0.9]',
  alt6Value: '',
  alt7Value: 'text me'
};

export const customCriterionWithDistributionsEntered: ITestCriterionRow = {
  rowNumber: 3,
  dataSourceId: 'ds3Id',
  title: 'custom',
  unit: '',
  alt1Value: 'Normal(0, 0.5)',
  alt2Value: 'Beta(1, 5)',
  alt3Value: 'Gamma(1, 5)',
  alt4Value: '1',
  alt5Value: '[0, 90]',
  alt6Value: '',
  alt7Value: 'text me'
};

export const percentageCriterionWithEffectsPercentifiedAnalysis: ITestCriterionRow = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '%',
  alt1Value: '1',
  alt2Value: '1',
  alt3Value: '45.5',
  alt4Value: '1',
  alt5Value: '45',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const decimalCriterionWithEffectsPercentifiedAnalysis: ITestCriterionRow = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '%',
  alt1Value: '100',
  alt2Value: '20',
  alt3Value: '45',
  alt4Value: '100',
  alt5Value: '45',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const percentageCriterionWithEffectsDepercentifiedAnalysis: ITestCriterionRow = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '',
  alt1Value: '0.01',
  alt2Value: '0.01',
  alt3Value: '0.455',
  alt4Value: '0.01',
  alt5Value: '0.45',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const decimalCriterionWithEffectsDepercentifiedAnalysis: ITestCriterionRow = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '',
  alt1Value: '1',
  alt2Value: '0.2',
  alt3Value: '0.45',
  alt4Value: '1',
  alt5Value: '0.45',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const customCriterionWithEffectsAnalysis: ITestCriterionRow = {
  rowNumber: 3,
  dataSourceId: 'ds3Id',
  title: 'custom',
  unit: '',
  alt1Value: '1',
  alt2Value: '1',
  alt3Value: '45.5',
  alt4Value: '1',
  alt5Value: '45',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const percentageCriterionWithDistributionsPercentifiedAnalysis: ITestCriterionRowWithUncertainty = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '%',
  alt1Value: '0',
  alt1Uncertainty: '-0.98, 0.98',
  alt2Value: '12.9',
  alt2Uncertainty: '0.505, 52.2',
  alt3Value: '13.9',
  alt3Uncertainty: '0.567, 73',
  alt4Value: '1',
  alt4Uncertainty: '1, 1',
  alt5Value: '45',
  alt5Uncertainty: '2.25, 87.7',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const decimalCriterionWithDistributionsPercentifiedAnalysis: ITestCriterionRowWithUncertainty = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '%',
  alt1Value: '0',
  alt1Uncertainty: '-98, 98',
  alt2Value: '12.9',
  alt2Uncertainty: '0.505, 52.2',
  alt3Value: '14.1',
  alt3Uncertainty: '0.547, 75.6',
  alt4Value: '100',
  alt4Uncertainty: '100, 100',
  alt5Value: '45',
  alt5Uncertainty: '2.25, 87.7',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const percentageCriterionWithDistributionsDepercentifiedAnalysis: ITestCriterionRowWithUncertainty = {
  rowNumber: 1,
  dataSourceId: 'ds1Id',
  title: 'percentages',
  unit: '',
  alt1Value: '0',
  alt1Uncertainty: '-0.0098, 0.0098',
  alt2Value: '0.129',
  alt2Uncertainty: '0.00505, 0.522',
  alt3Value: '0.139',
  alt3Uncertainty: '0.00567, 0.73',
  alt4Value: '0.01',
  alt4Uncertainty: '0.01, 0.01',
  alt5Value: '0.45',
  alt5Uncertainty: '0.0225, 0.877',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const decimalCriterionWithDistributionsDepercentifiedAnalysis: ITestCriterionRowWithUncertainty = {
  rowNumber: 2,
  dataSourceId: 'ds2Id',
  title: 'decimals',
  unit: '',
  alt1Value: '0',
  alt1Uncertainty: '-0.98, 0.98',
  alt2Value: '0.129',
  alt2Uncertainty: '0.00505, 0.522',
  alt3Value: '0.141',
  alt3Uncertainty: '0.00547, 0.756',
  alt4Value: '1',
  alt4Uncertainty: '1, 1',
  alt5Value: '0.45',
  alt5Uncertainty: '0.0225, 0.877',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};

export const customCriterionWithDistributionsAnalysis: ITestCriterionRowWithUncertainty = {
  rowNumber: 3,
  dataSourceId: 'ds3Id',
  title: 'custom',
  unit: '',
  alt1Value: '0',
  alt1Uncertainty: '-0.98, 0.98',
  alt2Value: '0.129',
  alt2Uncertainty: '0.00505, 0.522',
  alt3Value: '0.139',
  alt3Uncertainty: '0.00499, 0.744',
  alt4Value: '1',
  alt4Uncertainty: '1, 1',
  alt5Value: '45',
  alt5Uncertainty: '2.25, 87.75',
  alt6Value: 'No data entered',
  alt7Value: 'No data entered'
};
