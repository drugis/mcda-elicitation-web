import IOldSubproblem from '@shared/interface/IOldSubproblem';
import React, {useContext} from 'react';
import EffectsTable from '../EffectsTable/EffectsTable';
import {SettingsContext} from '../Settings/SettingsContext';
import ScaleRanges from './ScaleRanges/ScaleRanges';
import SubproblemButtons from './SubproblemButtons/SubproblemButtons';
import SubproblemSelection from './SubproblemSelection/SubproblemSelection';

export default function Subproblem({
  subproblemChanged
}: {
  subproblemChanged: (subproblem: IOldSubproblem) => void;
}): JSX.Element {
  const {
    settings: {displayMode}
  } = useContext(SettingsContext);

  return (
    <>
      <SubproblemSelection subproblemChanged={subproblemChanged} />
      <SubproblemButtons />
      <EffectsTable displayMode={displayMode} />
      <ScaleRanges />
    </>
  );
}
