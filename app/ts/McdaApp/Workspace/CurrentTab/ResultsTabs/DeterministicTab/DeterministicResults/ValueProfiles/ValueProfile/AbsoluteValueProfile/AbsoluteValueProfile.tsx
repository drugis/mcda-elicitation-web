import {Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import PlotButtons from 'app/ts/PlotButtons/PlotButtons';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {TProfileCase} from 'app/ts/type/profileCase';
import React, {useContext, useEffect, useState} from 'react';
import {pataviResultToAbsoluteValueProfile} from '../../../../DeterministicResultsUtil';
import TotalValueTable from './TotalValueTable/TotalValueTable';
import ValueProfilePlot from './ValueProfilePlot/ValueProfilePlot';
import ValueProfilesTable from './ValueProfilesTable/ValueProfilesTable';

export default function AbsoluteValueProfile({
  profileCase,
  totalValues,
  valueProfiles
}: {
  profileCase: TProfileCase;
  totalValues: Record<string, number>;
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const [plotValues, setPlotValues] =
    useState<[string, ...(string | number)[]][]>(undefined);

  useEffect(() => {
    setPlotValues(
      pataviResultToAbsoluteValueProfile(
        valueProfiles,
        filteredCriteria,
        filteredAlternatives,
        legendByAlternativeId
      )
    );
  }, [
    valueProfiles,
    filteredCriteria,
    filteredAlternatives,
    legendByAlternativeId
  ]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {profileCase.charAt(0).toUpperCase() + profileCase.substr(1)} case
        </Typography>
      </Grid>
      <ShowIf condition={Boolean(plotValues)}>
        <Grid item xs={12} id={`${profileCase}-profile-plot`}>
          <PlotButtons plotId={`value-profile-plot-${profileCase}`}>
            <ValueProfilePlot
              profileCase={profileCase}
              plotValues={plotValues}
            />
          </PlotButtons>
        </Grid>
      </ShowIf>
      <Grid item xs={9}>
        <Typography variant="h6">Total value ({profileCase} case)</Typography>
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <ClipboardButton targetId={`#${profileCase}-total-value-table`} />
      </Grid>
      <Grid item xs={12} id={`${profileCase}-total-value-table`}>
        <TotalValueTable
          alternatives={filteredAlternatives}
          totalValues={totalValues}
          profileCase={profileCase}
        />
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h6">
          Value profiles table ({profileCase} case)
        </Typography>
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <ClipboardButton targetId={`#${profileCase}-value-profiles-table`} />
      </Grid>
      <Grid item xs={12} id={`${profileCase}-value-profiles-table`}>
        <ValueProfilesTable
          alternatives={filteredAlternatives}
          valueProfiles={valueProfiles}
        />
      </Grid>
    </Grid>
  );
}
