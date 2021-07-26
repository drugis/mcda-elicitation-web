import ICriterion from '@shared/interface/ICriterion';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import EquivalentRangeChange from './EquivalentRangeChange';
import EquivalentValueChange from './EquivalentValueChange';

export default function EquivalentChangeCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {
    equivalentChangeType,
    referenceCriterion,
    referenceValueFrom,
    referenceValueTo
  } = useContext(EquivalentChangeContext);
  const {currentScenario, pvfs} = useContext(CurrentScenarioContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  switch (equivalentChangeType) {
    case 'amount':
      return (
        <EquivalentValueChange
          usePercentage={usePercentage}
          pvf={pvfs[criterion.id]}
          otherWeight={currentScenario.state.weights.mean[criterion.id]}
        />
      );
    case 'range':
      if (criterion.id === referenceCriterion.id) {
        return (
          <span>
            {getPercentifiedValue(referenceValueFrom, usePercentage)} to{' '}
            {getPercentifiedValue(referenceValueTo, usePercentage)}
          </span>
        );
      } else {
        return (
          <EquivalentRangeChange
            usePercentage={usePercentage}
            pvf={pvfs[criterion.id]}
            otherWeight={currentScenario.state.weights.mean[criterion.id]}
          />
        );
      }
  }
}
