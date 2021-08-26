import {Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import PlotButtons from 'app/ts/PlotButtons/PlotButtons';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {TProfileCase} from 'app/ts/type/profileCase';
import React, {useContext, useEffect, useState} from 'react';
import {DeterministicResultsContext} from '../../../../DeterministicResultsContext/DeterministicResultsContext';
import {pataviResultToRelativeValueProfile} from '../../../../DeterministicResultsUtil';
import TotalValueTable from '../AbsoluteValueProfile/TotalValueTable/TotalValueTable';
import ValueProfilePlot from '../AbsoluteValueProfile/ValueProfilePlot/ValueProfilePlot';
import ValueProfilesTable from '../AbsoluteValueProfile/ValueProfilesTable/ValueProfilesTable';
import RelativeAlternativeSelect from './RelativeAlternativeSelect';

export default function ({
  profileCase,
  totalValues,
  valueProfiles
}: {
  profileCase: TProfileCase;
  totalValues: Record<string, number>;
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  const {getReference, getComparator} = useContext(DeterministicResultsContext);
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const [plotValues, setPlotValues] =
    useState<[string, ...(string | number)[]][]>(undefined);
  const reference = getReference(profileCase);
  const comparator = getComparator(profileCase);

  useEffect(() => {
    setPlotValues(
      pataviResultToRelativeValueProfile(
        valueProfiles,
        filteredCriteria,
        [reference, comparator],
        legendByAlternativeId
      )
    );
  }, [
    comparator,
    filteredCriteria,
    legendByAlternativeId,
    reference,
    valueProfiles
  ]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {profileCase.charAt(0).toUpperCase() + profileCase.substr(1)} case
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RelativeAlternativeSelect profileCase={profileCase} />
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
        <Typography variant="h6">
          Relative value ({profileCase} case)
        </Typography>
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <ClipboardButton targetId={`#${profileCase}-relative-value-table`} />
      </Grid>
      <Grid item xs={12} id={`${profileCase}-relative-value-table`}>
        <TotalValueTable
          alternatives={[reference, comparator]}
          totalValues={totalValues}
          profileCase={profileCase}
          isRelative={true}
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
          alternatives={[reference, comparator]}
          valueProfiles={valueProfiles}
          isRelative={true}
        />
      </Grid>
    </Grid>
  );
}
