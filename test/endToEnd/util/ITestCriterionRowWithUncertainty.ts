import ITestCriterionRow from './ITestCriterionRow';

export default interface ITestCriterionRowWithUncertainty
  extends ITestCriterionRow {
  alt1Uncertainty: string;
  alt2Uncertainty: string;
  alt3Uncertainty: string;
  alt4Uncertainty: string;
  alt5Uncertainty: string;
}
