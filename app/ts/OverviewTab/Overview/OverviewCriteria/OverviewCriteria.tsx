import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ICriterion from '@shared/interface/ICriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import {OverviewCriterionContextProviderComponent} from 'app/ts/Workspace/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import OverviewCriterion from './OverviewCriterion/OverviewCriterion';

const style = {backgroundColor: '#eaeaea', margin: '0px'};

export default function OverviewCriteria() {
  const {workspace} = useContext(WorkspaceContext);

  function CriteriaContainer(): JSX.Element {
    if (workspace.properties.useFavourability) {
      const [favourableCriteria, unfavourableCriteria] = _.partition(
        workspace.criteria,
        (criterion: ICriterion): boolean => {
          return criterion.isFavourable;
        }
      );
      return (
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <CriteriaBackground>
              <FavorabilityHeader>Favourable criteria</FavorabilityHeader>
              <Criteria criteria={favourableCriteria} />
            </CriteriaBackground>
          </Grid>
          <Grid item xs={12}>
            <CriteriaBackground>
              <FavorabilityHeader>Unfavourable criteria</FavorabilityHeader>
              <Criteria criteria={unfavourableCriteria} />
            </CriteriaBackground>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <CriteriaBackground>
          <Criteria criteria={workspace.criteria} />
        </CriteriaBackground>
      );
    }
  }

  function CriteriaBackground({children}: {children: any}): JSX.Element {
    return (
      <Grid
        container
        item
        xs={12}
        component={Paper}
        style={style}
        spacing={1}
        justify="center"
      >
        {children}
      </Grid>
    );
  }

  function FavorabilityHeader({children}: {children: any}): JSX.Element {
    return (
      <Grid container item xs={12} justify="center">
        <Typography variant="h6">{children}</Typography>
      </Grid>
    );
  }

  function Criteria({criteria}: {criteria: ICriterion[]}): JSX.Element {
    return (
      <Grid container item xs={12} spacing={2}>
        {_.map(criteria, (criterion: ICriterion, index: number) => {
          const previousCriterionId = getPreviousId(index, criteria);
          const nextCriterionId = getNextId(index, criteria);
          return (
            <Grid item xs={12}>
              <OverviewCriterionContextProviderComponent
                criterion={criterion}
                nextCriterionId={nextCriterionId}
                previousCriterionId={previousCriterionId}
                key={criterion.id}
              >
                <OverviewCriterion />
              </OverviewCriterionContextProviderComponent>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Criteria <InlineHelp helpId="criterion" />
        </Typography>
      </Grid>
      <CriteriaContainer />
    </Grid>
  );
}
