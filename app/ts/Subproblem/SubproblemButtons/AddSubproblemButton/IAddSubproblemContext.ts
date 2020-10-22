export default interface IAddSubproblemContext {
  title: string;
  errors: string[];
  isCriterionDeselectionDisabled: boolean;
  scaleRangesWarnings: string[];
  missingValueWarnings: string[];
  isCriterionExcluded: (criterionId: string) => boolean;
  isDataSourceExcluded: (dataSourceId: string) => boolean;
  isAlternativeExcluded: (alternativeId: string) => boolean;
  isAlternativeDisabled: (id: string) => boolean;
  setTitle: (title: string) => void;
  updateAlternativeInclusion: (id: string, newValue: boolean) => void;
  updateCriterionInclusion: (id: string, newValue: boolean) => void;
  updateDataSourceInclusion: (id: string, newValue: boolean) => void;
  isDataSourceDeselectionDisabled: (criterionId: string) => boolean;
}
