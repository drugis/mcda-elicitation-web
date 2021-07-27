import {Grid} from '@material-ui/core';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import ScenarioSelection from 'app/ts/McdaApp/Workspace/CurrentTab/ScenarioSelection/ScenarioSelection';
import {ScenariosContext} from 'app/ts/McdaApp/Workspace/ScenariosContext/ScenariosContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import _ from 'lodash';
import React, {useContext} from 'react';
import {DeterministicResultsContextProviderComponent} from '../DeterministicResultsContext/DeterministicResultsContext';
import {DeterministicWeightsContextProviderComponent} from './DeterministicWeightsTable/DeterministicWeightsContext';
import DeterministicWeightsTable from './DeterministicWeightsTable/DeterministicWeightsTable';
import SensitivityAnalysis from './SensitivityAnalysis/SensitivityAnalysis';
import {SensitivityAnalysisContextProviderComponent} from './SensitivityAnalysis/SensitivityAnalysisContext';
import {SensitivityMeasurementsContextProviderComponent} from './SensitivityMeasurementsTable/SensitivityMeasurementsContext';
import SensitivityMeasurementsTable from './SensitivityMeasurementsTable/SensitivityMeasurementsTable';
import ValueProfiles from './ValueProfiles/ValueProfiles';

export default function DeterministicResults(): JSX.Element {
  const {scenariosWithPvfs} = useContext(ScenariosContext);
  const {currentScenario, pvfs} = useContext(CurrentScenarioContext);
  const {
    workspace: {
      properties: {title}
    }
  } = useContext(WorkspaceContext);

  document.title = `${title}'s deterministic results`;

  return (
    <ShowIf condition={Boolean(pvfs)}>
      <DeterministicResultsContextProviderComponent>
        <Grid container spacing={2}>
          <Grid container item xs={12}>
            <ScenarioSelection
              scenarios={scenariosWithPvfs}
              currentScenario={currentScenario}
            />
          </Grid>
          <SensitivityMeasurementsContextProviderComponent>
            <SensitivityMeasurementsTable />
          </SensitivityMeasurementsContextProviderComponent>
          <DeterministicWeightsContextProviderComponent>
            <DeterministicWeightsTable />
          </DeterministicWeightsContextProviderComponent>
          <ValueProfiles />
          <SensitivityAnalysisContextProviderComponent>
            <SensitivityAnalysis />
          </SensitivityAnalysisContextProviderComponent>
        </Grid>
      </DeterministicResultsContextProviderComponent>
    </ShowIf>
  );
}
