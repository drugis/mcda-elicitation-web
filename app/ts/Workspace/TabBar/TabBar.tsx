import {AppBar, Tab, Tabs, Tooltip, Typography} from '@material-ui/core';
import {CurrentScenarioContext} from 'app/ts/Scenarios/CurrentScenarioContext/CurrentScenarioContext';
import {TTab} from 'app/ts/Workspace/TabBar/TTab';
import React, {useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {CurrentSubproblemContext} from '../SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import {
  findCriterionWithTooManyDataSources,
  findMissingPvfs,
  findMissingValue
} from './TabBarUtil';

export default function TabBar() {
  const {selectedTab} = useParams<{selectedTab: TTab}>();
  const activeTab = selectedTab || 'overview';

  const {filteredCriteria, filteredWorkspace} = useContext(
    CurrentSubproblemContext
  );
  const {pvfs} = useContext(CurrentScenarioContext);

  const hasTooManyCriteria = filteredCriteria.length > 12;
  const hasTooManyDataSources = findCriterionWithTooManyDataSources(
    filteredCriteria
  );
  const hasMissingValues = findMissingValue(filteredWorkspace);
  const hasMissingPvfs = findMissingPvfs(pvfs, filteredCriteria);

  const arePreferencesDisabled =
    hasTooManyCriteria || hasMissingValues || hasTooManyDataSources;

  const areResultsDisabled = arePreferencesDisabled || hasMissingPvfs;

  function preferencesTabTooltip(): string {
    if (hasTooManyCriteria) {
      return 'Cannot elicit preferences because the effects table contains more than 12 criteria.';
    } else if (hasTooManyDataSources) {
      return 'Cannot perform analysis because the problem has multiple datasources per criterion.';
    } else if (hasMissingValues) {
      return 'Cannot elicit preferences because the effects table contains missing values.';
    } else return '';
  }

  function resultsTabTooltip(): string {
    const preferencesTooltip = preferencesTabTooltip();
    if (preferencesTooltip !== '') {
      return preferencesTooltip;
    } else if (hasMissingPvfs) {
      return 'Cannot perform analysis because not all partial value functions are set.';
    } else return '';
  }

  return (
    <AppBar position="static" color="default" style={{marginBottom: '1em'}}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={activeTab}
        indicatorColor="primary"
      >
        <Tab
          label="Overview"
          id="overview-tab"
          value="overview"
          component={Link}
          to="overview"
        />
        <Tab
          label="Problem definition"
          id="problem-definition-tab"
          value="problem"
          component={Link}
          to="problem"
        />
        <Tab
          style={{pointerEvents: 'auto'}}
          label={
            <Tooltip title={preferencesTabTooltip()}>
              <span>Preferences</span>
            </Tooltip>
          }
          id="preferences-tab"
          value="preferences"
          component={arePreferencesDisabled ? Typography : Link}
          to="preferences"
          disabled={arePreferencesDisabled}
        />
        <Tab
          style={{pointerEvents: 'auto'}}
          label={
            <Tooltip title={resultsTabTooltip()}>
              <span>Deterministic results</span>
            </Tooltip>
          }
          id="deterministic-results-tab"
          value="deterministic-results"
          component={areResultsDisabled ? Typography : Link}
          to="deterministic-results"
          disabled={areResultsDisabled}
        />
        <Tab
          style={{pointerEvents: 'auto'}}
          label={
            <Tooltip title={resultsTabTooltip()}>
              <span>SMAA results</span>
            </Tooltip>
          }
          id="smaa-results-tab"
          value="smaa-results"
          component={areResultsDisabled ? Typography : Link}
          to="smaa-results"
          disabled={areResultsDisabled}
        />
      </Tabs>
    </AppBar>
  );
}
