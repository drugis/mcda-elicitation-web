import TableCell from '@material-ui/core/TableCell';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';
import {useContext} from 'react';
import EmptyCell from '../EmptyCell/EmptyCell';
import {
  renderEnteredValues,
  renderValuesForAnalysis
} from './EffectValueCellUtil';

export default function EffectValueCell({
  effect,
  scale,
  usePercentage,
  isExcluded,
  dataSourceId,
  alternativeId
}: {
  effect: Effect;
  scale: IScale;
  usePercentage: boolean;
  isExcluded?: boolean;
  dataSourceId: string;
  alternativeId: string;
}) {
  const {setErrorMessage} = useContext(ErrorContext);
  const {
    settings: {displayMode}
  } = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  function renderEffect(): string {
    if (displayMode === 'enteredEffects') {
      return renderEnteredValues(effect, usePercentage, false);
    } else if (displayMode === 'deterministicValues') {
      return renderValuesForAnalysis(effect, usePercentage, scale);
    } else {
      setErrorMessage('Cannot render effect');
    }
  }

  const renderedEffect = renderEffect();
  return renderedEffect ? (
    <TableCell
      id={`value-cell-${dataSourceId}-${alternativeId}`}
      style={cellStyle}
    >
      <div
        style={{...textCenterStyle, whiteSpace: 'pre-wrap', minWidth: '6rem'}}
      >
        {renderedEffect}
      </div>
    </TableCell>
  ) : (
    <EmptyCell
      dataSourceId={dataSourceId}
      alternativeId={alternativeId}
      isExcluded={isExcluded}
    />
  );
}
