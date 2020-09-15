import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {ElicitationContextProviderComponent} from '../ElicitationContext';
import IInputCriterion from '../Interface/IInputCriterion';
import IRatioBound from '../Interface/IRatioBound';
import {PreferencesContextProviderComponent} from '../PreferencesContext';
import ImpreciseSwingWeighting from './ImpreciseSwingWeighting';

export default function ImpreciseSwingElicitationWrapper({
  criteria,
  cancel,
  save
}: {
  criteria: IInputCriterion[];
  cancel: () => void;
  save: (preferences: IRatioBound[]) => void;
}) {
  return (
    <PreferencesContextProviderComponent inputCriteria={criteria}>
      <ElicitationContextProviderComponent
        elicitationMethod="imprecise"
        cancel={cancel}
        save={save}
      >
        <Grid container justify="center" component={Box} mt={2}>
          <ImpreciseSwingWeighting />
        </Grid>
      </ElicitationContextProviderComponent>
    </PreferencesContextProviderComponent>
  );
}
