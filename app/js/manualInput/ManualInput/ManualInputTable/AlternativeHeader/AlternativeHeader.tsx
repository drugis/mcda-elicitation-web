import {Box, Grid, IconButton, TableCell, Tooltip} from '@material-ui/core';
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
      <Box pl={1} pr={1}>
        <Grid container>
          <Grid item xs={10} style={{textAlign: 'center'}}>
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
      </Box>
    </TableCell>
  );
}
