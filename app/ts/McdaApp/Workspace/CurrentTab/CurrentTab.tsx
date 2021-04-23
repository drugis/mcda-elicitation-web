import Preferences from 'app/ts/McdaApp/Workspace/ScenariosContext/Preferences/Preferences';
import Subproblem from 'app/ts/McdaApp/Workspace/CurrentTab/Subproblem/Subproblem';
import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';
import ResultsTabs from './ResultsTabs/ResultsTabs';
import Overview from './Overview/Overview';

export default function CurrentTab(): JSX.Element {
  const {path} = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path + '(overview)'} component={Overview} />
      <Route exact path={path + '(problem)'} component={Subproblem} />
      <Route exact path={path + '(preferences)'} component={Preferences} />
      <Route
        exact
        path={path + '(deterministic-results|smaa-results)'}
        component={ResultsTabs}
      />
    </Switch>
  );
}
