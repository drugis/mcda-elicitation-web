import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {ElicitationContextProviderComponent} from '../ElicitationContext';
import IExactSwingRatio from '../Interface/IExactSwingRatio';
import IInputCriterion from '../Interface/IInputCriterion';
import PreciseSwingWeighting from './PreciseSwingElicitation/PreciseSwingWeighting';

export default function PreciseSwingElicitationWrapper({
  criteria,
  cancel,
  save
}: {
  criteria: IInputCriterion[];
  cancel: () => void;
  save: (preferences: IExactSwingRatio[]) => void;
}) {
  return (
    <ElicitationContextProviderComponent
      inputCriteria={criteria}
      cancel={cancel}
      save={save}
    >
      <Grid container justify="center" component={Box} mt={2}>
        <PreciseSwingWeighting />
      </Grid>
    </ElicitationContextProviderComponent>
  );
}
