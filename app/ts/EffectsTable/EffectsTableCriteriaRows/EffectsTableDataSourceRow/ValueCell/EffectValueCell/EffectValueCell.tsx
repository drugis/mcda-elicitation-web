import {TableCell} from '@material-ui/core';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import {renderEffect} from './EffectValueCellService';

export default function EffectValueCell({
  effect,
  scale,
  usePercentage
}: {
  effect: Effect;
  scale: IScale;
  usePercentage: boolean;
}) {
  const {displayMode} = useContext(SettingsContext);

  return (
    <TableCell>
      <div className="text-centered">
        {renderEffect(effect, displayMode, usePercentage, scale)}
      </div>
    </TableCell>
  );
}
