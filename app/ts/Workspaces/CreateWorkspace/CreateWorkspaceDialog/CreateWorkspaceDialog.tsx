import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Radio,
  RadioGroup,
  Select
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import {CreateWorkspaceContext} from '../CreateWorkspaceContext';
import IWorkspaceExample from '../IWorkspaceExample';
import {TWorkspaceCreateMethod} from '../TWorkspaceCreateMethod';

export default function CreateWorkspaceDialog({
  isDialogOpen,
  closeDialog
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}): JSX.Element {
  const {
    examples,
    tutorials,
    method,
    setMethod,
    selectedExample,
    selectedTutorial,
    setSelectedExample,
    setSelectedTutorial,
    setUploadedFile
  } = useContext(CreateWorkspaceContext);

  function handleMethodChanged(event: ChangeEvent<HTMLInputElement>): void {
    setMethod(event.target.value as TWorkspaceCreateMethod); //FIXME ?
  }

  function renderWorkspaceInput(): JSX.Element {
    if (method === 'example') {
      return (
        <Select
          native
          id="example-workspace-selector"
          value={selectedExample.title}
          onChange={handleExampleChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions workspaceExamples={examples} />
        </Select>
      );
    } else if (method === 'tutorial') {
      return (
        <Select
          native
          id="tutorial-workspace-selector"
          value={selectedTutorial.title}
          onChange={handleTutorialChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions workspaceExamples={tutorials} />
        </Select>
      );
    } else if (method === 'local') {
      return <input type="file" onChange={handleLocalFile} />;
    } else {
      return <></>;
    }
  }

  function handleExampleChanged(event: ChangeEvent<{value: string}>): void {
    setSelectedExample(_.find(examples, ['title', event.target.value]));
  }

  function handleTutorialChanged(event: ChangeEvent<{value: string}>): void {
    setSelectedTutorial(_.find(tutorials, ['title', event.target.value]));
  }

  function handleLocalFile(event: ChangeEvent<HTMLInputElement>): void {
    setUploadedFile(event.target.files[0]);
  }

  function SelectOptions({
    workspaceExamples
  }: {
    workspaceExamples: IWorkspaceExample[];
  }): JSX.Element {
    return (
      <>
        {_.map(
          workspaceExamples,
          (workspaceExample: IWorkspaceExample): JSX.Element => (
            <option value={workspaceExample.title} key={workspaceExample.title}>
              {workspaceExample.title}
            </option>
          )
        )}
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
        Add workspace
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            Choose creation method
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              name="percentages-radio"
              value={method}
              onChange={handleMethodChanged}
            >
              <label id="example-workspace-radio">
                <Radio value="example" /> Select example workspace
              </label>
              <label id="tutorial-workspace-radio">
                <Radio value="tutorial" /> Select tutorial workspace
              </label>
              <label id="upload-workspace-radio">
                <Radio value="local" /> Upload file
              </label>
              <label id="manual-workspace-radio">
                <Radio value="manual" /> Create new workspace
              </label>
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            {renderWorkspaceInput()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="add-workspace-button"
          color="primary"
          onClick={() => {}}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
