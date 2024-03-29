import {ThemeProvider} from '@material-ui/core';
import 'c3/c3.css';
import {HelpContextProviderComponent} from 'help-popup';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../util/SharedComponents/InlineHelp/lexicon';
import ManualInputWrapper from './ManualInput/ManualInputWrapper';
import NavigationBar from './NavigationBar/NavigationBar';
import PageNotFound from './PageNotFound/PageNotFound';
import {mcdaTheme} from './styles';
import {UserContextProviderComponent} from './UserContext/UserContext';
import Workspace from './Workspace/Workspace';
import Workspaces from './Workspaces/Workspaces';

export default function McdaApp(): JSX.Element {
  return (
    <ThemeProvider theme={mcdaTheme}>
      <ErrorContextProviderComponent>
        <ErrorHandler>
          <HelpContextProviderComponent
            lexicon={lexicon}
            host={'@MCDA_HOST'}
            path="/manual.html"
          >
            <UserContextProviderComponent>
              <BrowserRouter>
                <NavigationBar />
                <Switch>
                  <Route
                    path="/manual-input/:inProgressId"
                    component={ManualInputWrapper}
                  />
                  <Route
                    path="/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId/:selectedTab"
                    component={Workspace}
                  />
                  <Route path="/" exact component={Workspaces} />
                  <Route path="*" component={PageNotFound} />
                </Switch>
              </BrowserRouter>
            </UserContextProviderComponent>
          </HelpContextProviderComponent>
        </ErrorHandler>
      </ErrorContextProviderComponent>
    </ThemeProvider>
  );
}
