import {Grid, Select, Typography} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {RelativeValueProfileContext} from './RelativeValueProfileContext';

export default function RelativeAlternativeSelect(): JSX.Element {
  const {reference, comparator, setReference, setComparator} = useContext(
    RelativeValueProfileContext
  );
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  function renderReferenceOptions(idToOmit: string): JSX.Element[] {
    return _.map(
      _.reject(filteredAlternatives, ['id', idToOmit]),
      (alternative: IAlternative) => (
        <option value={alternative.id} key={alternative.id}>
          {alternative.title}
        </option>
      )
    );
  }

  function handleReferenceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    setReference(_.find(filteredAlternatives, ['id', selectedId]));
  }

  function handleComparatorChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    setComparator(_.find(filteredAlternatives, ['id', selectedId]));
  }

  return (
    <Grid container xs={12}>
      <Grid item xs={2}>
        <Typography>Reference:</Typography>
      </Grid>
      <Grid item xs={10}>
        <Select
          native
          id="value-profile-reference-select"
          value={reference.id}
          label="Reference"
          onChange={handleReferenceChange}
        >
          {renderReferenceOptions(comparator.id)}
        </Select>
      </Grid>
      <Grid item xs={2}>
        <Typography>Comparator:</Typography>
      </Grid>
      <Grid item xs={10}>
        <Select
          native
          id="value-profile-comparator-select"
          value={comparator.id}
          label="Comparator"
          onChange={handleComparatorChange}
        >
          {renderReferenceOptions(reference.id)}
        </Select>
      </Grid>
    </Grid>
  );
}
