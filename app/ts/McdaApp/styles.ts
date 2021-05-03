import {createMuiTheme, makeStyles} from '@material-ui/core';

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

export const mcdaTheme = createMuiTheme({
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
