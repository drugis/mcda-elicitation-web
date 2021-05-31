import {Grid, TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspacesContext} from '../WorkspacesContext/WorkspacesContext';

export default function WorkspacesFilter(): JSX.Element {
  const {
    availableAlternatives,
    availableCriteria,
    filterByAlternatives,
    filterByCriteria
  } = useContext(WorkspacesContext);

  function handleFilteredCriteriaChange(
    event: ChangeEvent<{}>,
    value: string[]
  ): void {
    filterByCriteria(value);
  }

  function handleFilteredAlternativesChange(
    event: ChangeEvent<{}>,
    value: string[]
  ): void {
    filterByAlternatives(value);
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Autocomplete
          multiple
          options={availableCriteria}
          onChange={handleFilteredCriteriaChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Criteria to include"
            />
          )}
        ></Autocomplete>
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={6}>
        <Autocomplete
          multiple
          options={availableAlternatives}
          onChange={handleFilteredAlternativesChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Alternatives to include"
            />
          )}
        ></Autocomplete>
      </Grid>
      <Grid item xs={6} />
    </Grid>
  );
}
