import {Button, ButtonGroup} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React, {useContext} from 'react';
import {DUMMY_ID} from '../../../../../constants';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';

export default function MoveDataSourceButtons() {
  const {swapDataSources} = useContext(ManualInputContext);
  const {
    criterion,
    dataSource,
    previousDataSource,
    nextDataSource
  } = useContext(DataSourceRowContext);

  function moveUp() {
    swapDataSources(criterion.id, dataSource.id, previousDataSource.id);
  }

  function moveDown() {
    swapDataSources(criterion.id, dataSource.id, nextDataSource.id);
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
