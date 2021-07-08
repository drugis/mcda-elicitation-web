import {
  AppBar,
  IconButton,
  Link as LinkHref,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GroupIcon from '@material-ui/icons/Group';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import IUser from '@shared/interface/User/IUser';
import Cookies from 'js-cookie';
import React, {CSSProperties} from 'react';
import {Link} from 'react-router-dom';

const menuItemStyle: CSSProperties = {
  textDecoration: 'none',
  color: '#FFFFFF',
  marginRight: 16,
  marginLeft: 4
};

function ElevationScroll({children}: {children: any}) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

export default function NavigationBar(): JSX.Element {
  const user: IUser = JSON.parse(Cookies.get('LOGGED-IN-USER'));

  function handleLogOut(): void {
    Cookies.remove('LOGGED-IN-USER');
    window.location.assign('/logout');
  }

  return (
    <>
      <ElevationScroll>
        <AppBar style={{backgroundColor: '#333'}}>
          <Toolbar variant="dense">
            <Typography
              id="logo"
              variant="h6"
              noWrap
              component={LinkHref}
              href="/"
              style={menuItemStyle}
            >
              mcda.drugis.org
            </Typography>
            <div style={{flexGrow: 1}} />
            <GroupIcon style={{fill: '#FFFFFF'}} />
            <LinkHref href="http://drugis.org/services/index" target="_blank">
              <Typography variant="h6" noWrap style={menuItemStyle}>
                Services
              </Typography>
            </LinkHref>
            <MenuBookIcon style={{fill: '#FFFFFF'}} />
            <LinkHref id="manual-link" href="/manual.html" target="_blank">
              <Typography variant="h6" noWrap style={menuItemStyle}>
                Manual
              </Typography>
            </LinkHref>
            <Typography
              id="user-name"
              variant="h6"
              noWrap
              style={menuItemStyle}
              component={Link}
              to="/"
            >
              {`${user.firstname} ${user.lastname}`}
            </Typography>
            <Tooltip title="Log out">
              <IconButton id="logout-button" onClick={handleLogOut}>
                <ExitToAppIcon style={{fill: '#FFFFFF'}} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
}
