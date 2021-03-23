import Grid from '@material-ui/core/Grid';
import ICriterion from '@shared/interface/ICriterion';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import _ from 'lodash';
import React, {useCallback, useContext} from 'react';
import {AddSubproblemContext} from '../AddSubproblemContext';
import {
  decreaseSliderLowerBound,
  increaseSliderUpperBound
} from './AddSubproblemScaleRangesUtil';
import ScalesSlider from './ScalesSlider/ScalesSlider';

export default function AddSubproblemScaleRanges() {
  const {criteria} = useContext(AddSubproblemContext);
  const {scaleRangesWarnings, isCriterionExcluded} = useContext(
    AddSubproblemContext
  );

  const {
    configuredRanges,
    getIncludedDataSourceForCriterion,
    getSliderRangeForDS,
    setConfiguredRange,
    updateSliderRangeforDS,
    getStepSizeForDS
  } = useContext(AddSubproblemContext);

  const changeCallback = useCallback(
    (dataSourceId: string, lowValue: number, highValue: number) => {
      setConfiguredRange(dataSourceId, lowValue, highValue);
    },
    [setConfiguredRange]
  );

  const changeLowerBoundCallback = useCallback(
    (
      dataSourceId: string,
      lowerTheoretical: number,
      sliderRange: [number, number]
    ) => {
      updateSliderRangeforDS(
        dataSourceId,
        decreaseSliderLowerBound(sliderRange, lowerTheoretical)
      );
    },
    [updateSliderRangeforDS]
  );

  const changeUpperBoundCallback = useCallback(
    (
      dataSourceId: string,
      upperTheoretical: number,
      sliderRange: [number, number]
    ) => {
      updateSliderRangeforDS(
        dataSourceId,
        increaseSliderUpperBound(sliderRange, upperTheoretical)
      );
    },
    [updateSliderRangeforDS]
  );

  function renderSliders() {
    return _.map(criteria, renderSlider);
  }

  function renderSlider(criterion: ICriterion): JSX.Element {
    if (!isCriterionExcluded(criterion.id)) {
      const dataSource = getIncludedDataSourceForCriterion(criterion);
      const sliderRange = getSliderRangeForDS(dataSource.id);
      const stepSize = getStepSizeForDS(dataSource.id);
      const configuredRange = configuredRanges[dataSource.id];

      return (
        <ScalesSlider
          key={criterion.id}
          criterion={criterion}
          dataSource={dataSource}
          sliderRange={sliderRange}
          stepSize={stepSize}
          configuredRange={configuredRange}
          changeCallback={changeCallback}
          changeLowerBoundCallback={changeLowerBoundCallback}
          changeUpperBoundCallback={changeUpperBoundCallback}
        />
      );
    }
  }

  return scaleRangesWarnings.length > 0 ? (
    <DisplayWarnings warnings={scaleRangesWarnings} identifier="scale-ranges" />
  ) : (
    <Grid container item xs={12} spacing={4}>
      {renderSliders()}
    </Grid>
  );
}
