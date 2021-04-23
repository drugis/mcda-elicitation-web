import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import _ from 'lodash';
import ToggledColumns from '../WorkspaceSettings/ToggledColumns/ToggledColumns';

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

export function getDisplayMode(
  isRelativeProblem: boolean,
  displayMode: TDisplayMode
) {
  return isRelativeProblem &&
    (displayMode === 'enteredDistributions' || displayMode === 'enteredEffects')
    ? 'smaaValues'
    : displayMode;
}

export function getInitialDisplayMode(
  isRelativeProblem: boolean,
  hasNoEffects: boolean
): TDisplayMode {
  if (isRelativeProblem) {
    return 'smaaValues';
  } else if (hasNoEffects) {
    return 'enteredDistributions';
  } else {
    return 'enteredEffects';
  }
}

export function getDefaultSettings(
  isRelativeProblem: boolean,
  hasNoEffects: boolean
): {defaultSettings: ISettings; defaultToggledColumns: IToggledColumns} {
  const defaultSettings: ISettings = {
    displayMode: getInitialDisplayMode(isRelativeProblem, hasNoEffects),
    randomSeed: 1234,
    calculationMethod: 'median',
    showPercentages: 'percentage'
  };

  const defaultToggledColumns: IToggledColumns = {
    references: true,
    strength: true,
    units: true,
    description: true
  };

  return {
    defaultSettings: defaultSettings,
    defaultToggledColumns: defaultToggledColumns
  };
}
