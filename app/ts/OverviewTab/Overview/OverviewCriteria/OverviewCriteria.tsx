import {Grid, Typography} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import OverviewCriterion from './OverviewCriterion/OverviewCriterion';

export default function OverviewCriteria() {
  const {workspace, criteria} = useContext(WorkspaceContext);

  function renderCriteria(): JSX.Element[] {
    if (workspace.properties.useFavourability) {
      return _.map(
        criteria,
        (criterion: ICriterion): JSX.Element => (
          <OverviewCriterion criterion={criterion} />
        )
      );
    } else {
      return _.map(
        criteria,
        (criterion: ICriterion): JSX.Element => (
          <OverviewCriterion criterion={criterion} />
        )
      );
    }
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant={'h5'}>
          Criteria <InlineHelp helpId="criterion" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {renderCriteria()}
      </Grid>
    </Grid>
  );
}
