import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import _ from 'lodash';

export function calculateNumberOfToggledColumns(
  toggledColumns: IToggledColumns
): number {
  return (
    1 +
    _.filter(
      _.pick(toggledColumns, ['description', 'units', 'references', 'strength'])
    ).length
  );
}

export function getWarning(
  displayMode: TDisplayMode,
  analysisType: TAnalysisType,
  hasNoEffects: boolean,
  hasNoDistributions: boolean
): string {
  if (hasNoEnteredEffect(hasNoEffects, displayMode, analysisType)) {
    return 'No entered data available for deterministic analysis.';
  } else if (
    hasNoEnteredDistribution(hasNoDistributions, displayMode, analysisType)
  ) {
    return 'No entered data available for SMAA analysis.';
  } else {
    return '';
  }
}

function hasNoEnteredEffect(
  hasNoEffects: boolean,
  displayMode: TDisplayMode,
  analysisType: TAnalysisType
) {
  return (
    hasNoEffects &&
    displayMode === 'enteredData' &&
    analysisType === 'deterministic'
  );
}

function hasNoEnteredDistribution(
  hasNoDistributions: boolean,
  displayMode: TDisplayMode,
  analysisType: TAnalysisType
) {
  return (
    hasNoDistributions &&
    displayMode === 'enteredData' &&
    analysisType === 'smaa'
  );
}
