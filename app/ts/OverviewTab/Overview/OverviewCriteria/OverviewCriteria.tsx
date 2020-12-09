import {Grid, Typography} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import {OverviewCriterionContextProviderComponent} from 'app/ts/Workspace/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import OverviewCriterion from './OverviewCriterion/OverviewCriterion';

export default function OverviewCriteria() {
  const {workspace} = useContext(WorkspaceContext);

  function renderCriteria(): JSX.Element[] {
    if (workspace.properties.useFavourability) {
      return foo(workspace.criteria);
    } else {
      return foo(workspace.criteria);
    }
  }

  function foo(criteria: ICriterion[]): JSX.Element[] {
    return _.map(criteria, (criterion: ICriterion, index: number) => {
      const previousCriterionId = getPreviousId(index, criteria);
      const nextCriterionId = getNextId(index, criteria);
      return (
        <OverviewCriterionContextProviderComponent
          criterion={criterion}
          nextCriterionId={nextCriterionId}
          previousCriterionId={previousCriterionId}
        >
          <OverviewCriterion key={criterion.id} />
        </OverviewCriterionContextProviderComponent>
      );
    });
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
