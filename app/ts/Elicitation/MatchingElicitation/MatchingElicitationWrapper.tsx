import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import IInputCriterion from '../Interface/IInputCriterion';
import MatchingElicitation from './MatchingElicitation/MatchingElicitation';
import {MatchingElicitationContextProviderComponent} from './MatchingElicitationContext';

export default function MatchingElicitationWrapper({
  criteria,
  cancel,
  save
}: {
  criteria: IInputCriterion[];
  cancel: () => void;
  save: (preferences: any) => void;
}) {
  return (
    <MatchingElicitationContextProviderComponent
      inputCriteria={criteria}
      cancel={cancel}
      save={save}
    >
      <Grid container justify="center" component={Box} mt={2}>
        <MatchingElicitation />
      </Grid>
    </MatchingElicitationContextProviderComponent>
  );
}
