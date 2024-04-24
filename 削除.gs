function delckline2() {

  const CKPOS = 1
  const sh = SpreadsheetApp.getActiveSpreadsheet();
  const ss1 = sh.getSheetByName('リスト');
  const ss2 = sh.getSheetByName('参照');

  const values1 = ss1.getDataRange().getValues();
  console.log(values1);
  const values2 = ss2.getDataRange().getValues();
  
  //'参照'でチェックボックスにチェックの入っている行番号を抽出する
  const rowNum1 = values2.flatMap((row,i) => row[CKPOS-1]==true? i+1:[]).reverse();
  Logger.log(rowNum1);

  //削除メソッドが押された時に参照シートにレコードがない場合を想定。
  let resultOfsearchArea = decidingSearchArea(sheet3);

  //先頭レコードがない場合は処理終了。
  if(resultOfsearchArea == null){
    return;
  }

  //'参照'でチェックボックスにチェックの入っている行番号がない場合、処理を終了する
  if (rowNum1 == 0){

    Browser.msgBox("削除する項目にチェックを入れてください");
    return;
  }
  
  //空配列を作成する
  let checkvalue = new Array();
    Logger.log(checkvalue);
  let checkvalueIndex = 0;

  //'参照'でチェックボックスにチェックが入っている行の社員番号を抽出し、配列に格納する
  for( let i = 0; i < values2.length; i++){
      if( values2[i][0]=== true ){
        checkvalue[checkvalueIndex] = values2[i][1];
        Logger.log(checkvalue);
        checkvalueIndex++;
      }
  }


  if (Browser.msgBox("次の社員情報を削除します： 社員番号 " + checkvalue ,Browser.Buttons.OK_CANCEL) === 'cancel'){
    
    Browser.msgBox("キャンセルしました");
    return;
  }
  
  //'リスト'の最終行番号を取得
  var lastRow = ss1.getLastRow();
  //'リスト'の行を繰り下げる
  for (var i = lastRow; i >= 1; i--){
    
    //先に抽出した社員番号を含む'リスト'の行を削除
    for(j = 0; j < checkvalue.length; j++){
        if (values1[i-1][0].toString().includes(checkvalue[j].toString())){
        ss1.deleteRow(i);
      }
    } 
  }
  //'参照'でチェックボックスにチェックが入っている行を削除
  rowNum1.forEach(row => ss2.deleteRow(row));

  Browser.msgBox("削除が完了しました");
}