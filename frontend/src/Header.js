import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setActivePage } from './slices/appSlice';
import { Avatar, AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import logo from './logo.png';
import { SITE_HOME, OTHER_INVENTORY } from './configs/config';

function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const activePage = useSelector(state => state.app.activePage);
  const [homeActive, setHomeActive] = useState('active');
  const [otherActive, setOtherActive] = useState('');

  useEffect(() => {
    if (location.pathname.includes('/otherinventory') || activePage === 'other') {
      setHomeActive('');
      setOtherActive('active');
    } else {
      setHomeActive('active');
      setOtherActive('');
    }
  }, [activePage, location]);

  const handleMenuClick = (page) => {
    dispatch(setActivePage(page));
    let url = '';
    if (page === 'other') {
      url = `${OTHER_INVENTORY}`;
    } else {
      url = `${SITE_HOME}`;
    }
    history.push(url);
  }

  return (
    <AppBar position='static' title={logo} className={classes.header}>
      <Toolbar>
        <Avatar alt='mskcc logo' src={logo} className={classes.avatar} />

        <Typography color='inherit' variant='h6' className={classes.title}>
          <div className={`header-link ${homeActive}`} onClick={() => handleMenuClick('home')}>
            IGO Inventory
          </div>
        </Typography>
        <Typography color='inherit' variant='h6' className={classes.title}>
          <div className={`header-link ${otherActive}`} onClick={() => handleMenuClick('other')}>
            Other Inventory
          </div>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(3),
  },
  header: {
    backgroundColor: theme.palette.primary.logo,
    color: 'white',
    textAlign: 'center',
  },
  title: {
    marginRight: theme.spacing(3),
  },
}));

export default Header;
