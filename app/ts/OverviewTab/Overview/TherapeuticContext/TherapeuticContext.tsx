import {Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import EditTherapeuticContextButton from './EditTherapeuticContextButton/EditTherapeuticContextButton';

export default function TherapeuticContext() {
  const {therapeuticContext} = useContext(WorkspaceContext);
  return (
    <Grid item container>
      <Grid item xs={12}>
        <Typography variant={'h5'}>
          Therapeutic Context <InlineHelp helpId={'therapeutic-context'} />{' '}
          <EditTherapeuticContextButton />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {therapeuticContext ? therapeuticContext : 'No description given.'}
      </Grid>
    </Grid>
  );
}
