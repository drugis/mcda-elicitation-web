import React, {useContext} from 'react';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {getWorst} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';

export default function TradeOffTable(): JSX.Element {
  const {showPercentages} = useContext(SettingsContext);
  const {criteria} = useContext(TradeOffContext);
  const {pvfs} = useContext(PreferencesContext);

  function getRows(): JSX.Element[] {
    return _.map(
      criteria,
      (criterion: ICriterion): JSX.Element => {
        const unit = criterion.dataSources[0].unitOfMeasurement;
        const usePercentage = showPercentages && canBePercentage(unit.type);
        return (
          <TableRow key={criterion.id}>
            <TableCell>
              Changing {criterion.title} from{' '}
              {getWorst(pvfs[criterion.id], usePercentage)} to {getB(criterion)}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  function getB(criterion: ICriterion): number {
    return 123;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{getRows()}</TableBody>
    </Table>
  );
}
