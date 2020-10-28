import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import {buildImportance} from './PreferencesWeightsTableUtil';

export default function PreferencesWeightsTable() {
  const {showPercentages} = useContext(SettingsContext);
  const {criteria, pvfs, currentScenario} = useContext(PreferencesContext);
  const [importances, setImportances] = useState<Record<string, string>>(
    buildImportance(criteria, currentScenario.state.prefs)
  );

  useEffect(() => {
    setImportances(buildImportance(criteria, currentScenario.state.prefs));
  }, [currentScenario, pvfs]);

  function getWeight(criterionId: string) {
    if (currentScenario.state.weights) {
      return significantDigits(currentScenario.state.weights.mean[criterionId]);
    } else {
      return (
        <Tooltip title="Not all partial value functions have been set">
          <span>?</span>
        </Tooltip>
      );
    }
  }

  return (
    <Table id="perferences-weights-table">
      <TableHead>
        <TableRow>
          <TableCell>
            Criterion <InlineHelp helpId="criterion" />
          </TableCell>
          <TableCell>Description</TableCell>
          <TableCell>
            Unit <InlineHelp helpId="unit-of-measurement" />
          </TableCell>
          <TableCell>Worst</TableCell>
          <TableCell>Best</TableCell>
          <TableCell>
            Importance <InlineHelp helpId="importance" />
          </TableCell>
          <TableCell>
            Weight <InlineHelp helpId="representative-weights" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(criteria, (criterion) => {
          const usePercentage =
            showPercentages &&
            canBePercentage(criterion.unitOfMeasurement.type);
          return (
            <TableRow key={criterion.id}>
              <TableCell>{criterion.title}</TableCell>
              <TableCell>{criterion.description}</TableCell>
              <TableCell id={`unit-${criterion.id}`}>
                {getUnitLabel(criterion.unitOfMeasurement, showPercentages)}
              </TableCell>
              <TableCell id={`worst-${criterion.id}`}>
                {getWorst(pvfs[criterion.id], usePercentage)}
              </TableCell>
              <TableCell id={`best-${criterion.id}`}>
                {getBest(pvfs[criterion.id], usePercentage)}
              </TableCell>
              <TableCell id={`importance-criterion-${criterion.id}`}>
                {importances[criterion.id]}
              </TableCell>
              <TableCell id={`weight-criterion-${criterion.id}`}>
                {getWeight(criterion.id)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
