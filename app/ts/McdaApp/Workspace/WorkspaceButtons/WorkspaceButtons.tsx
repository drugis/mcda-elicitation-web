import {ButtonGroup} from '@material-ui/core';
import DownloadWorkspace from '../CurrentTab/Overview/DownloadWorkspace/DownloadWorkspace';
import EditTitleButton from '../EditTitleButton/EditTitleButton';
import WorkspaceSettings from '../WorkspaceSettings/WorkspaceSettings';

export default function WorkspaceButtons(): JSX.Element {
  return (
    <ButtonGroup size={'small'}>
      <EditTitleButton />
      <DownloadWorkspace />
      <WorkspaceSettings />
    </ButtonGroup>
  );
}
