export interface ICriterionRow {
  criterionId: string;
  dataSourceId: string;
  title: string;
  unit: string;
  alt1Value: string;
  alt2Value: string;
  alt3Value: string;
  alt4Value: string;
  alt5Value: string;
  alt6Value: string;
  alt7Value: string;
}

export interface ICriterionRowWithUncertainty extends ICriterionRow {
  alt1Uncertainty: string;
  alt2Uncertainty: string;
  alt3Uncertainty: string;
  alt4Uncertainty: string;
  alt5Uncertainty: string;
}

export const percentageCriterionWithEffectsPercentifiedEntered: ICriterionRow = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithEffectsPercentifiedEntered: ICriterionRow = {
  criterionId: 'decimalCriterion',
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

export const percentageCriterionWithEffectsDepercentifiedEntered: ICriterionRow = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithEffectsDepercentifiedEntered: ICriterionRow = {
  criterionId: 'decimalCriterion',
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

export const customCriterionWithEffectsEntered: ICriterionRow = {
  criterionId: 'customCriterion',
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

export const percentageCriterionWithDistributionsPercentifiedEntered: ICriterionRow = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithDistributionsPercentifiedEntered: ICriterionRow = {
  criterionId: 'decimalCriterion',
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

export const percentageCriterionWithDistributionsDepercentifiedEntered: ICriterionRow = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithDistributionsDepercentifiedEntered: ICriterionRow = {
  criterionId: 'decimalCriterion',
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

export const customCriterionWithDistributionsEntered: ICriterionRow = {
  criterionId: 'customCriterion',
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

export const percentageCriterionWithEffectsPercentifiedAnalysis: ICriterionRow = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithEffectsPercentifiedAnalysis: ICriterionRow = {
  criterionId: 'decimalCriterion',
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

export const percentageCriterionWithEffectsDepercentifiedAnalysis: ICriterionRow = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithEffectsDepercentifiedAnalysis: ICriterionRow = {
  criterionId: 'decimalCriterion',
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

export const customCriterionWithEffectsAnalysis: ICriterionRow = {
  criterionId: 'customCriterion',
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

export const percentageCriterionWithDistributionsPercentifiedAnalysis: ICriterionRowWithUncertainty = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithDistributionsPercentifiedAnalysis: ICriterionRowWithUncertainty = {
  criterionId: 'decimalCriterion',
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

export const percentageCriterionWithDistributionsDepercentifiedAnalysis: ICriterionRowWithUncertainty = {
  criterionId: 'percentageCriterion',
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

export const decimalCriterionWithDistributionsDepercentifiedAnalysis: ICriterionRowWithUncertainty = {
  criterionId: 'decimalCriterion',
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

export const customCriterionWithDistributionsAnalysis: ICriterionRowWithUncertainty = {
  criterionId: 'customCriterion',
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
