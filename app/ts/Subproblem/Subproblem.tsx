import {Grid} from '@material-ui/core';
import React, {useContext} from 'react';
import EffectsTable from '../EffectsTable/EffectsTable';
import {EffectsTableContextProviderComponent} from '../EffectsTable/EffectsTableContext';
import {SettingsContext} from '../Settings/SettingsContext';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import ScaleRanges from './ScaleRanges/ScaleRanges';
import SubproblemButtons from './SubproblemButtons/SubproblemButtons';
import SubproblemSelection from './SubproblemSelection/SubproblemSelection';

export default function Subproblem(): JSX.Element {
  const {
    settings: {displayMode}
  } = useContext(SettingsContext);
  const {
    workspace: {
      properties: {title}
    }
  } = useContext(WorkspaceContext);

  document.title = `${title}'s problem definition`;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SubproblemSelection />
        <SubproblemButtons />
      </Grid>
      <EffectsTableContextProviderComponent displayMode={displayMode}>
        <EffectsTable />
      </EffectsTableContextProviderComponent>
      <ScaleRanges />
    </Grid>
  );
}
