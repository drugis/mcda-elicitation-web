import {Grid, IconButton, makeStyles, Slider, Tooltip} from '@material-ui/core';
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
import {
  createMarks,
  getSliderLimits,
  increaseRangeFrom,
  increaseRangeTo
} from '../AddSubproblemScaleRangesUtil';

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

  const sliderLimits = getSliderLimits(
    theoreticalRange,
    observedRange,
    observedRange //FIXME to configredRange
  );

  const [configuredValues, setConfiguredValues] = useState<[number, number]>([
    sliderLimits.min,
    sliderLimits.max
  ]);

  const [sliderRange, setSliderRange] = useState<[number, number]>([
    sliderLimits.min,
    sliderLimits.max
  ]);

  // units
  const {decimal, percentage} = UnitOfMeasurementType;
  const unit = includedDataSource.unitOfMeasurement.type;
  const doPercentification =
    showPercentages && (unit === decimal || unit === percentage);

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

  function increaseFrom(): void {
    setSliderRange(increaseRangeFrom(sliderRange, theoreticalRange[0]));
  }

  function increaseTo(): void {
    setSliderRange(increaseRangeTo(sliderRange, theoreticalRange[1]));
  }

  const restrictedAreaRatio: string = calculateRestrictedAreaRatio();

  function calculateRestrictedAreaRatio(): string {
    const totalMargin = sliderRange[1] - sliderRange[0];
    const restrictedMargin = highestObservedValue - lowestObservedValue;
    return (restrictedMargin / totalMargin) * 100 + '%';
  }

  const useStyles = makeStyles({
    root: {
      '& .MuiSlider-markActive[data-index="1"]': {
        width: restrictedAreaRatio,
        backgroundColor: 'red',
        height: '7px',
        transform: 'translateY(-3px)',
        opacity: 1
      },
      '& .MuiSlider-markActive[data-index="2"]': {
        width: '0px'
      }
    }
  });
  const classes = useStyles();

  return (
    <Grid container item xs={12} spacing={4} justify="center">
      <Grid item xs={12}>
        {`${criterion.title} ${renderUnitLabel()}`}
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Extend the range">
          <IconButton onClick={increaseFrom}>
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
          min={sliderRange[0]}
          max={sliderRange[1]}
          step={sliderLimits.step}
          marks={createMarks(sliderRange, observedRange, doPercentification)}
          className={classes.root}
        />
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Extend the range">
          <IconButton onClick={increaseTo}>
            <ChevronRight color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
