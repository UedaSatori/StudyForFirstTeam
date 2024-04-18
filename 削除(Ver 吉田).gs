function delete_duplication(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet3 = ss.getSheetByName('参照');
  const startRow = 3;
  const lastRow = sheet3.getLastRow();

  const bools = sheet3.getRange(startRow,1,lastRow).getValues().flatMap(bool => bool);

  let deleteCount = 0;
  bools.forEach((bool, idx)=>{

    //チェックの入っている項目がある場合（ない場合は処理終了）
    if (bool) {
      //チェックの入っている項目を削除
      sheet3.deleteRow(startRow + idx - deleteCount);

      deleteCount++;
    }
  });
}