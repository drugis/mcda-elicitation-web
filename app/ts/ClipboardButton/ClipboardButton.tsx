import React from 'react';
import ClipboardJS from 'clipboard';
import {Button, Grid} from '@material-ui/core';

export default function ClipboardButton({targetId}: {targetId: string}) {
  new ClipboardJS('.clipboard');
  return (
    <Grid item>
      <Button
        className="clipboard"
        color="primary"
        variant="contained"
        data-clipboard-target={targetId}
      >
        <i className="fa fa-clipboard"></i> Copy to clipboard
      </Button>
    </Grid>
  );
}
