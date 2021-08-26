import {Grid, Select, Typography} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {TProfileCase} from 'app/ts/type/profileCase';
import _ from 'lodash';
import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../../../DeterministicResultsContext/DeterministicResultsContext';

export default function RelativeAlternativeSelect({
  profileCase
}: {
  profileCase: TProfileCase;
}): JSX.Element {
  const {getReference, getComparator, setReference, setComparator} = useContext(
    DeterministicResultsContext
  );
  const reference = getReference(profileCase);
  const comparator = getComparator(profileCase);

  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  function renderReferenceOptions(idToOmit: string): JSX.Element[] {
    return _.map(
      _.reject(filteredAlternatives, ['id', idToOmit]),
      (alternative: IAlternative): JSX.Element => (
        <option value={alternative.id} key={alternative.id}>
          {alternative.title}
        </option>
      )
    );
  }

  function handleReferenceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    const newReference = _.find(filteredAlternatives, ['id', selectedId]);
    setReference(profileCase, newReference);
  }

  function handleComparatorChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    const newComparator = _.find(filteredAlternatives, ['id', selectedId]);
    setComparator(profileCase, newComparator);
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <Typography>Reference:</Typography>
      </Grid>
      <Grid item xs={10}>
        <Select
          native
          id={`value-profile-reference-select-${profileCase}`}
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
          id={`value-profile-comparator-select-${profileCase}`}
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
