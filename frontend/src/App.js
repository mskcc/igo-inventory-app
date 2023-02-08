import React from 'react';
import { Provider } from 'react-redux';
import { store } from './slices/index';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Table from './Table';
import OtherTable from './OtherTable';
import { SITE_HOME, OTHER_INVENTORY } from './configs/config';

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
      <Provider store={store}>
        <Router>
          <Header />
          <Switch>
            <Route exact path={`${OTHER_INVENTORY}`} component={OtherTable} />
          </Switch>
          <Switch>
            <Route exact path={`${SITE_HOME}`} component={Table} />
          </Switch>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
