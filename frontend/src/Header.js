import React from 'react';
import { Avatar, AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';

import logo from './logo.png';

function Header() {
  const classes = useStyles();

  return (
    <AppBar position='static' title={logo} className={classes.header}>
      <Toolbar>
        <Avatar alt='mskcc logo' src={logo} className={classes.avatar} />

        <Typography color='inherit' variant='h6' className={classes.title}>
          IGO Run Planner
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
