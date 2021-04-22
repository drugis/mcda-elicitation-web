import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Select,
  Typography
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import DisplayErrors from 'app/ts/util/DisplayErrors';
import _ from 'lodash';
import React, {ChangeEvent, useCallback, useContext} from 'react';
import IWorkspaceExample from '../../../../../shared/interface/Workspace/IWorkspaceExample';
import {CreateWorkspaceContext} from '../CreateWorkspaceContext';
import {TWorkspaceCreationMethod} from '../TWorkspaceCreationMethod';

export default function CreateWorkspaceDialog({
  closeDialog
}: {
  closeDialog: () => void;
}): JSX.Element {
  const {
    examples,
    tutorials,
    method,
    setMethod,
    selectedProblem,
    setSelectedProblem,
    setUploadedFile,
    addWorkspaceCallback,
    validationErrors,
    setValidationErrors
  } = useContext(CreateWorkspaceContext);

  const handleMethodChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const method: TWorkspaceCreationMethod = event.target
        .value as TWorkspaceCreationMethod;
      setMethod(method);
      if (method === 'example') {
        setSelectedProblem(examples[0]);
        setValidationErrors([]);
      } else if (method === 'tutorial') {
        setSelectedProblem(tutorials[0]);
        setValidationErrors([]);
      } else if (method === 'upload') {
        setValidationErrors(['No file selected']);
      } else {
        setValidationErrors([]);
      }
    },
    [setMethod, setSelectedProblem, examples, tutorials, setValidationErrors]
  );

  const handleExampleChanged = useCallback(
    (event: ChangeEvent<{value: string}>): void => {
      setSelectedProblem(_.find(examples, ['title', event.target.value]));
    },
    [setSelectedProblem, examples]
  );

  const handleTutorialChanged = useCallback(
    (event: ChangeEvent<{value: string}>): void => {
      setSelectedProblem(_.find(tutorials, ['title', event.target.value]));
    },
    [setSelectedProblem, tutorials]
  );

  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setUploadedFile(event.target.files[0]);
    },
    [setUploadedFile]
  );

  const handleAddButtonClick = useCallback((): void => {
    closeDialog();
    addWorkspaceCallback();
  }, [closeDialog, addWorkspaceCallback]);

  const renderWorkspaceInput = useCallback((): JSX.Element => {
    switch (method) {
      case 'example':
        return (
          <SelectProblemFromList
            id={'example-workspace-selector'}
            selectedProblemTitle={selectedProblem.title}
            changeHandler={handleExampleChanged}
            problemList={examples}
          />
        );
      case 'tutorial':
        return (
          <SelectProblemFromList
            id={'tutorial-workspace-selector'}
            selectedProblemTitle={selectedProblem.title}
            changeHandler={handleTutorialChanged}
            problemList={tutorials}
          />
        );
      case 'upload':
        return (
          <input
            type="file"
            id="workspace-upload-input"
            onChange={handleFileUpload}
          />
        );
      case 'manual':
        return <></>;
    }
  }, [
    method,
    selectedProblem?.title,
    handleExampleChanged,
    examples,
    handleTutorialChanged,
    tutorials,
    handleFileUpload
  ]);

  return (
    <Dialog open={true} onClose={closeDialog} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
        Add workspace
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography>Choose creation method</Typography>
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              name="percentages-radio"
              value={method}
              onChange={handleMethodChanged}
            >
              <FormControlLabel
                id="example-workspace-radio"
                value="example"
                control={<Radio />}
                label="Select example workspace"
              />
              <FormControlLabel
                id="tutorial-workspace-radio"
                value="tutorial"
                control={<Radio />}
                label="Select tutorial workspace"
              />
              <FormControlLabel
                id="upload-workspace-radio"
                value="upload"
                control={<Radio />}
                label=" Upload file"
              />
              <FormControlLabel
                id="manual-workspace-radio"
                value="manual"
                control={<Radio />}
                label="Create new workspace"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            {selectedProblem ? renderWorkspaceInput() : <></>}
          </Grid>
          <Grid item xs={3}>
            {!_.isEmpty(validationErrors) ? (
              <Typography>Invalid upload:</Typography>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={9}>
            <DisplayErrors
              identifier="invalid-schema"
              errors={validationErrors}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="add-workspace-button"
          color="primary"
          onClick={handleAddButtonClick}
          variant="contained"
          disabled={!_.isEmpty(validationErrors)}
          size="small"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const SelectOptions = ({
  examples
}: {
  examples: IWorkspaceExample[];
}): JSX.Element => {
  return (
    <>
      {_.map(
        examples,
        (example: IWorkspaceExample): JSX.Element => (
          <option value={example.title} key={example.title}>
            {example.title}
          </option>
        )
      )}
    </>
  );
};

function SelectProblemFromList({
  id,
  selectedProblemTitle,
  changeHandler,
  problemList
}: {
  id: string;
  selectedProblemTitle: string;
  changeHandler: (event: ChangeEvent<{value: string}>) => void;
  problemList: IWorkspaceExample[];
}): JSX.Element {
  return (
    <Select
      native
      id={id}
      value={selectedProblemTitle}
      onChange={changeHandler}
      style={{minWidth: 220}}
    >
      <SelectOptions examples={problemList} />
    </Select>
  );
}
