import {Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {getWorst} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import {getImprovedValue, isImprovedValueRealistic} from '../tradeOffUtil';

export default function TradeOffTable(): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const {otherCriteria: criteria, partOfInterval, referenceWeight} = useContext(
    TradeOffContext
  );
  const {pvfs, currentScenario, areAllPvfsSet} = useContext(
    CurrentScenarioContext
  );

  function getRows(): JSX.Element[] {
    return _.map(
      criteria,
      (criterion: ICriterion): JSX.Element => {
        const usePercentage = getUsePercentage(criterion.dataSources[0]);
        const improvedValue = getImprovedValue(
          usePercentage,
          currentScenario.state.weights.mean[criterion.id],
          pvfs[criterion.id],
          partOfInterval,
          referenceWeight
        );
        return (
          <TableRow key={criterion.id}>
            <TableCell id={`trade-off-statement-${criterion.id}`}>
              {`Changing ${criterion.title} from ${getWorst(
                pvfs[criterion.id],
                usePercentage
              )} to ${improvedValue}`}
            </TableCell>
            <TableCell id={`trade-off-warning-${criterion.id}`}>
              {isImprovedValueRealistic(
                improvedValue,
                usePercentage,
                pvfs[criterion.id]
              )
                ? ''
                : `This value is unrealistic given the criterion's range`}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  return (
    <Table>
      <TableBody>
        {areAllPvfsSet && partOfInterval ? getRows() : <></>}
      </TableBody>
    </Table>
  );
}
