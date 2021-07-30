import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import PreferencesWeightsTableRow from './PreferencesWeightsTableRow';
import {buildImportance} from './PreferencesWeightsTableUtil';

export default function PreferencesWeightsTable() {
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {filteredCriteria, observedRanges} = useContext(
    CurrentSubproblemContext
  );
  const [importances, setImportances] = useState<Record<string, string>>(
    buildImportance(filteredCriteria, currentScenario.state.prefs)
  );
  const rankings: Record<string, number> = useMemo(() => {
    const weightRankCriterionIds = _(currentScenario.state.weights.mean)
      .map((weight, criterionId) => {
        return {weight, criterionId};
      })
      .sortBy((val) => {
        return -val.weight;
      })
      .map((value, index) => {
        return {...value, rank: index + 1};
      })
      .keyBy('criterionId')
      .value();
    return _.mapValues(weightRankCriterionIds, (current) => {
      const sameWeightOther = _.find(weightRankCriterionIds, (other) => {
        return other.weight === current.weight;
      });
      if (sameWeightOther) {
        return Math.min(sameWeightOther.rank, current.rank);
      } else {
        return current.rank;
      }
    });
  }, [currentScenario.state.weights.mean]);

  const areAllPvfsLinear = _.every(pvfs, ['type', 'linear']);
  const canShowEquivalentChanges =
    areAllPvfsLinear &&
    currentScenario.state.weights &&
    !_.isEmpty(observedRanges);

  useEffect(() => {
    setImportances(
      buildImportance(filteredCriteria, currentScenario.state.prefs)
    );
  }, [currentScenario, filteredCriteria, pvfs]);

  return (
    <Table id="perferences-weights-table">
      <TableHead>
        <TableRow>
          <TableCell>
            <InlineHelp helpId="criterion">Criterion</InlineHelp>
          </TableCell>
          <TableCell>
            <InlineHelp helpId="unit-of-measurement">Unit</InlineHelp>
          </TableCell>
          <TableCell>Worst</TableCell>
          <TableCell>Best</TableCell>
          <TableCell>
            <InlineHelp helpId="importance">Importance</InlineHelp>
          </TableCell>
          <TableCell>
            <InlineHelp helpId="representative-weights">Weight</InlineHelp>
          </TableCell>
          <TableCell>Ranking</TableCell>
          <ShowIf condition={canShowEquivalentChanges}>
            <TableCell>
              <InlineHelp helpId="equivalent-change-basis">
                Equivalent change
              </InlineHelp>
            </TableCell>
          </ShowIf>
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(
          filteredCriteria,
          (criterion: ICriterion): JSX.Element => (
            <PreferencesWeightsTableRow
              key={criterion.id}
              criterion={criterion}
              importance={importances[criterion.id]}
              ranking={rankings[criterion.id]}
            />
          )
        )}
      </TableBody>
    </Table>
  );
}
