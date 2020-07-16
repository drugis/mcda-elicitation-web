import TableCell from '@material-ui/core/TableCell';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
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
  const {workspace} = useContext(EffectsTableContext);
  const {deterministicOrSmaa} = useContext(SettingsContext);
  const valueLabel = buildValueLabel(deterministicOrSmaa, workspace);

  function findValue<T extends Effect | Distribution>(things: T[]): T {
    return _.find(things, (effect: T) => {
      return (
        effect.alternativeId === alternativeId &&
        effect.dataSourceId === dataSourceId
      );
    });
  }

  function buildValueLabel(
    deterministicOrSmaa: 'deterministic' | 'smaa',
    workspace: IWorkspace
  ) {
    return deterministicOrSmaa === 'deterministic' ? (
      <EffectValueCell effect={findValue(workspace.effects)} />
    ) : (
      <DistributionValueCell
        distribution={findValue(workspace.distributions)}
      />
    );
  }

  return <TableCell>{valueLabel}</TableCell>;
}
