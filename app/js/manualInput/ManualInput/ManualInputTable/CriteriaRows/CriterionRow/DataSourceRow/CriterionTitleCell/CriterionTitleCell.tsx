import {
  Grid,
  IconButton,
  TableCell,
  TextField,
  Tooltip
} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Edit from '@material-ui/icons/Edit';
import React, {ChangeEvent, useContext, useState} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import {ManualInputContext} from '../../../../../../ManualInputContext';

export default function CriterionTitleCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const [areWeEditing, setAreWeEditing] = useState<boolean>(false);
  const {setCriterion} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length + 1;

  function handleClick() {
    setAreWeEditing(!areWeEditing);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setCriterion({...criterion, title: event.target.value});
  }

  function handleKey(event: {keyCode: number}) {
    if (event.keyCode === 13) {
      handleClick();
    }
  }

  return areWeEditing ? (
    <TableCell rowSpan={numberOfDataSourceRows}>
      <Grid container>
        <Grid item>
          <IconButton size="small" color="primary" onClick={handleClick}>
            <CheckCircle />
          </IconButton>
        </Grid>
        <Grid>
          <TextField
            value={criterion.title}
            onChange={handleChange}
            autoFocus
            error={!criterion.title}
            helperText={criterion.title ? '' : 'Please provide a title'}
            onBlur={handleClick}
            onKeyDown={handleKey}
          />
        </Grid>
      </Grid>
    </TableCell>
  ) : (
    <TableCell rowSpan={numberOfDataSourceRows}>
      <Tooltip title="Edit criterion title">
        <IconButton size="small" color="primary" onClick={handleClick}>
          <Edit />
        </IconButton>
      </Tooltip>
      {criterion.title}
    </TableCell>
  );
}
