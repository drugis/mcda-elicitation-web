import TableCell from '@material-ui/core/TableCell';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {AnalysisType} from '@shared/interface/ISettings';
import IWorkspace from '@shared/interface/IWorkspace';
import {EffectsTableContext} from 'app/ts/EffectsTable/EffectsTableContext/EffectsTableContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import DistributionValueCell from './DistributionValueCell/DistributionValueCell';
import EffectValueCell from './EffectValueCell/EffectValueCell';

export default function ValueCell({
  alternativeId,
  dataSourceId
}: {
  alternativeId: string;
  dataSourceId: string;
}) {
  const {workspace, scales, canBePercentage} = useContext(EffectsTableContext);
  const {analysisType} = useContext(SettingsContext);
  const valueLabel = buildValueLabel(analysisType, workspace);

  function findValue<T extends Effect | Distribution>(items: T[]): T {
    return _.find(items, (item: T) => {
      return (
        item.alternativeId === alternativeId &&
        item.dataSourceId === dataSourceId
      );
    });
  }

  function findScale(scales: Record<string, Record<string, IScale>>): IScale {
    if (scales[dataSourceId] && scales[dataSourceId][alternativeId]) {
      return scales[dataSourceId][alternativeId];
    } else {
      return undefined;
    }
  }

  function buildValueLabel(
    analysisType: AnalysisType,
    workspace: IWorkspace
  ): JSX.Element {
    return analysisType === 'deterministic' ? (
      <EffectValueCell
        effect={findValue(workspace.effects)}
        scale={findScale(scales)}
        canBePercentage={canBePercentage(dataSourceId)}
      />
    ) : (
      <DistributionValueCell
        distribution={findValue(workspace.distributions)}
        scale={findScale(scales)}
        canBePercentage={canBePercentage(dataSourceId)}
      />
    );
  }

  return (
    <TableCell id={`value-cell-${dataSourceId}-${alternativeId}`}>
      {valueLabel}
    </TableCell>
  );
}
