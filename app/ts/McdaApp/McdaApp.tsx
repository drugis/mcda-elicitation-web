import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core';
import 'c3/c3.css';
import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../InlineHelp/lexicon';
import ManualInputWrapper from './ManualInput/ManualInputWrapper';
import NavigationBar from './NavigationBar/NavigationBar';
import Workspace from './Workspace/Workspace';
import Workspaces from './Workspaces/Workspaces';

export const useStyles = makeStyles({
  alert: {
    color: 'red'
  },
  uncertain: {
    padding: '0.1rem',
    color: 'grey',
    fontSize: '0.7rem',
    background: '#cacaca',
    borderRadius: '2px',
    display: 'inline-block',
    textAlign: 'center',
    width: '5rem',
    margin: '0 auto 0 auto'
  },
  textCenter: {
    textAlign: 'center'
  }
});

export default function McdaApp(): JSX.Element {
  document.title = 'Workspaces';

  const theme = createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {
          border: '1px solid lightgray'
        },
        head: {
          background: 'whitesmoke'
        }
      },
      MuiTab: {
        textColorInherit: {
          '&$disabled': {
            opacity: 0.3
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <ErrorContextProviderComponent>
        <ErrorHandler>
          <HelpContextProviderComponent
            lexicon={lexicon}
            host={'@MCDA_HOST'}
            path="/manual.html"
          >
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
                <Route path="/" component={Workspaces} />
              </Switch>
            </BrowserRouter>
          </HelpContextProviderComponent>
        </ErrorHandler>
      </ErrorContextProviderComponent>
    </ThemeProvider>
  );
}
