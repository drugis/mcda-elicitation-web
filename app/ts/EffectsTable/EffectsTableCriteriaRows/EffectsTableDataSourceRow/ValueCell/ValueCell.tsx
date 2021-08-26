import {EffectsTableContext} from 'app/ts/EffectsTable/EffectsTableContext';
import {
  canDSBePercentage,
  findScale,
  findValue
} from 'app/ts/EffectsTable/EffectsTableUtil';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {useContext} from 'react';
import DistributionValueCell from './DistributionValueCell/DistributionValueCell';
import EffectValueCell from './EffectValueCell/EffectValueCell';
import NMACell from './NMACell/NMACell';

export default function ValueCell({
  alternativeId,
  dataSourceId,
  isExcluded
}: {
  alternativeId: string;
  dataSourceId: string;
  isExcluded?: boolean;
}) {
  const {workspace, scales} = useContext(WorkspaceContext);
  const {showPercentages} = useContext(SettingsContext);
  const {setErrorMessage} = useContext(ErrorContext);
  const {displayMode} = useContext(EffectsTableContext);

  const usePercentage =
    canDSBePercentage(workspace.criteria, dataSourceId) && showPercentages;
  const effect = findValue(workspace.effects, dataSourceId, alternativeId);
  const distribution = findValue(
    workspace.distributions,
    dataSourceId,
    alternativeId
  );
  const scale = findScale(scales, dataSourceId, alternativeId);
  const hasScaleValues = scale['50%'] !== null && scale['50%'] !== undefined;

  function buildValueLabel(): JSX.Element {
    if (
      displayMode === 'enteredEffects' ||
      displayMode === 'deterministicValues'
    ) {
      return renderEffectCell();
    } else {
      return renderDistributionCell();
    }
  }

  function renderEffectCell(): JSX.Element {
    if (effect || distribution || hasScaleValues) {
      return (
        <EffectValueCell
          effect={effect}
          scale={scale}
          usePercentage={usePercentage}
          isExcluded={isExcluded}
          dataSourceId={dataSourceId}
          alternativeId={alternativeId}
        />
      );
    } else {
      setErrorMessage('No values to display for current view settings');
    }
  }

  function renderDistributionCell(): JSX.Element {
    if (distribution || effect) {
      return (
        <DistributionValueCell
          distribution={distribution}
          scale={scale}
          usePercentage={usePercentage}
          dataSourceId={dataSourceId}
          alternativeId={alternativeId}
          isExcluded={isExcluded}
        />
      );
    } else if (hasScaleValues) {
      return (
        <NMACell
          dataSourceId={dataSourceId}
          alternativeId={alternativeId}
          scale={scale}
          usePercentage={usePercentage}
          isExcluded={isExcluded}
        />
      );
    } else {
      setErrorMessage('No values to display for current view settings');
    }
  }

  return buildValueLabel();
}
