import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
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

export function getWarnings(
  isRelativeProblem: boolean,
  displayMode: TDisplayMode,
  analysisType: TAnalysisType,
  hasNoEffects: boolean,
  hasNoDistributions: boolean
) {
  let warnings = [];
  if (hasNoEnteredData(isRelativeProblem, displayMode)) {
    warnings.push('No entered data available.');
  } else if (hasNoEnteredEffect(hasNoEffects, displayMode, analysisType)) {
    warnings.push('No entered data available for deterministic analysis.');
  } else if (
    hasNoEnteredDistribution(hasNoDistributions, displayMode, analysisType)
  ) {
    warnings.push('No entered data available for SMAA analysis.');
  }
  return warnings;
}

function hasNoEnteredData(
  isRelativeProblem: boolean,
  displayMode: TDisplayMode
) {
  return isRelativeProblem && displayMode === 'enteredData';
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

export function settingsChanged(
  currentSettings: ISettings,
  toggledColumns: IToggledColumns,
  updatedSettings: Omit<
    ISettings,
    'isRelativeProblem' | 'hasNoEffects' | 'hasNoDistributions'
  >,
  updatedToggledColumns: IToggledColumns
): boolean {
  return !_.isEqual(
    {
      ...toggledColumns,
      ..._.omit(currentSettings, [
        'isRelativeProblem',
        'hasNoEffects',
        'hasNoDistributions'
      ])
    },
    {...updatedSettings, ...updatedToggledColumns}
  );
}
