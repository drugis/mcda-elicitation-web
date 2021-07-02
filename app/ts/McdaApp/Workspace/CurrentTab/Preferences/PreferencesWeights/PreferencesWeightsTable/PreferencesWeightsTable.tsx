import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import ICriterion from '@shared/interface/ICriterion';
import CriterionTooltip from 'app/ts/CriterionTooltip/CriterionTooltip';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import significantDigits from 'app/ts/util/significantDigits';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {EquivalentChangeContext} from '../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {
  getEquivalentRangeValue,
  getEquivalentValue
} from '../../EquivalentChange/equivalentChangeUtil';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import {buildImportance} from './PreferencesWeightsTableUtil';

export default function PreferencesWeightsTable() {
  const {
    equivalentChangeType,
    referenceCriterion,
    referenceValueFrom,
    referenceValueTo
  } = useContext(EquivalentChangeContext);
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {filteredCriteria, observedRanges} = useContext(
    CurrentSubproblemContext
  );
  const [importances, setImportances] = useState<Record<string, string>>(
    buildImportance(filteredCriteria, currentScenario.state.prefs)
  );

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

  function EquivalentChange({criterion}: {criterion: ICriterion}) {
    switch (equivalentChangeType) {
      case 'amount':
        return <EquivalentValueChange criterion={criterion} />;
      case 'range':
        return <EquivalentRangeChange criterion={criterion} />;
    }
  }

  function EquivalentValueChange({
    criterion
  }: {
    criterion: ICriterion;
  }): JSX.Element {
    const {referenceWeight, partOfInterval} = useContext(
      EquivalentChangeContext
    );
    const otherWeight = currentScenario.state.weights.mean[criterion.id];
    const usePercentage = getUsePercentage(criterion.dataSources[0]);

    return (
      <span>
        {getEquivalentValue(
          usePercentage,
          otherWeight,
          pvfs[criterion.id],
          partOfInterval,
          referenceWeight
        )}
      </span>
    );
  }

  function EquivalentRangeChange({
    criterion
  }: {
    criterion: ICriterion;
  }): JSX.Element {
    const {referenceWeight, partOfInterval} = useContext(
      EquivalentChangeContext
    );
    const otherWeight = currentScenario.state.weights.mean[criterion.id];
    const usePercentage = getUsePercentage(criterion.dataSources[0]);

    if (criterion.id === referenceCriterion.id) {
      const usePercentage = getUsePercentage(criterion.dataSources[0]);
      return (
        <span>
          {getPercentifiedValue(referenceValueFrom, usePercentage)} to{' '}
          {getPercentifiedValue(referenceValueTo, usePercentage)}
        </span>
      );
    } else {
      return (
        <span>
          {getWorst(pvfs[criterion.id], usePercentage)} to{' '}
          {getEquivalentRangeValue(
            usePercentage,
            otherWeight,
            pvfs[criterion.id],
            partOfInterval,
            referenceWeight
          )}
        </span>
      );
    }
  }

  function renderCriterionPreferences(): JSX.Element[] {
    return _.map(filteredCriteria, (criterion: ICriterion): JSX.Element => {
      const unit = criterion.dataSources[0].unitOfMeasurement;
      const usePercentage = getUsePercentage(criterion.dataSources[0]);
      return (
        <TableRow key={criterion.id}>
          <TableCell>
            <CriterionTooltip
              title={criterion.title}
              description={criterion.description}
            />
          </TableCell>
          <TableCell id={`unit-${criterion.id}`}>
            {getUnitLabel(unit, showPercentages)}
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
          <ShowIf condition={canShowEquivalentChanges}>
            <TableCell id={`equivalent-change-${criterion.id}`}>
              <EquivalentChange criterion={criterion} />
            </TableCell>
          </ShowIf>
        </TableRow>
      );
    });
  }

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
        <ShowIf condition={!_.isEmpty(pvfs)}>
          {renderCriterionPreferences()}
        </ShowIf>
      </TableBody>
    </Table>
  );
}
