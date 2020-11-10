import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
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
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUpperBound} from 'app/ts/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';
import {
  adjustConfiguredRangeForStepSize,
  createMarks,
  decreaseSliderLowerBound,
  determineStepSizes,
  increaseSliderUpperBound
} from '../AddSubproblemScaleRangesUtil';
import {calculateRestrictedAreaWidthPercentage} from './ScalesSliderUtil';

export default function ScalesSlider({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(WorkspaceContext);
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

  const stepSizeOptions = determineStepSizes(
    lowestObservedValue,
    highestObservedValue
  );
  const [stepSize, setStepSize] = useState<number>(getInitialStepSize()); //FIXME: double-check the story

  function getInitialStepSize(): number {
    const stepSizeForDS = getStepSizeForDS(includedDataSource.id);
    return stepSizeForDS ? stepSizeForDS : stepSizeOptions[1];
  } // FIXME: move to context

  useEffect(() => {
    const newConfiguredRange = adjustConfiguredRangeForStepSize(
      stepSize,
      configuredRange
    );
    setConfiguredRange(
      includedDataSource.id,
      newConfiguredRange[0],
      newConfiguredRange[1]
    );
    updateStepSizeForDS(includedDataSource.id, stepSize);
  }, [stepSize]);

  function handleChange(event: any, newValue: [number, number]) {
    if (
      newValue[0] <= lowestObservedValue &&
      newValue[1] >= highestObservedValue
    ) {
      setConfiguredRange(includedDataSource.id, newValue[0], newValue[1]);
    }
  }

  function handleStepSizeChange(event: any) {
    updateStepSizeForDS(
      includedDataSource.id,
      Number.parseFloat(event.target.value)
    );
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
        Step size:{' '}
        <Select
          native
          id={`step-size-selector-${criterion.id}`}
          value={stepSize}
          onChange={handleStepSizeChange}
        >
          {_.map(stepSizeOptions, (option) => {
            return (
              <option
                key={`step-size-${criterion.id}-${option}`}
                value={option}
              >
                {usePercentage
                  ? significantDigits(option, 1) * 100
                  : significantDigits(option, 1)}
              </option>
            );
          })}
        </Select>
      </Grid>
    </Grid>
  );
}
