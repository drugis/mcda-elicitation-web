import {Grid, IconButton, TableCell, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, {useContext} from 'react';
import IAlternative from '../../../../interface/IAlternative';
import {ManualInputContext} from '../../../ManualInputContext';
import InlineEditor from '../InlineEditor/InlineEditor';

export default function AlternativeHeader({
  alternative
}: {
  alternative: IAlternative;
}) {
  const {deleteAlternative, setAlternative} = useContext(ManualInputContext);

  function handleDelete() {
    deleteAlternative(alternative.id);
  }

  function handleChange(newTitle: string) {
    setAlternative({...alternative, title: newTitle});
  }

  return (
    <TableCell>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <InlineEditor
            value={alternative.title}
            callback={handleChange}
            tooltipText={'Edit alternative title'}
            errorOnEmpty={true}
          />
        </Grid>
        <Grid item xs={2} style={{textAlign: 'right'}}>
          <Tooltip title="Delete alternative">
            <IconButton size="small" color="secondary" onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </TableCell>
  );
}
