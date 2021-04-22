import {Grid, Typography} from '@material-ui/core';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import EditTherapeuticContextButton from './EditTherapeuticContextButton/EditTherapeuticContextButton';

export default function TherapeuticContext() {
  const {therapeuticContext} = useContext(WorkspaceContext);
  return (
    <Grid item container>
      <Grid item xs={12}>
        <Typography variant={'h5'}>
          <InlineHelp helpId={'therapeutic-context'}>
            Therapeutic Context
          </InlineHelp>
          <EditTherapeuticContextButton />
        </Typography>
      </Grid>
      <Grid id={'therapeutic-context'} item xs={12}>
        <Typography>
          {therapeuticContext ? therapeuticContext : 'No description given.'}
        </Typography>
      </Grid>
    </Grid>
  );
}
