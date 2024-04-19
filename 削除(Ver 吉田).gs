function delckline2() {
  
  //チェックボックスの位置を指定
  const CKPOS = 1

  const sh = SpreadsheetApp.getActiveSpreadsheet();
  const ss = sh.getSheetByName('参照');
  const values = ss.getDataRange().getValues();
  
  //チェックの入っている行を逆順で取得
  const rowNum = values.flatMap((row,i) => row[CKPOS-1]==true? i+1:[]).reverse();//行の順番を戻す
    Logger.log(rowNum);
 
  //チェックの入っている行がない場合
  if (rowNum == 0){

    Browser.msgBox("削除する項目にチェックを入れてください");
    return;
  }

  //削除確認メッセージで「キャンセル」が押下された場合
  if (Browser.msgBox("チェックされた項目を削除します",Browser.Buttons.OK_CANCEL) === 'cancel'){

    Browser.msgBox("キャンセルしました");
    return;
  }


  //行を削除
  rowNum.forEach(row => ss.deleteRow(row));
    Browser.msgBox("削除が完了しました");
}