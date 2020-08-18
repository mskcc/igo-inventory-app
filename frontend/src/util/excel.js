import FileSaver from 'file-saver';
import Excel from 'exceljs';

export const exportExcel = (runs, columns) => {
  let workbook = new Excel.Workbook();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '-' + dd + '-' + yyyy;
  let fileName = `RunPlanner-${today}`;
  workbook.creator = 'IGO';
  workbook.lastModifiedBy = 'IGO';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  let runplanner = workbook.addWorksheet('runplanner');

  let sheetColumns = [];
  // add columns first to be able to reference them by key during formatting step
  columns.forEach((columnDef) => {
    // SKIP hidden columns
    if ('hiddenFrom' in columnDef) {
      return;
    }
    sheetColumns.push({
      header: columnDef.columnHeader,
      key: columnDef.data,
      width: 20,
    });
  });
  runplanner.columns = sheetColumns;
  let headerRow = runplanner.getRow(1);
  headerRow.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  headerRow.height = 20;
  headerRow.font = { bold: true };
  // runplanner.addRows(runs);
  // FILL
  columns.forEach((columnDef) => {
    // SKIP hidden columns
    if ('hiddenFrom' in columnDef) {
      return;
    }

    // ADD EXISTING VALUES
    //  need to do this in the column loop because adding dataValidation to a cell creates new rows
    for (let i = 0; i < runs.length + 10; i++) {
      let cell = runplanner.getRow(i + 2).getCell(`${columnDef.data}`);
      runs[i] && console.log(runs[i][columnDef.data]);
      if (runs[i]) {
        cell.value = runs[i][columnDef.data];
        if (columnDef.type === 'numeric' && cell.value !== '') {
          cell.value = parseFloat(cell.value);
        }
      } else {
        cell.value = '';
      }
    }
  });
  workbook.xlsx.writeBuffer().then(function (data) {
    var blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  });
};
