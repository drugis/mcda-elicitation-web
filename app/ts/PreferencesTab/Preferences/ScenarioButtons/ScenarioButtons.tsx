import {Grid} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import FileCopy from '@material-ui/icons/FileCopy';
import _ from 'lodash';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import DeleteScenarioButton from './DeleteScenarioButton/DeleteScenarioButton';
import ScenarioActionButton from './ScenarioActionButton/ScenarioActionButton';

export default function ScenarioButtons() {
  const {
    currentScenario,
    updateScenario,
    addScenario,
    copyScenario
  } = useContext(PreferencesContext);

  function editCallback(newtitle: string): void {
    updateScenario(_.merge({}, currentScenario, {title: newtitle}));
  }

  function addCallback(newtitle: string): void {
    addScenario(newtitle);
  }

  function copyCallback(newtitle: string): void {
    copyScenario(newtitle);
  }

  return (
    <Grid item container>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <ScenarioActionButton
          action="Edit"
          icon={<Edit color="primary" />}
          callback={editCallback}
          idOfScenarioBeingEdited={currentScenario.id}
        />
        <ScenarioActionButton
          action="Add"
          icon={<Add color="primary" />}
          callback={addCallback}
        />
        <ScenarioActionButton
          action="Copy"
          icon={<FileCopy color="primary" />}
          callback={copyCallback}
        />
        <DeleteScenarioButton />
      </Grid>
    </Grid>
  );
}
