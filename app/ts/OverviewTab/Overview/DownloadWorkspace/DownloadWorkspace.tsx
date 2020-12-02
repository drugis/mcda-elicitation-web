import {Button, Grid} from '@material-ui/core';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import _ from 'lodash';
import IProblem from '@shared/interface/Problem/IProblem';

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

    // let js simulate mouse click
    link.click = function () {
      var evt = this.ownerDocument.createEvent('MouseEvents');
      evt.initMouseEvent(
        'click',
        true,
        true,
        this.ownerDocument.defaultView,
        1,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      this.dispatchEvent(evt);
    };
    link.click();
  }

  return (
    <Grid item xs={12}>
      <Button
        onClick={downloadWorkspace}
        variant={'contained'}
        color={'primary'}
      >
        Download workspace
      </Button>
    </Grid>
  );
}
