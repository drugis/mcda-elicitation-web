import {Grid} from '@material-ui/core';
import {EffectsTableContextProviderComponent} from 'app/ts/EffectsTable/EffectsTableContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext} from 'react';
import DownloadWorkspace from './DownloadWorkspace/DownloadWorkspace';
import OverviewAlternatives from './OverviewAlternatives/OverviewAlternatives';
import OverviewCriteria from './OverviewCriteria/OverviewCriteria';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';
import {WorkspaceContext} from '../../WorkspaceContext/WorkspaceContext';

export default function Overview() {
  const {
    settings: {displayMode}
  } = useContext(SettingsContext);
  const {
    workspace: {
      properties: {title}
    }
  } = useContext(WorkspaceContext);

  document.title = `${title}'s overview`;

  return (
    <Grid container spacing={2}>
      <DownloadWorkspace />
      <TherapeuticContext />
      <OverviewAlternatives />
      <EffectsTableContextProviderComponent displayMode={displayMode}>
        <OverviewCriteria />
      </EffectsTableContextProviderComponent>
    </Grid>
  );
}
