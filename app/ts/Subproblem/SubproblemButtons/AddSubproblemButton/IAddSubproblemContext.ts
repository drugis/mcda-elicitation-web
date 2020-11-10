import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';

export default interface IAddSubproblemContext {
  title: string;
  errors: string[];
  isCriterionDeselectionDisabled: boolean;
  scaleRangesWarnings: string[];
  missingValueWarnings: string[];
  configuredRanges: Record<string, [number, number]>;
  getIncludedDataSourceForCriterion: (criterion: ICriterion) => IDataSource;
  getSliderRangeForDS: (dataSourceId: string) => [number, number];
  isCriterionExcluded: (criterionId: string) => boolean;
  isDataSourceDeselectionDisabled: (criterionId: string) => boolean;
  isDataSourceExcluded: (dataSourceId: string) => boolean;
  isAlternativeExcluded: (alternativeId: string) => boolean;
  isAlternativeDeselectionDisabled: (id: string) => boolean;
  setTitle: (title: string) => void;
  updateAlternativeInclusion: (id: string, newValue: boolean) => void;
  updateCriterionInclusion: (id: string, newValue: boolean) => void;
  updateDataSourceInclusion: (id: string, newValue: boolean) => void;
  updateSliderRangeforDS: (
    dataSourceId: string,
    newValue: [number, number]
  ) => void;
  resetToDefault: () => void;
  setConfiguredRange: (
    dataSourceId: string,
    lowestConfiguredValue: number,
    highestConfiguredValue: number
  ) => void;
  addSubproblem: () => void;
  updateStepSizeForDS: (dataSourceId: string, newStepSize: number) => void;
  getStepSizeForDS: (dataSourceId: string) => number;
}
