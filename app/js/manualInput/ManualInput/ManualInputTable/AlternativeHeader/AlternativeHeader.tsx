import {Grid, IconButton, TableCell, TextField} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React, {ChangeEvent, useContext, useState} from 'react';
import IAlternative from '../../../../interface/IAlternative';
import {ManualInputContext} from '../../../ManualInputContext';

export default function AlternativeHeader({
  alternative
}: {
  alternative: IAlternative;
}) {
  const [areWeEditing, setAreWeEditing] = useState<boolean>(false);
  const {deleteAlternative, setAlternative} = useContext(ManualInputContext);

  function handleDelete() {
    deleteAlternative(alternative.id);
  }

  function handleEdit() {
    setAreWeEditing(!areWeEditing);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setAlternative({...alternative, title: event.target.value});
  }

  function handleKey(event: {keyCode: number}) {
    if (event.keyCode === 13) {
      handleEdit();
    }
  }

  return areWeEditing ? (
    <TableCell>
      <Grid container>
        <Grid item>
          <IconButton size="small" color="primary" onClick={handleEdit}>
            <CheckCircle />
          </IconButton>
        </Grid>
        <Grid>
          <TextField
            value={alternative.title}
            onChange={handleChange}
            autoFocus
            error={!alternative.title}
            helperText={alternative.title ? '' : 'Please provide a title'}
            onBlur={handleEdit}
            onKeyDown={handleKey}
          />
        </Grid>
      </Grid>
    </TableCell>
  ) : (
    <TableCell>
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <Delete />
      </IconButton>
      <IconButton size="small" color="primary" onClick={handleEdit}>
        <Edit />
      </IconButton>
      {alternative.title}
    </TableCell>
  );
}
