import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {AnalysisType} from '@shared/interface/ISettings';
import {canDSBePercentage} from 'app/ts/EffectsTable/EffectsTableUtil';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
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
  const {analysisType, showPercentages} = useContext(SettingsContext);
  const {setErrorMessage} = useContext(ErrorContext);

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

  function findValue<T extends Effect | Distribution>(
    items: T[],
    dataSourceId: string,
    alternativeId: string
  ): T {
    return _.find(items, (item: T) => {
      return (
        item.alternativeId === alternativeId &&
        item.dataSourceId === dataSourceId
      );
    });
  }

  function findScale(
    scales: Record<string, Record<string, IScale>>,
    dataSourceId: string,
    alternativeId: string
  ): IScale {
    if (scales[dataSourceId] && scales[dataSourceId][alternativeId]) {
      return scales[dataSourceId][alternativeId];
    } else {
      return undefined;
    }
  }

  function buildValueLabel(analysisType: AnalysisType): JSX.Element {
    if (analysisType === 'deterministic') {
      return renderEffectCell();
    } else {
      return renderDistributionCell();
    }
  }

  function renderEffectCell(): JSX.Element {
    if (effect || distribution) {
      return (
        <EffectValueCell
          effect={effect}
          scale={scale}
          usePercentage={usePercentage}
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

  return buildValueLabel(analysisType);
}
