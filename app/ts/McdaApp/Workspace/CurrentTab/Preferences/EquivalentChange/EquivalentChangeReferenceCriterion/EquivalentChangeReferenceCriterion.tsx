import {Grid, Select, Typography} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';

export default function EquivalentChangeReferenceCriterion(): JSX.Element {
  const {referenceCriterion, updateReferenceCriterion} = useContext(
    EquivalentChangeContext
  );
  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  function handleReferenceCriterionChanged(
    event: ChangeEvent<{value: string}>
  ): void {
    updateReferenceCriterion(event.target.value);
  }

  function getReferenceCriterionOptions(): JSX.Element[] {
    return _.map(
      filteredCriteria,
      (criterion: ICriterion): JSX.Element => (
        <option value={criterion.id} key={criterion.id}>
          {criterion.title}
        </option>
      )
    );
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <Typography>Reference criterion:</Typography>
      </Grid>
      <Grid item xs={10}>
        <Select
          native
          id="reference-criterion-selector"
          value={referenceCriterion.id}
          onChange={handleReferenceCriterionChanged}
          style={{minWidth: 220}}
        >
          {getReferenceCriterionOptions()}
        </Select>
      </Grid>
    </Grid>
  );
}
