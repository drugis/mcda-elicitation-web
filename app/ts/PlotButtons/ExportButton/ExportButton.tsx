import {Button} from '@material-ui/core';
// @ts-ignore
import {downloadPng} from 'svg-crowbar';

export default function ExportButton({plotId}: {plotId: string}): JSX.Element {
  function handleClick() {
    downloadPng(document.querySelector(`#${plotId} > svg`), plotId, {
      downloadPNGOptions: {scale: 4}
    });
  }

  return (
    <Button
      onClick={handleClick}
      id={`export-button-${plotId}`}
      color="primary"
      variant="contained"
      size="small"
      style={{width: '55px'}}
    >
      Export
    </Button>
  );
}
