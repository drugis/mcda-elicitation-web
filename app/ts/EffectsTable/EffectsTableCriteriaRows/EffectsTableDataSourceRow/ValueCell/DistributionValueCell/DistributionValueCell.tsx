import TableCell from '@material-ui/core/TableCell';
import {Distribution} from '@shared/interface/IDistribution';
import IScale from '@shared/interface/IScale';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/deselectedCellStyle';
import React, {useContext} from 'react';
import EmptyCell from '../EmptyCell/EmptyCell';
import UncertainValue from '../UncertainValue/UncertainValue';
import {renderDistribution} from './DistributionValueCellService';

export default function DistributionValueCell({
  distribution,
  scale,
  usePercentage,
  dataSourceId,
  alternativeId,
  isExcluded
}: {
  distribution: Distribution;
  scale: IScale;
  usePercentage: boolean;
  dataSourceId: string;
  alternativeId: string;
  isExcluded?: boolean;
}): JSX.Element {
  const {displayMode, scalesCalculationMethod} = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  function render(): JSX.Element | string {
    if (displayMode === 'enteredDistributions') {
      return renderDistribution(distribution, usePercentage);
    } else if (displayMode === 'smaaValues') {
      return renderValuesForAnalysis(scale, distribution);
    }
  }

  function renderValuesForAnalysis(
    scale: IScale,
    distribution: Distribution
  ): JSX.Element | string {
    if (scalesCalculationMethod === 'mode' && distribution.type === 'range') {
      return 'NA';
    } else if (scale['50%'] !== null) {
      const lowerBound = getPercentifiedValue(scale['2.5%'], usePercentage);
      const upperBound = getPercentifiedValue(scale['97.5%'], usePercentage);
      const modeOrMedian =
        scalesCalculationMethod === 'mode'
          ? getPercentifiedValue(scale.mode, usePercentage)
          : getPercentifiedValue(scale['50%'], usePercentage);
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
    <TableCell
      id={`value-cell-${dataSourceId}-${alternativeId}`}
      style={cellStyle}
    >
      <div className="text-centered">{renderedDistribution} </div>
    </TableCell>
  ) : (
    <EmptyCell
      dataSourceId={dataSourceId}
      alternativeId={alternativeId}
      isExcluded={isExcluded}
    />
  );
}
