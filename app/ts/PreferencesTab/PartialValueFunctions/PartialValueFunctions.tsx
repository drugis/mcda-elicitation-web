import React, {useContext} from 'react';
import {Grid, ButtonGroup, Button} from '@material-ui/core';
import {PreferencesContext} from '../PreferencesContext';
import _ from 'lodash';
import PartialValueFunctionPlot from './PartialValueFunctionPlot/PartialValueFunctionPlot';

export default function PartialValueFunctions() {
  const {problem} = useContext(PreferencesContext);

  function getPartialValueFunctions(): JSX.Element[] {
    return _.map(problem.criteria, (criterion, criterionId) => {
      return (
        <Grid key={criterionId} container item lg={3} md={4} xs={6}>
          <Grid item xs={12}>
            {criterion.title}
          </Grid>
          <Grid item xs={12}>
            {criterion.dataSources[0].pvf &&
            criterion.dataSources[0].pvf.type ? (
              <PartialValueFunctionPlot
                criterion={criterion}
                criterionId={criterionId}
              />
            ) : (
              <div>?</div>
            )}
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup size="small">
              <Button variant="contained" color="primary">
                Increasing
              </Button>
              <Button variant="contained" color="primary">
                Decreasing
              </Button>
              <Button variant="contained" color="primary">
                Advanced
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      );
    });
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <h4>Partial Value Functions</h4>
        </Grid>
        <Grid container item xs={12}>
          {getPartialValueFunctions()}
        </Grid>
      </Grid>
    </>
  );
}
