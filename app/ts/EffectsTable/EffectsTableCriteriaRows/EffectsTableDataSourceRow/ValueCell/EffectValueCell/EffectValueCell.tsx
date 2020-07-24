import {TableCell} from '@material-ui/core';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import {renderEffect} from './EffectValueCellService';

export default function EffectValueCell({
  effect,
  scale,
  usePercentage,
  dataSourceId,
  alternativeId
}: {
  effect: Effect;
  scale: IScale;
  usePercentage: boolean;
  dataSourceId: string;
  alternativeId: string;
}) {
  const {displayMode} = useContext(SettingsContext);

  return (
    <TableCell id={`value-cell-${dataSourceId}-${alternativeId}`}>
      <div className="text-centered">
        {renderEffect(effect, displayMode, usePercentage, scale)}
      </div>
    </TableCell>
  );
}
