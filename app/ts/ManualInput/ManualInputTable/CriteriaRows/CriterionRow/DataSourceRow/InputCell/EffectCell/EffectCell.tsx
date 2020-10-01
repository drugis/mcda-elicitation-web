import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import {Effect} from '@shared/interface/IEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import {ManualInputContext} from 'app/ts/ManualInput/ManualInputContext';
import React, {useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import EffectCellDialog from '../EffectCellDialog/EffectCellDialog';
import {InputCellContextProviderComponent} from '../InputCellContext/InputCellContext';

export default function EffectCell({alternativeId}: {alternativeId: string}) {
  const {getEffect, setEffect, effects} = useContext(ManualInputContext);
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [label, setLabel] = useState('');

  const effect = getEffect(criterion.id, dataSource.id, alternativeId);

  const INVALID_VALUE = 'Invalid value';

  useEffect(() => {
    setLabel(createLabel(effect));
  }, [effects, dataSource.unitOfMeasurement]);

  function saveEffect(effect: Effect) {
    setEffect(effect);
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function createLabel(effect: Effect): string {
    switch (effect.type) {
      case 'value':
        return createValueLabel(effect);
      case 'valueCI':
        return createValueCILabel(effect);
      case 'range':
        return createRangeLabel(effect);
      case 'text':
        return effect.text ? effect.text : 'Empty';
      case 'empty':
        return 'Empty';
    }
  }

  function valueIsOutofBounds(value: number): boolean {
    return (
      value < dataSource.unitOfMeasurement.lowerBound ||
      value > dataSource.unitOfMeasurement.upperBound
    );
  }

  function createValueLabel(effect: IValueEffect): string {
    if (effect.value === undefined) {
      return 'No value entered';
    } else if (valueIsOutofBounds(effect.value)) {
      return INVALID_VALUE;
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `${effect.value}%`;
    } else {
      return `${effect.value}`;
    }
  }

  function createValueCILabel(effect: IValueCIEffect): string {
    if (hasOutOfBoundValue(effect)) {
      return INVALID_VALUE;
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      const lowerBound = effect.isNotEstimableLowerBound
        ? 'NE'
        : `${effect.lowerBound}%`;
      const upperBound = effect.isNotEstimableUpperBound
        ? 'NE'
        : `${effect.upperBound}%`;
      return `${effect.value}% (${lowerBound}, ${upperBound})`;
    } else {
      const lowerBound = effect.isNotEstimableLowerBound
        ? 'NE'
        : `${effect.lowerBound}`;
      const upperBound = effect.isNotEstimableUpperBound
        ? 'NE'
        : `${effect.upperBound}`;
      return `${effect.value}\n(${lowerBound}, ${upperBound})`;
    }
  }

  function hasOutOfBoundValue(effect: IValueCIEffect): boolean {
    return (
      (!effect.isNotEstimableLowerBound &&
        valueIsOutofBounds(effect.lowerBound)) ||
      (!effect.isNotEstimableUpperBound &&
        valueIsOutofBounds(effect.upperBound))
    );
  }

  function createRangeLabel(effect: IRangeEffect): string {
    if (
      valueIsOutofBounds(effect.lowerBound) ||
      valueIsOutofBounds(effect.upperBound)
    ) {
      return INVALID_VALUE;
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `[${effect.lowerBound}%, ${effect.upperBound}%]`;
    } else {
      return `[${effect.lowerBound}, ${effect.upperBound}]`;
    }
  }

  return (
    <TableCell align="center">
      <Tooltip title="Edit effect">
        <span
          onClick={openDialog}
          style={{cursor: 'pointer', whiteSpace: 'pre-wrap', minWidth: '6rem'}}
        >
          {label}
        </span>
      </Tooltip>
      <InputCellContextProviderComponent
        alternativeId={alternativeId}
        effectOrDistribution={effect}
      >
        <EffectCellDialog
          callback={saveEffect}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </InputCellContextProviderComponent>
    </TableCell>
  );
}
