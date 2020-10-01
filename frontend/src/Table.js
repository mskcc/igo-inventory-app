import React, { useState, useEffect } from 'react';
import { getRuns, saveTable, deleteItems, removeOneFromInventory, deleteInventory } from './services/services';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';
import { SHEET_PWS } from './configs/config';

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
  snackbar: {
    top: '30%',
  },
  alert: {
    padding: '2em',
    fontSize: '1.7em',
    '& .MuiAlert-icon': {
      fontSize: '1.7em',
    },
  },
  textField: { minWidth: 310 },
}));
function HomePage() {
  const classes = useStyles();
  const hotTableComponent = React.createRef();
  const [runs, setInventory] = useState({
    runs: [],
  });
  const [filteredInventory, setFilteredInventory] = useState({
    filteredInventory: [],
  });
  const [columns, setColumns] = useState({
    columns: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [skus, setSkus] = React.useState('');
  const [takeOut, setTakeOut] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [sorting, setSorting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState({ message: '', severity: 'success' });

  const debouncedTakeOut = useDebounce(takeOut, 500);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    let searchTerm = event.target.value;
    if (searchTerm == '') return setFilteredInventory(runs);

    let searchResults = [];
    searchResults = runs.filter((el) => {
      return Object.values(el).join().toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (searchResults.length == 0) {
      setSorting(false);
      setFilteredInventory([[]]);
    } else {
      setFilteredInventory(searchResults);
    }
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);

    if (SHEET_PWS.includes(event.target.value.toUpperCase())) {
      console.log('admin');
      hotTableComponent.current.hotInstance.updateSettings({
        cells: function (row, col) {
          var cellProperties = {};

          cellProperties.readOnly = false;

          return cellProperties;
        },
      });
    } else
      hotTableComponent.current.hotInstance.updateSettings({
        cells: function (row, col) {
          var cellProperties = {};

          cellProperties.readOnly = columns[col].readOnly;

          return cellProperties;
        },
      });
  };

  const handleSkus = (rows) => {
    let skus = [];
    rows.map((item) => {
      if (!!item.sku) {
        skus.push(item.sku.toUpperCase());
      }
    });
    setSkus(skus);
  };

  const handleExport = () => {
    exportExcel(filteredInventory, columns);
  };

  const handleSave = () => {
    saveTable(JSON.stringify(hotTableComponent.current.hotInstance.getSourceData()))
      .then((result) => {
        setFilteredInventory(result.rows);
        handleSkus(result.rows);
        setOpen(true);
        setMessage({ message: 'Saved', severity: 'success' });
      })
      .catch((error) => {
        setOpen(true);
        setMessage({ message: 'Error: ' + error, severity: 'error' });
      });
    // }
  };

  const handleDelete = () => {
    let selected = hotTableComponent.current.hotInstance.getSelected();
    if (selected) {
      let selectedItems = [];

      for (let i = 0; i < selected.length; i += 1) {
        console.log(item);

        let item = selected[i];

        let itemToDelete = filteredInventory[item[0]];
        if (itemToDelete._id) {
          selectedItems.push(itemToDelete.sku);
        }
      }

      deleteItems(selectedItems).then((result) => {
        setFilteredInventory(result.rows);
        handleSkus(result.rows);
      });
    }
  };

  async function handleInventory() {
    getRuns().then((result) => {
      setInventory(result.rows);
      setFilteredInventory(result.rows);
      setColumns(result.columns);
      setIsLoading(false);
      handleSkus(result.rows);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    handleInventory();
  }, []);

  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedTakeOut) {
        let inputItem = debouncedTakeOut.toUpperCase();

        if (skus.includes(inputItem)) {
          let itemToDecrease = filteredInventory.filter((element) => {
            return element.sku && element.sku.toUpperCase() === inputItem;
          })[0];
          console.log(itemToDecrease);

          if (!itemToDecrease || !itemToDecrease.amountAvailable || itemToDecrease.amountAvailable <= 0) {
            setOpen(true);
            setMessage({
              message: 'Not enough left! If you know there are more items, you can put them in first.',
              severity: 'error',
            });
            return;
          }
          removeOneFromInventory(itemToDecrease.sku)
            .then((result) => {
              setFilteredInventory(result.rows);
              setOpen(true);
              setTakeOut('');
              setMessage({ message: 'Removed one ' + itemToDecrease.sku, severity: 'success' });
            })
            .catch((error) => {
              setOpen(true);
              setMessage({ message: 'Error: ' + error, severity: 'error' });
            });
        }
        setOpen(true);
        setMessage({ message: 'SKU not found in sheet.', severity: 'warning' });
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedTakeOut]
  );

  // Our hook
  function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value]);

    return debouncedValue;
  }

  return (
    <div className={classes.container}>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <div className={classes.toolbar}>
          <TextField
            id='take'
            label='Take Out - PLEASE SCAN SKU'
            variant='outlined'
            value={takeOut}
            className={classes.textField}
            onChange={(e) => setTakeOut(e.target.value)}
          />
          <TextField id='search' label='Search' variant='outlined' value={searchTerm} onChange={handleSearch} />
          <TextField id='sheetpw' label='Password' variant='outlined' value={password} onChange={handlePassword} />

          <Button id='save' onClick={handleSave} color='secondary' variant='contained' type='submit'>
            Save after changing Grid directly
          </Button>
          <Button
            id='save'
            onClick={handleDelete}
            disabled={password.toLowerCase() !== SHEET_PWS}
            color='secondary'
            variant='outlined'
            type='submit'
          >
            Delete Selected
          </Button>
          <Button id='gridExport' onClick={handleExport} color='primary' variant='contained' type='submit'>
            Export Excel
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          className={classes.snackbar}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert className={classes.alert} onClose={handleClose} severity={message.severity}>
            {message.message}
          </Alert>
        </Snackbar>
        <HotTable
          ref={hotTableComponent}
          data={filteredInventory}
          search='true'
          colHeaders={columns ? Object.keys(columns).map((el) => columns[el].columnHeader) : ''}
          columns={columns}
          filters='true'
          selectionMode='multiple'
          outsideClickDeselects={false}
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
