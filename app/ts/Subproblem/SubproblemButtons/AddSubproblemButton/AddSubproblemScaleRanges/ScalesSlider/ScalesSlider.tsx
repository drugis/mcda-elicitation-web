import {Grid, Slider} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext, useState} from 'react';

export default function ScalesSlider({criterion}: {criterion: ICriterion}) {
  const {observedRanges} = useContext(WorkspaceContext);
  const lowestObservedValue = observedRanges[criterion.id][0];
  const highestObservedValue = observedRanges[criterion.id][1];

  const [value, setValue] = useState<number[]>([
    lowestObservedValue,
    highestObservedValue
  ]);

  // const limits:[number,number] = [];

  const handleChange = (event: any, newValue: number[]) => {
    // if (newValue[0] <= 30 && newValue[1] >= 70) {
    setValue(newValue);
    // }
  };

  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        {criterion.title} (units)
      </Grid>
      <Grid item xs={12}>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="on"
          min={lowestObservedValue}
          max={highestObservedValue}
          step={0.1}
          // marks={limits}
        />
      </Grid>
    </Grid>
  );
}
