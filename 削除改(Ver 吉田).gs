function delckline2() {

  const CKPOS = 1
  const sh = SpreadsheetApp.getActiveSpreadsheet();
  const ss1 = sh.getSheetByName('シート2');
  const ss2 = sh.getSheetByName('シート3');

  const values1 = ss1.getDataRange().getValues();
  console.log(values1);
  const values2 = ss2.getDataRange().getValues();
  
  const rowNum1 = values2.flatMap((row,i) => row[CKPOS-1]==true? i+1:[]).reverse();
  Logger.log(rowNum1);


  if (rowNum1 == 0){

    Browser.msgBox("削除する項目にチェックを入れてください");
    return;
  }
  
  let checkvalue = new Array();
    Logger.log(checkvalue);
  let checkvalueIndex = 0;
  
  for( let i = 0; i < values2.length; i++){
      if( values2[i][0]=== true ){
        checkvalue[checkvalueIndex] = values2[i][1];
        Logger.log(checkvalue);
        checkvalueIndex++;
      }
  }


  if (Browser.msgBox("チェックされた項目を削除します",Browser.Buttons.OK_CANCEL) === 'cancel'){
    
    Browser.msgBox("キャンセルしました");
    return;
  }
  

  var lastRow = ss1.getLastRow();
  for (var i = lastRow; i >= 1; i--){

    for(j = 0; j < checkvalue.length; j++){
        if (values1[i-1][0].toString().includes(checkvalue[j].toString())){
        ss1.deleteRow(i);
      }
    } 
  }

  rowNum1.forEach(row => ss2.deleteRow(row));

  Browser.msgBox("削除が完了しました");
}