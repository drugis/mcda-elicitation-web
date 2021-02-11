import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
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
