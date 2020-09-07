import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {UNRANKED} from 'app/ts/Elicitation/constants';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import {RankingElicitationContext} from '../../RankingElicitationContext';
export default function RankingChoices({
  selectedCriterionId,
  handleSelection
}: {
  selectedCriterionId: string;
  handleSelection: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const {criteria} = useContext(PreferencesContext);
  const {rankings} = useContext(RankingElicitationContext);
  const filteredCriteria = _.filter(criteria, (criterion) => {
    return (
      !rankings[criterion.mcdaId] ||
      rankings[criterion.mcdaId].rank === UNRANKED
    );
  });

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          Which of the following improvements is most important?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="ranking-criterion-radio"
          value={selectedCriterionId}
          onChange={handleSelection}
        >
          {filteredCriteria.map((criterion) => {
            return (
              <label key={criterion.mcdaId}>
                <Radio key={criterion.mcdaId} value={criterion.mcdaId} />
                {criterion.pvfDirection}{' '}
                <Tooltip
                  disableHoverListener={!criterion.description}
                  title={criterion.description ? criterion.description : ''}
                >
                  <span className="criterion-title">{criterion.title}</span>
                </Tooltip>{' '}
                {`from ${getWorst(criterion)} to ${getBest(criterion)}`}
              </label>
            );
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
