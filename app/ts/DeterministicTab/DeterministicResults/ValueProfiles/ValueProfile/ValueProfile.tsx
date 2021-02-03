import {Grid, Typography} from '@material-ui/core';
import React from 'react';
import TotalValueTable from './TotalValueTable/TotalValueTable';
import ValueProfilePlot from './ValueProfilePlot/ValueProfilePlot';
import ValueProfilesTable from './ValueProfilesTable/ValueProfilesTable';

export default function ValueProfile({
  profileCase,
  totalValues,
  valueProfiles
}: {
  profileCase: string;
  totalValues: Record<string, number>;
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6">
          {profileCase.charAt(0).toUpperCase() + profileCase.substr(1)} case
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ValueProfilePlot
          profileCase={profileCase}
          valueProfiles={valueProfiles}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Total value ({profileCase} case)</Typography>
      </Grid>
      <Grid item xs={12}>
        <TotalValueTable totalValues={totalValues} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          Value profiles table ({profileCase} case)
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ValueProfilesTable valueProfiles={valueProfiles} />
      </Grid>
    </Grid>
  );
}
