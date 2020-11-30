import Tooltip from '@material-ui/core/Tooltip';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';

export default function CriterionSituation({
  criterion,
  displayValue
}: {
  criterion: ICriterion;
  displayValue: number;
}) {
  const {showPercentages} = useContext(SettingsContext);

  return (
    <ul>
      <li id={`situation-${criterion.id}`}>
        <Tooltip
          disableHoverListener={!criterion.description}
          title={criterion.description ? criterion.description : ''}
        >
          <span
            id={`situation-title-${criterion.id}`}
            className="criterion-title"
          >
            {criterion.title}
          </span>
        </Tooltip>
        : <span id={`situation-value-${criterion.id}`}>{displayValue}</span>{' '}
        {getUnitLabel(
          criterion.dataSources[0].unitOfMeasurement,
          showPercentages
        )}
      </li>
    </ul>
  );
}
