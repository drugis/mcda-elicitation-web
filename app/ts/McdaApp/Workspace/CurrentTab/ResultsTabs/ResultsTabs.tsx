import DeterministicResults from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResults/DeterministicResults';
import SmaaResults from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/SmaaTab/SmaaResults/SmaaResults';
import {LegendContextProviderComponent} from 'app/ts/PlotWithButtons/Legend/LegendContext';
import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';

export default function ResultsTabs() {
  const {path} = useRouteMatch();
  const noParenthesesPath = path.slice(0, path.indexOf('('));
  return (
    <LegendContextProviderComponent canEdit={true}>
      {/* FIXME canEdit */}
      <Switch>
        <Route
          exact
          path={noParenthesesPath + '(deterministic-results)'}
          component={DeterministicResults}
        />
        <Route
          exact
          path={noParenthesesPath + '(smaa-results)'}
          component={SmaaResults}
        />
      </Switch>
    </LegendContextProviderComponent>
  );
}
