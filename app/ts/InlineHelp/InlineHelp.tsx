import React, {useContext, useState} from 'react';
import Popover from '@material-ui/core/Popover';
import Help from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {HelpContext} from './HelpContext';
import {Box} from '@material-ui/core';

export default function InlineHelp({helpId}: {helpId: string}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const {getHelpInfo} = useContext(HelpContext);
  const {title, text, link} = getHelpInfo(helpId);

  function openPopover(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closePopover() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton onClick={openPopover}>
        <Help></Help>
      </IconButton>
      <Popover
        open={!!anchorEl}
        onClose={closePopover}
        anchorOrigin={{vertical: 'center', horizontal: 'center'}}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        anchorEl={anchorEl}
      >
        <Grid container component={Box} p={2} maxWidth="300px" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">{title}</Typography>
          </Grid>
          <Grid item xs={12}>
            {text}
          </Grid>
          <Grid item xs={12}>
            <a href={link} target="_blank">
              View in manual
            </a>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
