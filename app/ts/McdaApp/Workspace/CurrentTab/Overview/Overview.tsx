import {Grid} from '@material-ui/core';
import {EffectsTableContextProviderComponent} from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {useContext} from 'react';
import {WorkspaceContext} from '../../WorkspaceContext/WorkspaceContext';
import OverviewAlternatives from './OverviewAlternatives/OverviewAlternatives';
import OverviewCriteria from './OverviewCriteria/OverviewCriteria';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';

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
      <TherapeuticContext />
      <OverviewAlternatives />
      <EffectsTableContextProviderComponent displayMode={displayMode}>
        <OverviewCriteria />
      </EffectsTableContextProviderComponent>
    </Grid>
  );
}
