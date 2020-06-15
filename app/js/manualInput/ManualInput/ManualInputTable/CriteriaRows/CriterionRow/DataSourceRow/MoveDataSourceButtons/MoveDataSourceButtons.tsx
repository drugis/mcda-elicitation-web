import {Button, ButtonGroup} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import {DUMMY_ID} from '../../../../../constants';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';

export default function MoveDataSourceButtons() {
  const {swapDataSources} = useContext(ManualInputContext);
  const {
    criterion,
    dataSourceId,
    previousDataSource,
    nextDataSource
  } = useContext(DataSourceRowContext);

  function moveUp() {
    swapDataSources(criterion.id, dataSourceId, previousDataSource.id);
  }

  function moveDown() {
    swapDataSources(criterion.id, dataSourceId, nextDataSource.id);
  }

  return (
    <ButtonGroup
      orientation="vertical"
      color="primary"
      variant="text"
      size="small"
    >
      <Button disabled={!previousDataSource} onClick={moveUp}>
        <ArrowDropUp />
      </Button>
      <Button
        disabled={!nextDataSource || nextDataSource.id.startsWith(DUMMY_ID)}
        onClick={moveDown}
      >
        <ArrowDropDown />
      </Button>
    </ButtonGroup>
  );
}
