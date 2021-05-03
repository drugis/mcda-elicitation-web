import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {createMuiTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, {CSSProperties, ReactNode} from 'react';

const theme = createMuiTheme();
const closeButtonStyle: CSSProperties = {
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500]
};

export default function DialogTitleWithCross({
  children,
  onClose,
  id
}: {
  children: ReactNode;
  onClose: () => void;
  id: string;
}) {
  return (
    <MuiDialogTitle disableTypography id={id}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          id="close-modal-button"
          aria-label="close"
          style={closeButtonStyle}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
}
