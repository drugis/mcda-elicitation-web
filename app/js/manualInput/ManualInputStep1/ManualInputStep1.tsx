import React from 'react';
import Criteria from './Criteria/Criteria';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';
import Title from './Title/Title';

export default function ManualInputStep1() {
  return (
    <span>
      <div>
        <h3 id="manual-input-header-step1">
          Create workspace manually — step 1 of 2
        </h3>
        <h4>Define criteria and alternatives</h4>
      </div>
      <div>
        Here you can enter the data for an analysis manually. In this first
        step, create the criteria and alternatives you wish to analyse.
        Alternatives are simply a title, while criteria are more complex.
      </div>
      <Title />
      <TherapeuticContext />
      <Criteria />
    </span>
  );
}
