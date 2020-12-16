import ICriterionRow from './ICriterionRow';

export default interface ICriterionRowWithUncertainty extends ICriterionRow {
  alt1Uncertainty: string;
  alt2Uncertainty: string;
  alt3Uncertainty: string;
  alt4Uncertainty: string;
  alt5Uncertainty: string;
}
