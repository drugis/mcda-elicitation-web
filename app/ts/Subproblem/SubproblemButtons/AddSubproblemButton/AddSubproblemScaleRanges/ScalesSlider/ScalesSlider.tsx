import {Grid, IconButton, makeStyles, Slider, Tooltip} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ICriterion from '@shared/interface/ICriterion';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUpperBound} from 'app/ts/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext, useEffect, useState} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';
import {
  createMarks,
  determineStepSize,
  increaseRangeFrom,
  increaseRangeTo
} from '../AddSubproblemScaleRangesUtil';

export default function ScalesSlider({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(WorkspaceContext);
  const {
    configuredRanges,
    getIncludedDataSourceForCriterion,
    getSliderRangeForDS,
    setConfiguredRange,
    updateSliderRangeforDS
  } = useContext(AddSubproblemContext);
  const includedDataSource = getIncludedDataSourceForCriterion(criterion);
  const sliderRange = getSliderRangeForDS(includedDataSource.id);
  // units
  const unit = includedDataSource.unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);

  // ranges
  const configuredRange = configuredRanges[includedDataSource.id];
  const [lowestConfiguredValue, highestConfiguredValue] = configuredRange;
  const [lowestObservedValue, highestObservedValue] = observedRanges[
    includedDataSource.id
  ];
  const [lowerTheoretical, upperTheoretical]: [number, number] = [
    includedDataSource.unitOfMeasurement.lowerBound,
    getUpperBound(usePercentage, includedDataSource.unitOfMeasurement)
  ];

  const [configuredValues, setConfiguredValues] = useState<[number, number]>([
    lowestConfiguredValue,
    highestConfiguredValue
  ]);

  useEffect(() => {
    setConfiguredValues(configuredRange);
  }, [configuredRange]);

  function handleChange(event: any, newValue: [number, number]) {
    if (
      newValue[0] <= lowestObservedValue &&
      newValue[1] >= highestObservedValue
    ) {
      setConfiguredRange(includedDataSource.id, newValue[0], newValue[1]);
    }
  }

  function renderUnitLabel(): string {
    const unitLabel = getUnitLabel(
      includedDataSource.unitOfMeasurement,
      showPercentages
    );
    return unitLabel ? `(${unitLabel})` : '';
  }

  function increaseFrom(): void {
    updateSliderRangeforDS(
      includedDataSource.id,
      increaseRangeFrom(sliderRange, lowerTheoretical)
    );
  }

  function increaseTo(): void {
    updateSliderRangeforDS(
      includedDataSource.id,
      increaseRangeTo(sliderRange, upperTheoretical)
    );
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
            return getPercentifiedValue(x, usePercentage);
          }}
          min={sliderRange[0]}
          max={sliderRange[1]}
          step={determineStepSize(
            lowestConfiguredValue,
            highestConfiguredValue
          )}
          marks={createMarks(
            sliderRange,
            observedRanges[includedDataSource.id],
            usePercentage
          )}
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
