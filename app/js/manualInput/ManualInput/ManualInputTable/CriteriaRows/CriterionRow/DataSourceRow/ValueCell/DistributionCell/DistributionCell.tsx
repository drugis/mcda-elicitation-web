import {TableCell} from '@material-ui/core';
import React, {useContext, useEffect, useState} from 'react';
import {Distribution} from '../../../../../../../../interface/IDistribution';
import {ManualInputContext} from '../../../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import {DistributionCellContextProviderComponent} from '../DistributionCellContext/DistributionCellContext';
import DistributionCellDialog from '../DistributionCellDialog/DistributionCellDialog';
import IBetaDistribution from '../../../../../../../../interface/IBetaDistribution';
import IGammaDistribution from '../../../../../../../../interface/IGammaDistribution';
import IRangeEffect from '../../../../../../../../interface/IRangeEffect';
import INormalDistribution from '../../../../../../../../interface/INormalDistribution';
import IValueEffect from '../../../../../../../../interface/IValueEffect';

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

  const NO_VALUE_ENTERED = 'No value entered';
  const INVALID_VALUE = 'Invalid value';

  useEffect(() => {
    const distribution = getDistribution(
      criterion.id,
      dataSource.id,
      alternativeId
    );
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
        return distribution.text;
      case 'empty':
        return 'Empty';
    }
  }

  function createValueLabel(distribution: IValueEffect): string {
    if (distribution.value === undefined) {
      return NO_VALUE_ENTERED;
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
      return NO_VALUE_ENTERED;
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
    setDistribution(newDistribution, dataSource.id, alternativeId);
    setIsDialogOpen(false);
  }

  return (
    <TableCell align="center">
      <span onClick={openDialog} style={{cursor: 'pointer'}}>
        {label}
      </span>
      <DistributionCellContextProviderComponent alternativeId={alternativeId}>
        <DistributionCellDialog
          callback={saveDistribution}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </DistributionCellContextProviderComponent>
    </TableCell>
  );
}
