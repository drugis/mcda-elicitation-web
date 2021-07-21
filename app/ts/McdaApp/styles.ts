import {createTheme} from '@material-ui/core';
import {CSSProperties} from 'react';

export const alertStyle: CSSProperties = {color: 'red'};

export const uncertainStyle: CSSProperties = {
  padding: '0.1rem',
  color: 'grey',
  fontSize: '0.7rem',
  background: '#cacaca',
  borderRadius: '2px',
  display: 'inline-block',
  textAlign: 'center',
  width: '5rem',
  margin: '0 auto 0 auto'
};

export const textCenterStyle: CSSProperties = {textAlign: 'center'};

export const mcdaTheme = createTheme({
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
