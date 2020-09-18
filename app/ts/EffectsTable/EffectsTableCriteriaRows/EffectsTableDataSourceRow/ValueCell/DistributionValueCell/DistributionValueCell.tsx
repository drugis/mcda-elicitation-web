import TableCell from '@material-ui/core/TableCell';
import {Distribution} from '@shared/interface/IDistribution';
import IScale from '@shared/interface/IScale';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import EmptyCell from '../EmptyCell/EmptyCell';
import UncertainValue from '../UncertainValue/UncertainValue';
import {getStringForValue} from '../ValueCellService';
import {renderDistribution} from './DistributionValueCellService';

export default function DistributionValueCell({
  distribution,
  scale,
  usePercentage,
  dataSourceId,
  alternativeId
}: {
  distribution: Distribution;
  scale: IScale;
  usePercentage: boolean;
  dataSourceId: string;
  alternativeId: string;
}): JSX.Element {
  const {displayMode, scalesCalculationMethod} = useContext(SettingsContext);

  function render(): JSX.Element | string {
    if (displayMode === 'enteredData') {
      return renderDistribution(distribution, usePercentage);
    } else {
      return renderValuesForAnalysis(scale);
    }
  }

  function renderValuesForAnalysis(scale: IScale): JSX.Element | string {
    if (scale['50%'] !== null) {
      const lowerBound = getStringForValue(scale['2.5%'], usePercentage);
      const upperBound = getStringForValue(scale['97.5%'], usePercentage);
      const modeOrMedian =
        scalesCalculationMethod === 'mode'
          ? getStringForValue(scale.mode, usePercentage)
          : getStringForValue(scale['50%'], usePercentage);
      return (
        <UncertainValue
          value={modeOrMedian}
          lowerBound={lowerBound}
          upperBound={upperBound}
        />
      );
    } else {
      return 'No data entered';
    }
  }
  const renderedDistribution = render();
  return renderedDistribution ? (
    <TableCell id={`value-cell-${dataSourceId}-${alternativeId}`}>
      <div className="text-centered">{renderedDistribution} </div>
    </TableCell>
  ) : (
    <EmptyCell dataSourceId={dataSourceId} alternativeId={alternativeId} />
  );
}
