import {Grid, Typography} from '@material-ui/core';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import PlotButtons from 'app/ts/PlotButtons/PlotButtons';
import ClipboardButton from 'app/ts/util/SharedComponents/ClipboardButton/ClipboardButton';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import CentralWeightsPlot from './CentralWeightsPlot/CentralWeightsPlot';
import CentralWeightsTable from './CentralWeightsTable/CentralWeightsTable';

export default function CentralWeights({
  centralWeights
}: {
  centralWeights: Record<string, ICentralWeight>;
}): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="central-weights">Central Weights</InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        <LoadingSpinner showSpinnerCondition={!centralWeights}>
          <Grid item xs={12}>
            <PlotButtons plotId="central-weights-plot">
              <CentralWeightsPlot centralWeights={centralWeights} />
            </PlotButtons>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid container item xs={12} justifyContent="flex-end">
              <ClipboardButton targetId="#central-weights-table" />
            </Grid>
            <Grid item xs={12}>
              <CentralWeightsTable centralWeights={centralWeights} />
            </Grid>
          </Grid>
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}
