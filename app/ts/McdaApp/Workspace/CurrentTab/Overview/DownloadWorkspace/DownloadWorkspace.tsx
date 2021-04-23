import {Button, Grid} from '@material-ui/core';
import IProblem from '@shared/interface/Problem/IProblem';
import _ from 'lodash';
import React, {useContext} from 'react';
import {WorkspaceContext} from '../../../WorkspaceContext/WorkspaceContext';

export default function DownloadWorkspace() {
  const {workspace, oldProblem} = useContext(WorkspaceContext);

  function downloadWorkspace() {
    let link: HTMLAnchorElement = document.createElement('a');
    link.download = 'problem' + workspace.properties.id + '.json';
    const problemWithTitle: IProblem = _.merge(
      {},
      _.omit(oldProblem, 'preferences'),
      {
        title: workspace.properties.title
      }
    );
    const data: string =
      'text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(problemWithTitle, null, 2));
    link.href = 'data:' + data;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Grid item xs={12}>
      <Button
        onClick={downloadWorkspace}
        variant={'contained'}
        color={'primary'}
        size="small"
      >
        Download workspace
      </Button>
    </Grid>
  );
}
