import {
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ClipboardButton from 'app/ts/util/SharedComponents/ClipboardButton/ClipboardButton';
import EffectsTableAlternativeHeaders from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import CriteriaHeader from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';
import SensitivityTableButtons from '../SensitivityTableButtons/SensitivityTableButtons';
import {SensitivityMeasurementsContext} from './SensitivityMeasurementsContext';
import SensitivityMeasurementsTableRow from './SensitivityMeasurementsTableRow/SensitivityMeasurementsTableRow';

export default function SensitivityMeasurementsTable(): JSX.Element {
  const {filteredAlternatives, filteredCriteria, configuredRanges} = useContext(
    CurrentSubproblemContext
  );
  const {resetSensitivityTable} = useContext(SensitivityMeasurementsContext);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} id="sensitivity-measurements-header">
        <Typography variant="h5">
          <InlineHelp helpId="deterministic-effects-table">
            Measurements
          </InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        <LoadingSpinner showSpinnerCondition={_.isEmpty(configuredRanges)}>
          <Grid item xs={9}>
            <Typography>
              <em>Values can be changed by clicking them.</em>
            </Typography>
          </Grid>
          <Grid container item xs={3} justifyContent="flex-end">
            <ClipboardButton targetId="#sensitivity-measurements-table" />
          </Grid>
          <Grid item xs={12}>
            <Table id="sensitivity-measurements-table" size="small">
              <TableHead>
                <TableRow>
                  <CriteriaHeader colSpan={1} />
                  <DescriptionHeader />
                  <UnitsHeader />
                  <EffectsTableAlternativeHeaders
                    alternatives={filteredAlternatives}
                  />
                  <SoEUncHeader />
                  <ReferencesHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                <Rows criteria={filteredCriteria} />
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <SensitivityTableButtons
              resetter={resetSensitivityTable}
              idContext="measurements"
            />
          </Grid>
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}

function Rows({criteria}: {criteria: ICriterion[]}): JSX.Element {
  return (
    <>
      {_.map(criteria, (criterion: ICriterion) => (
        <SensitivityMeasurementsTableRow
          key={criterion.id}
          criterion={criterion}
        />
      ))}
    </>
  );
}
