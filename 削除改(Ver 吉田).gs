function delckline2() {
  
  //チェックボックスの位置を指定
  const CKPOS = 1

  const sh = SpreadsheetApp.getActiveSpreadsheet();
  const ss1 = sh.getSheetByName('リスト');
  const ss2 = sh.getSheetByName('参照');

  const values = ss2.getDataRange().getValues();

  
  //「参照」でチェックの入っている行を逆順で取得
  const rowNum1 = values.flatMap((row,i) => row[CKPOS-1]==true? i+1:[]).reverse();//行の順番を戻す
    Logger.log(rowNum1);
  
  //「リスト」からも同じ行を逆順で取得
  const rowNum2 = values.flatMap((row,i) => row[CKPOS-1]==true? i:[]).reverse();//行の順番を返す
    Logger.log(rowNum2);

 
  //チェックの入っている行がない場合
  if (rowNum1 == 0){

    Browser.msgBox("削除する項目にチェックを入れてください");
    return;
  }

  //削除確認メッセージで「キャンセル」が押下された場合
  if (Browser.msgBox("チェックされた項目を削除します",Browser.Buttons.OK_CANCEL) === 'cancel'){

    Browser.msgBox("キャンセルしました");
    return;
  }

  //「参照」の行を削除
  rowNum1.forEach(row => ss2.deleteRow(row));

  //「リスト」の行を削除
  rowNum2.forEach(row => ss1.deleteRow(row));

    Browser.msgBox("削除が完了しました");

}
