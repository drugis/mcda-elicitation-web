import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import {makeStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
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
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {useContext, useEffect} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';
import {
  adjustConfiguredRangeForStepSize,
  createMarks,
  decreaseSliderLowerBound,
  increaseSliderUpperBound
} from '../AddSubproblemScaleRangesUtil';
import {calculateRestrictedAreaWidthPercentage} from './ScalesSliderUtil';
import StepSizeSelector from './StepSizeSelector/StepSizeSelector';

export default function ScalesSlider({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(SubproblemContext);
  const {
    configuredRanges,
    getIncludedDataSourceForCriterion,
    getSliderRangeForDS,
    setConfiguredRange,
    updateSliderRangeforDS,
    getStepSizeForDS,
    updateStepSizeForDS
  } = useContext(AddSubproblemContext);
  const includedDataSource = getIncludedDataSourceForCriterion(criterion);
  const sliderRange = getSliderRangeForDS(includedDataSource.id);
  const stepSize = getStepSizeForDS(includedDataSource.id);

  // units
  const unit = includedDataSource.unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);

  // ranges
  const configuredRange = configuredRanges[includedDataSource.id];
  const [lowestObservedValue, highestObservedValue] = observedRanges[
    includedDataSource.id
  ];
  const [lowerTheoretical, upperTheoretical]: [number, number] = [
    includedDataSource.unitOfMeasurement.lowerBound,
    getUpperBound(usePercentage, includedDataSource.unitOfMeasurement)
  ];

  useEffect(() => {
    const newConfiguredRange = adjustConfiguredRangeForStepSize(
      stepSize,
      configuredRange,
      sliderRange
    );
    setConfiguredRange(
      includedDataSource.id,
      newConfiguredRange[0],
      newConfiguredRange[1]
    );
    updateStepSizeForDS(includedDataSource.id, stepSize);
  }, [
    stepSize,
    sliderRange,
    configuredRange,
    setConfiguredRange,
    includedDataSource.id,
    updateStepSizeForDS
  ]);

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

  function decreaseLowerBound(): void {
    updateSliderRangeforDS(
      includedDataSource.id,
      decreaseSliderLowerBound(sliderRange, lowerTheoretical)
    );
  }

  function increaseUpperBound(): void {
    updateSliderRangeforDS(
      includedDataSource.id,
      increaseSliderUpperBound(sliderRange, upperTheoretical)
    );
  }

  const restrictedAreaRatio: string = calculateRestrictedAreaWidthPercentage(
    sliderRange,
    [lowestObservedValue, highestObservedValue]
  );
  const sliderMarkStartIndex = sliderRange[0] === lowestObservedValue ? 0 : 1;

  const useStyles = makeStyles({
    root: {
      [`& .MuiSlider-markActive[data-index="${sliderMarkStartIndex}"]`]: {
        width: restrictedAreaRatio,
        backgroundColor: 'red',
        height: '7px',
        transform: 'translateY(-3px)',
        opacity: 1
      },
      [`& .MuiSlider-markActive[data-index="${sliderMarkStartIndex + 1}"]`]: {
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
          <IconButton
            id={`extend-from-${criterion.id}`}
            onClick={decreaseLowerBound}
          >
            <ChevronLeft color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={8}>
        <Slider
          id={`slider-${criterion.id}`}
          value={configuredRange}
          onChange={handleChange}
          valueLabelDisplay="on"
          valueLabelFormat={(x: number) => {
            return getPercentifiedValue(x, usePercentage);
          }}
          min={sliderRange[0]}
          max={sliderRange[1]}
          step={stepSize}
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
          <IconButton
            id={`extend-to-${criterion.id}`}
            onClick={increaseUpperBound}
          >
            <ChevronRight color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={2}>
        Step size: <StepSizeSelector criterion={criterion} />
      </Grid>
    </Grid>
  );
}
