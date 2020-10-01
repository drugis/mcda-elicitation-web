import TableCell from '@material-ui/core/TableCell';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import EmptyCell from '../EmptyCell/EmptyCell';
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

  const renderedEffect = renderEffect(
    effect,
    displayMode,
    usePercentage,
    scale
  );
  return renderedEffect ? (
    <TableCell id={`value-cell-${effect.dataSourceId}-${effect.alternativeId}`}>
      <div
        className="text-centered"
        style={{whiteSpace: 'pre-wrap', minWidth: '6rem'}}
      >
        {renderedEffect}
      </div>
    </TableCell>
  ) : (
    <EmptyCell
      dataSourceId={effect.dataSourceId}
      alternativeId={effect.alternativeId}
    />
  );
}
