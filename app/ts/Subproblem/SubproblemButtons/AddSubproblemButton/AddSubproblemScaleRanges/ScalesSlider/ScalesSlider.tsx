import {Grid, IconButton, Mark, Slider, Tooltip} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ICriterion from '@shared/interface/ICriterion';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext, useState} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';

export default function ScalesSlider({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(WorkspaceContext);
  const [lowestObservedValue, highestObservedValue] = observedRanges[
    criterion.id
  ];
  const {getIncludedDataSourceForCriterion} = useContext(AddSubproblemContext);
  const includedDataSource = getIncludedDataSourceForCriterion(criterion);
  const lowestRangeValue = lowestObservedValue - 0.1; //FIXME
  const highestRangeValue = highestObservedValue + 0.1;

  const [value, setValue] = useState<number[]>([
    lowestObservedValue,
    highestObservedValue
  ]);

  const {decimal, percentage} = UnitOfMeasurementType;
  const unit = includedDataSource.unitOfMeasurement.type;
  const doPercentification =
    showPercentages && (unit === decimal || unit === percentage);

  const limits: Mark[] = [
    {
      value: lowestObservedValue,
      label: getPercentifiedValue(lowestObservedValue, doPercentification)
    },
    {
      value: highestObservedValue,
      label: getPercentifiedValue(highestObservedValue, doPercentification)
    },
    {
      value: lowestRangeValue,
      label: getPercentifiedValue(lowestRangeValue, doPercentification)
    },
    {
      value: highestRangeValue,
      label: getPercentifiedValue(highestRangeValue, doPercentification)
    }
  ];

  const handleChange = (event: any, newValue: number[]) => {
    if (
      newValue[0] <= lowestObservedValue &&
      newValue[1] >= highestObservedValue
    ) {
      setValue(newValue);
    }
  };

  function determineStepSize() {
    const interval = highestObservedValue - lowestObservedValue;
    const magnitude = Math.floor(Math.log10(interval));
    return Math.pow(10, magnitude - 1);
  }

  function renderUnitLabel(): string {
    const unitLabel = getUnitLabel(
      includedDataSource.unitOfMeasurement,
      showPercentages
    );
    return unitLabel ? `(${unitLabel})` : '';
  }

  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        {`${criterion.title} ${renderUnitLabel()}`}
      </Grid>
      <Grid item xs={1} justify="center">
        <Tooltip title="Extend the range">
          <IconButton>
            <ChevronLeft color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={10}>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="on"
          valueLabelFormat={(x: number) => {
            return getPercentifiedValue(x, doPercentification);
          }}
          min={lowestRangeValue}
          max={highestRangeValue}
          step={determineStepSize()}
          marks={limits}
        />
      </Grid>
      <Grid item xs={1} justify="center">
        <Tooltip title="Extend the range">
          <IconButton>
            <ChevronRight color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
