import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import FileCopy from '@material-ui/icons/FileCopy';
import _ from 'lodash';
import {useContext} from 'react';
import {CurrentScenarioContext} from '../../../CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContext} from '../../../ScenariosContext/ScenariosContext';
import DeleteScenarioButton from './DeleteScenarioButton/DeleteScenarioButton';
import ScenarioActionButton from './ScenarioActionButton/ScenarioActionButton';

export default function ScenarioButtons() {
  const {addScenario, copyScenario} = useContext(ScenariosContext);
  const {currentScenario, updateScenario} = useContext(CurrentScenarioContext);

  function editCallback(newtitle: string): void {
    updateScenario(_.merge({}, currentScenario, {title: newtitle}));
  }

  function addCallback(newtitle: string): void {
    addScenario(newtitle);
  }

  function copyCallback(newtitle: string): void {
    copyScenario(newtitle, currentScenario);
  }

  return (
    <>
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
    </>
  );
}
