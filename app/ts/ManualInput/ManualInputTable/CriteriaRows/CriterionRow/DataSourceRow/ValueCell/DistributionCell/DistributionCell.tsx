import {TableCell, Tooltip} from '@material-ui/core';
import React, {useContext, useEffect, useState} from 'react';
import IBetaDistribution from '../../../../../../../interface/IBetaDistribution';
import {Distribution} from '../../../../../../../interface/IDistribution';
import IGammaDistribution from '../../../../../../../interface/IGammaDistribution';
import INormalDistribution from '../../../../../../../interface/INormalDistribution';
import IRangeEffect from '../../../../../../../interface/IRangeEffect';
import IValueEffect from '../../../../../../../interface/IValueEffect';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import DistributionCellDialog from '../DistributionCellDialog/DistributionCellDialog';
import {InputCellContextProviderComponent} from '../InputCellContext/InputCellContext';

export default function DistributionCell({
  alternativeId
}: {
  alternativeId: string;
}) {
  const {getDistribution, setDistribution, distributions} = useContext(
    ManualInputContext
  );
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [label, setLabel] = useState('');

  const NO_DISTRIBUTION_ENTERED = 'No distribution entered';
  const INVALID_VALUE = 'Invalid value';

  const distribution = getDistribution(
    criterion.id,
    dataSource.id,
    alternativeId
  );

  useEffect(() => {
    setLabel(createLabel(distribution));
  }, [distributions, dataSource.unitOfMeasurement]);

  function createLabel(distribution: Distribution) {
    switch (distribution.type) {
      case 'value':
        return createValueLabel(distribution);
      case 'normal':
        return createNormalLabel(distribution);
      case 'range':
        return createRangeLabel(distribution);
      case 'beta':
        return createBetaLabel(distribution);
      case 'gamma':
        return createGammaLabel(distribution);
      case 'text':
        return distribution.text ? distribution.text : 'Empty';
      case 'empty':
        return 'Empty';
    }
  }

  function createValueLabel(distribution: IValueEffect): string {
    if (distribution.value === undefined) {
      return NO_DISTRIBUTION_ENTERED;
    } else if (valueIsOutofBounds(distribution.value)) {
      return INVALID_VALUE;
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `${distribution.value}%`;
    } else {
      return `${distribution.value}`;
    }
  }

  function createNormalLabel(distribution: INormalDistribution) {
    if (distribution.mean === undefined) {
      return NO_DISTRIBUTION_ENTERED;
    } else if (
      valueIsOutofBounds(distribution.mean) ||
      valueIsOutofBounds(distribution.standardError)
    ) {
      return INVALID_VALUE;
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `Normal(${distribution.mean}%, ${distribution.standardError}%)`;
    } else {
      return `Normal(${distribution.mean}, ${distribution.standardError})`;
    }
  }

  function createRangeLabel(distribution: IRangeEffect): string {
    if (
      valueIsOutofBounds(distribution.lowerBound) ||
      valueIsOutofBounds(distribution.upperBound)
    ) {
      return INVALID_VALUE;
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `[${distribution.lowerBound}%, ${distribution.upperBound}%]`;
    } else {
      return `[${distribution.lowerBound}, ${distribution.upperBound}]`;
    }
  }

  function valueIsOutofBounds(value: number): boolean {
    return (
      value < dataSource.unitOfMeasurement.lowerBound ||
      value > dataSource.unitOfMeasurement.upperBound
    );
  }
  function createBetaLabel(distribution: IBetaDistribution): string {
    return `Beta(${distribution.alpha}, ${distribution.beta})`;
  }

  function createGammaLabel(distribution: IGammaDistribution): string {
    return `Gamma(${distribution.alpha}, ${distribution.beta})`;
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function saveDistribution(newDistribution: Distribution) {
    setDistribution(newDistribution);
    setIsDialogOpen(false);
  }

  return (
    <TableCell align="center">
      <Tooltip title="Edit distribution">
        <span onClick={openDialog} style={{cursor: 'pointer'}}>
          {label}
        </span>
      </Tooltip>
      <InputCellContextProviderComponent
        alternativeId={alternativeId}
        effectOrDistribution={distribution}
      >
        <DistributionCellDialog
          callback={saveDistribution}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </InputCellContextProviderComponent>
    </TableCell>
  );
}
