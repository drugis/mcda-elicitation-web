import {Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import LegendWrapper from 'app/ts/Legend/LegendWrapper/LegendWrapper';
import React from 'react';
import TotalValueTable from './TotalValueTable/TotalValueTable';
import ValueProfilePlot from './ValueProfilePlot/ValueProfilePlot';
import ValueProfilesTable from './ValueProfilesTable/ValueProfilesTable';

export default function ValueProfile({
  profileCase,
  totalValues,
  valueProfiles
}: {
  profileCase: 'base' | 'recalculated';
  totalValues: Record<string, number>;
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {profileCase.charAt(0).toUpperCase() + profileCase.substr(1)} case
        </Typography>
      </Grid>
      <Grid container item xs={12} id={`${profileCase}-profile-plot`}>
        <LegendWrapper buttonId={`${profileCase}-profile-plot-legend`}>
          <ValueProfilePlot
            profileCase={profileCase}
            valueProfiles={valueProfiles}
          />
        </LegendWrapper>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h6">Total value ({profileCase} case)</Typography>
      </Grid>
      <Grid container item xs={3} justify="flex-end">
        <ClipboardButton targetId={`#${profileCase}-total-value-table`} />
      </Grid>
      <Grid item xs={12} id={`${profileCase}-total-value-table`}>
        <TotalValueTable totalValues={totalValues} />
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h6">
          Value profiles table ({profileCase} case)
        </Typography>
      </Grid>
      <Grid container item xs={3} justify="flex-end">
        <ClipboardButton targetId={`#${profileCase}-value-profiles-table`} />
      </Grid>
      <Grid item xs={12} id={`${profileCase}-value-profiles-table`}>
        <ValueProfilesTable valueProfiles={valueProfiles} />
      </Grid>
    </Grid>
  );
}
