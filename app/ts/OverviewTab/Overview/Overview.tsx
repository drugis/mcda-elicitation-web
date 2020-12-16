import {Grid} from '@material-ui/core';
import React from 'react';
import DownloadWorkspace from './DownloadWorkspace/DownloadWorkspace';
import OverviewAlternatives from './OverviewAlternatives/OverviewAlternatives';
import OverviewCriteria from './OverviewCriteria/OverviewCriteria';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';

export default function Overview() {
  return (
    <Grid container spacing={2}>
      <DownloadWorkspace />
      <TherapeuticContext />
      <OverviewCriteria />
      <OverviewAlternatives />
    </Grid>
  );
}
