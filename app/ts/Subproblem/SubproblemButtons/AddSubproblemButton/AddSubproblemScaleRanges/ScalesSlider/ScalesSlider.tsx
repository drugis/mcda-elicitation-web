import {Grid, IconButton, Slider, Tooltip} from '@material-ui/core';
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
import {createMarks, getSliderLimits} from '../AddSubproblemScaleRangesUtil';

export default function ScalesSlider({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(WorkspaceContext);
  const {getIncludedDataSourceForCriterion} = useContext(AddSubproblemContext);
  const includedDataSource = getIncludedDataSourceForCriterion(criterion);

  // ranges
  const observedRange = observedRanges[includedDataSource.id];
  const [lowestObservedValue, highestObservedValue] = observedRange;
  const theoreticalRange: [number, number] = [
    includedDataSource.unitOfMeasurement.lowerBound,
    includedDataSource.unitOfMeasurement.upperBound
  ];
  const [configuredValues, setConfiguredValues] = useState<[number, number]>(
    observedRange
  );

  // units
  const {decimal, percentage} = UnitOfMeasurementType;
  const unit = includedDataSource.unitOfMeasurement.type;
  const doPercentification =
    showPercentages && (unit === decimal || unit === percentage);

  const sliderLimits = getSliderLimits(
    theoreticalRange,
    observedRange,
    configuredValues
  );

  const handleChange = (event: any, newValue: [number, number]) => {
    if (
      newValue[0] <= lowestObservedValue &&
      newValue[1] >= highestObservedValue
    ) {
      setConfiguredValues(newValue);
    }
  };

  function renderUnitLabel(): string {
    const unitLabel = getUnitLabel(
      includedDataSource.unitOfMeasurement,
      showPercentages
    );
    return unitLabel ? `(${unitLabel})` : '';
  }

  return (
    <Grid container item xs={12} spacing={4} justify="center">
      <Grid item xs={12}>
        {`${criterion.title} ${renderUnitLabel()}`}
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Extend the range">
          <IconButton>
            <ChevronLeft color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={10}>
        <Slider
          value={configuredValues}
          onChange={handleChange}
          valueLabelDisplay="on"
          valueLabelFormat={(x: number) => {
            return getPercentifiedValue(x, doPercentification);
          }}
          min={sliderLimits.min}
          max={sliderLimits.max}
          step={sliderLimits.step}
          marks={createMarks(sliderLimits, doPercentification)}
        />
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Extend the range">
          <IconButton>
            <ChevronRight color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
