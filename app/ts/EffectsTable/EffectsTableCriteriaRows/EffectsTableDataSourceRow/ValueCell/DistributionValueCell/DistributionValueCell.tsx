import {Distribution} from '@shared/interface/IDistribution';
import IScale from '@shared/interface/IScale';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import UncertainValue from '../UncertainValue/UncertainValue';
import {getStringForValue} from '../ValueCellService';
import {renderDistribution} from './DistributionValueCellService';
import {TableCell} from '@material-ui/core';

export default function DistributionValueCell({
  distribution,
  scale,
  usePercentage
}: {
  distribution: Distribution;
  scale: IScale;
  usePercentage: boolean;
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

  return (
    <TableCell>
      <div className="text-centered">{render()} </div>
    </TableCell>
  );
}
