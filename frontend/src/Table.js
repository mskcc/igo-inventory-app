import React, { useState, useEffect } from 'react';
import { getRuns, saveTable } from './services/services';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button } from '@material-ui/core';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100vw',
    margin: '0 auto',
    overflow: 'auto',
  },
  toolbar: {
    margin: theme.spacing(2),
    display: 'flex',
    gap: '2em',
  },
}));
function HomePage() {
  const classes = useStyles();
  const hotTableComponent = React.createRef();
  const [runs, setRuns] = useState({
    runs: [],
  });
  const [filteredInventory, setFilteredRuns] = useState({
    filteredRuns: [],
  });
  const [columns, setColumns] = useState({
    columns: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [sorting, setSorting] = React.useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    let searchTerm = event.target.value;
    if (searchTerm == '') return setFilteredRuns(runs);

    var searchResults = [];
    searchResults = runs.filter((el) => {
      return Object.values(el).join().toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (searchResults.length == 0) {
      setSorting(false);
      setFilteredRuns([[]]);
    } else {
      setFilteredRuns(searchResults);
    }
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleExport = () => {
    exportExcel(filteredInventory, columns);
  };

  const handleSave = () => {
    saveTable(JSON.stringify(hotTableComponent.current.hotInstance.getSourceData()));
  };

  async function handleRuns() {
    getRuns().then((result) => {
      console.log(result);

      setRuns(result.rows);
      setFilteredRuns(result.rows);
      setColumns(result.columns);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    handleRuns();
  }, []);

  return (
    <div className={classes.container}>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <div className={classes.toolbar}>
          <TextField id='search' label='Search' variant='outlined' value={searchTerm} onChange={handleSearch} />
          <TextField id='username' label='MSK Username' variant='outlined' value={username} onChange={handleUsername} />
          <Button id='gridExport' onClick={handleExport} color='primary' variant='contained' type='submit'>
            Export Excel
          </Button>
          <Button id='save' onClick={handleSave} color='secondary' variant='contained' type='submit'>
            Save
          </Button>
        </div>
        <HotTable
          ref={hotTableComponent}
          data={filteredInventory}
          search='true'
          colHeaders={columns ? Object.keys(columns).map((el) => columns[el].columnHeader) : ''}
          columns={columns}
          filters='true'
          columnSorting={sorting}
          manualColumnResize={true}
          licenseKey='non-commercial-and-evaluation'
          rowHeaders={true}
          stretchH='all'
          minSpareRows='20'
        />
      </LoadingOverlay>
    </div>
  );
}

export default HomePage;
