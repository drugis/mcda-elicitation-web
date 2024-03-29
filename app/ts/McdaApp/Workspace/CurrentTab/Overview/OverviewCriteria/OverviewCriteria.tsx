import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ICriterion from '@shared/interface/ICriterion';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';
import {WorkspaceContext} from '../../../WorkspaceContext/WorkspaceContext';
import OverviewCriterion from './OverviewCriterion/OverviewCriterion';
import {OverviewCriterionContextProviderComponent} from './OverviewCriterionContext/OverviewCriterionContext';

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
          <ShowIf condition={Boolean(favourableCriteria.length)}>
            <Grid item xs={12}>
              <CriteriaBackground>
                <FavorabilityHeader>Favourable criteria</FavorabilityHeader>
                <Criteria criteria={favourableCriteria} />
              </CriteriaBackground>
            </Grid>
          </ShowIf>
          <ShowIf condition={Boolean(unfavourableCriteria.length)}>
            <Grid item xs={12}>
              <CriteriaBackground>
                <FavorabilityHeader>Unfavourable criteria</FavorabilityHeader>
                <Criteria criteria={unfavourableCriteria} />
              </CriteriaBackground>
            </Grid>
          </ShowIf>
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
        justifyContent="center"
      >
        {children}
      </Grid>
    );
  }

  function FavorabilityHeader({children}: {children: any}): JSX.Element {
    return (
      <Grid container item xs={12} justifyContent="center">
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
            <Grid
              item
              xs={12}
              key={criterion.id}
              id={`criterion-card-${index}`}
            >
              <OverviewCriterionContextProviderComponent
                criterion={criterion}
                nextCriterionId={nextCriterionId}
                previousCriterionId={previousCriterionId}
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
    <Grid container item xs={12} id="criteria-container">
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="criterion">Criteria</InlineHelp>
        </Typography>
      </Grid>
      <CriteriaContainer />
    </Grid>
  );
}
