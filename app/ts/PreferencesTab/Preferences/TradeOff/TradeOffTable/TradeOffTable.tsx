import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';

export default function TradeOffTable(): JSX.Element {
  const {showPercentages} = useContext(SettingsContext);
  const {criteria, partOfInterval} = useContext(TradeOffContext);
  const {pvfs, currentScenario} = useContext(PreferencesContext);

  function getRows(): JSX.Element[] {
    return _.map(
      criteria,
      (criterion: ICriterion): JSX.Element => {
        const unit = criterion.dataSources[0].unitOfMeasurement;
        const usePercentage = showPercentages && canBePercentage(unit.type);
        const b = getB(criterion, usePercentage);
        return (
          <TableRow key={criterion.id}>
            <TableCell>
              Changing {criterion.title} from{' '}
              {getWorst(pvfs[criterion.id], usePercentage)} to {b}
            </TableCell>
            <TableCell>
              {isBRealistic(b, criterion, usePercentage)
                ? ''
                : `This value is unrealistic given the criterion's range`}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  function getB(criterion: ICriterion, usePercentage: boolean): number {
    const weight = currentScenario.state.weights.mean[criterion.id];
    const pvf = pvfs[criterion.id];
    const range = pvfs[criterion.id].range;
    const interval = range[1] - range[0];
    const change = weight * partOfInterval * interval;
    const modifier = usePercentage ? 100 : 1;
    if (pvf.direction === 'increasing') {
      return significantDigits(modifier * (range[0] + change));
    } else {
      return significantDigits(modifier * (range[1] - change));
    }
  }

  function isBRealistic(
    b: number,
    criterion: ICriterion,
    usePercentage: boolean
  ): boolean {
    const pvf = pvfs[criterion.id];
    const best = getBest(pvf, usePercentage);
    if (pvf.direction === 'increasing') {
      return b <= best;
    } else {
      return b >= best;
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Statement</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{getRows()}</TableBody>
    </Table>
  );
}
