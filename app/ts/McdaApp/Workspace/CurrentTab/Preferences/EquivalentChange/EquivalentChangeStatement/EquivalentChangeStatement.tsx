import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import React, {useContext} from 'react';
import EquivalentChangeRangeStatement from './EquivalentChangeRangeStatement';
import EquivalentChangeValueStatement from './EquivalentChangeValueStatement';

export default function EquivalentChangeStatement(): JSX.Element {
  const {equivalentChange} = useContext(CurrentScenarioContext);

  return equivalentChange.type === 'range' ? (
    <EquivalentChangeRangeStatement />
  ) : (
    <EquivalentChangeValueStatement />
  );
}
