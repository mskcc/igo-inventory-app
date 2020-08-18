import React from 'react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Table from './Table';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      logo: '#319ae8',
      light: '#8FC7E8',
      main: '#007CBA',
      dark: '#006098',
    },
    secondary: {
      light: '#F6C65B',
      main: '#DF4602',
      dark: '#C24D00',
    },

    textSecondary: '#e0e0e0',
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Header />
        <Switch>
          <Route path='/' component={Table} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
