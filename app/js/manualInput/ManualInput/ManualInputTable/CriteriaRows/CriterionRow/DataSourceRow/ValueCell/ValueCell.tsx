import {TableCell} from '@material-ui/core';
import React, {MouseEvent, useContext, useEffect, useState} from 'react';
import {Effect} from '../../../../../../../interface/IEffect';
import IRangeEffect from '../../../../../../../interface/IRangeEffect';
import IValueCIEffect from '../../../../../../../interface/IValueCIEffect';
import IValueEffect from '../../../../../../../interface/IValueEffect';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContextProviderComponent} from './EffectCellContext/EffectCellContext';
import EffectCellDialog from './EffectCellDialog/EffectCellDialog';

export default function ValueCell({alternativeId}: {alternativeId: string}) {
  const {getEffect, setEffect, effectValues} = useContext(ManualInputContext);
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const effect = getEffect(criterion.id, dataSource.id, alternativeId);
    setLabel(createLabel(effect));
  }, [effectValues, dataSource.unitOfMeasurement]);

  function saveEffect(effect: Effect) {
    setEffect(effect, dataSource.id, alternativeId);
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(event: MouseEvent<HTMLAnchorElement, MouseEvent>): void {
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
        return effect.value;
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
      return 'Invalid value';
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `${effect.value}%`;
    } else {
      return `${effect.value}`;
    }
  }

  function createValueCILabel(effect: IValueCIEffect): string {
    if (
      valueIsOutofBounds(effect.lowerBound) ||
      valueIsOutofBounds(effect.upperBound)
    ) {
      return 'Invalid value';
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `${effect.value}% (${effect.lowerBound}%, ${effect.upperBound}%)`;
    } else {
      return `${effect.value} (${effect.lowerBound}, ${effect.upperBound})`;
    }
  }

  function createRangeLabel(effect: IRangeEffect): string {
    if (
      valueIsOutofBounds(effect.lowerBound) ||
      valueIsOutofBounds(effect.upperBound)
    ) {
      return 'Invalid value';
    } else if (dataSource.unitOfMeasurement.type === 'percentage') {
      return `[${effect.lowerBound}%, ${effect.upperBound}%]`;
    } else {
      return `[${effect.lowerBound}, ${effect.upperBound}]`;
    }
  }

  return (
    <TableCell align="center">
      <span onClick={openDialog} style={{cursor: 'pointer'}}>
        {label}
      </span>
      <EffectCellContextProviderComponent alternativeId={alternativeId}>
        <EffectCellDialog
          callback={saveEffect}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </EffectCellContextProviderComponent>
    </TableCell>
  );
}
