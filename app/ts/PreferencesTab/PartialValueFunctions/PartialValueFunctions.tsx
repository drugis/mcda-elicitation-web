import React, {useContext} from 'react';
import {Grid, ButtonGroup, Button} from '@material-ui/core';
import {PreferencesContext} from '../PreferencesContext';
import _ from 'lodash';
import PartialValueFunctionPlot from './PartialValueFunctionPlot/PartialValueFunctionPlot';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import PartialValueFunctionButtons from './PartialValueFunctionButtons/PartialValueFunctionButtons';

export default function PartialValueFunctions() {
  const {problem} = useContext(PreferencesContext);

  function getPartialValueFunctions(): JSX.Element[] {
    function getPlotOrQuestionMark(
      criterion: IProblemCriterion,
      criterionId: string
    ) {
      if (criterion.dataSources[0].pvf && criterion.dataSources[0].pvf.type) {
        return (
          <PartialValueFunctionPlot
            criterion={criterion}
            criterionId={criterionId}
          />
        );
      } else {
        return <div style={{fontSize: '213px', textAlign: 'center'}}>?</div>;
      }
    }

    return _.map(problem.criteria, (criterion, criterionId) => {
      return (
        <Grid key={criterionId} container item lg={3} md={4} xs={6}>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            {criterion.title}
          </Grid>
          <Grid item xs={12}>
            {getPlotOrQuestionMark(criterion, criterionId)}
          </Grid>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            <PartialValueFunctionButtons
              criterion={criterion}
              criterionId={criterionId}
            />
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
