import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import {makeStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUpperBound} from 'app/ts/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import {getUnitLabelNullsafe} from 'app/ts/util/getUnitLabel';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {memo, useContext} from 'react';
import {createMarks} from '../AddSubproblemScaleRangesUtil';
import {calculateRestrictedAreaWidthPercentage} from './ScalesSliderUtil';
import StepSizeSelector from './StepSizeSelector/StepSizeSelector';

interface IProps {
  criterion: ICriterion;
  dataSource: IDataSource;
  sliderRange: [number, number];
  stepSize: number;
  configuredRange: [number, number];
  changeCallback: (
    dataSourceId: string,
    lowValue: number,
    highValue: number
  ) => void;
  changeLowerBoundCallback: (
    dataSourceId: string,
    lowerTheoretical: number,
    sliderRange: [number, number]
  ) => void;
  changeUpperBoundCallback: (
    dataSourceId: string,
    upperTheoretical: number,
    sliderRange: [number, number]
  ) => void;
}

function ScalesSlider({
  criterion,
  dataSource,
  sliderRange,
  stepSize,
  configuredRange,
  changeCallback,
  changeLowerBoundCallback,
  changeUpperBoundCallback
}: IProps) {
  const {showPercentages} = useContext(SettingsContext);
  const {observedRanges} = useContext(SubproblemContext);

  // units
  const unit = dataSource.unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);

  // ranges
  const [lowestObservedValue, highestObservedValue] = observedRanges[
    dataSource.id
  ];
  const [lowerTheoretical, upperTheoretical]: [number, number] = [
    dataSource.unitOfMeasurement.lowerBound,
    getUpperBound(usePercentage, dataSource.unitOfMeasurement)
  ];

  function handleChange(event: any, [lowValue, highValue]: [number, number]) {
    if (lowValue <= lowestObservedValue && highValue >= highestObservedValue) {
      changeCallback(dataSource.id, lowValue, highValue);
    }
  }

  function decreaseLowerBound(): void {
    changeLowerBoundCallback(dataSource.id, lowerTheoretical, sliderRange);
  }

  function increaseUpperBound(): void {
    changeUpperBoundCallback(dataSource.id, upperTheoretical, sliderRange);
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
        {`${criterion.title} ${getUnitLabelNullsafe(
          dataSource.unitOfMeasurement,
          showPercentages
        )}`}
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
            observedRanges[dataSource.id],
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

function areEqual(prevProps: IProps, nextProps: IProps): boolean {
  const toCompare = [
    'criterion',
    'dataSource',
    'sliderRange',
    'stepSize',
    'configuredRange'
  ];
  return _.isEqual(_.pick(prevProps, toCompare), _.pick(nextProps, toCompare));
}

export default memo(ScalesSlider, areEqual);
