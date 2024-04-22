function delete_duplication(){

  var result = Browser.msgBox("チェックした社員情報を削除します", Browser.Buttons.OK_CANCEL);
  if (result === "cancel") return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet3 = ss.getSheetByName('参照');
  const startRow = 3;
  const lastRow = sheet3.getLastRow();

  const bools = sheet3.getRange(startRow,1,lastRow).getValues().flatMap(bool => bool);

  let deleteCount = 0;
  bools.forEach((bool, idx)=>{

    if (bool) {
      sheet3.deleteRow(startRow + idx - deleteCount);
      deleteCount++;
    }
  });
}