import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
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
  const {otherCriteria: criteria, partOfInterval, referenceWeight} = useContext(
    TradeOffContext
  );
  const {pvfs, currentScenario} = useContext(PreferencesContext);

  function getRows(): JSX.Element[] {
    return _.map(
      criteria,
      (criterion: ICriterion): JSX.Element => {
        const unit = criterion.dataSources[0].unitOfMeasurement;
        const usePercentage = showPercentages && canBePercentage(unit.type);
        const improvedValue = getImprovedValue(criterion, usePercentage);
        return (
          <TableRow key={criterion.id}>
            <TableCell id={`trade-off-statement-${criterion.id}`}>
              {`Changing ${criterion.title} from ${getWorst(
                pvfs[criterion.id],
                usePercentage
              )} to ${improvedValue}`}
            </TableCell>
            <TableCell id={`trade-off-warning-${criterion.id}`}>
              {isImprovedValueRealistic(improvedValue, criterion, usePercentage)
                ? ''
                : `This value is unrealistic given the criterion's range`}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  function getImprovedValue(
    criterion: ICriterion,
    usePercentage: boolean
  ): number {
    const criterionWeight = currentScenario.state.weights.mean[criterion.id];
    const pvf = pvfs[criterion.id];
    const interval = pvf.range[1] - pvf.range[0];
    const change =
      (referenceWeight / criterionWeight) * partOfInterval * interval;
    if (pvf.direction === 'increasing') {
      return getPercentifiedValue(pvf.range[0] + change, usePercentage);
    } else {
      return getPercentifiedValue(pvf.range[1] - change, usePercentage);
    }
  }

  function isImprovedValueRealistic(
    value: number,
    criterion: ICriterion,
    usePercentage: boolean
  ): boolean {
    const pvf = pvfs[criterion.id];
    const best = getBest(pvf, usePercentage);
    if (pvf.direction === 'increasing') {
      return value <= best;
    } else {
      return value >= best;
    }
  }

  return (
    <Table>
      <TableBody>{!_.isEmpty(pvfs) ? getRows() : <></>}</TableBody>
    </Table>
  );
}
