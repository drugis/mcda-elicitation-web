import React from 'react';
import ClipboardJS from 'clipboard';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
