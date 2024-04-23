//const ss = SpreadsheetApp.getActiveSpreadsheet();
//const sheet2 = ss.getSheetByName("リスト");
//const sheet3 = ss.getSheetByName("参照");

function updateRecord() {
  //社員番号が更新された際は、不確定の挙動をするがここは実装しない。

  //参照シートに現在表示されているレコードをチェックボックス含めすべて持ってきて格納する。先頭要素がチェックボックスの真偽値なのでカラムは1列増える。
  let sheet3AreaOn_updateRecord = decidingSearchArea(sheet3);

  console.log(sheet3AreaOn_updateRecord);

  //リストシートに現在表示されているレコードを全て持ってくる。
  let sheet2SearchAreaOn_updateRecord = decidingSearchArea(sheet2);

  //更新用配列を用意
  let workSpaceOn_updateRecord = new Array(5);
  let updatedRecords = new Array(workSpaceOn_updateRecord);

  console.log(updatedRecords);
  console.log(sheet3AreaOn_updateRecord.sheetSearchArea);

  //更新用配列に現在の参照シートの更新後の状態をチェックボックスを抜いた状態で格納する。
  for(i = 0; i < sheet3AreaOn_updateRecord.sheetSearchArea.length; i++){
    sheet3AreaOn_updateRecord.sheetSearchArea[i].splice(0,1);
    
    updatedRecords[i] = sheet3AreaOn_updateRecord.sheetSearchArea[i];
  }

  console.log(updatedRecords);

  //更新情報を格納した2次元配列を渡して、入力規則に登録情報が則っているかを調べる。
  let judgeUpdatedRecords = judgeRecord(updatedRecords);

  //判定値に応じて処理の継続か中断かを選ぶ
  switch(judgeUpdatedRecords){
    case "OK":
      break;
    case "OUT":
      Browser.msgBox("入力規則に反しているため更新せず処理を終了します。");
      return;
  }

  //リストシート内のレコード群と更新用レコードのPKの値を比較して、リストシートのPKが同じレコードに更新用レコードを入れる。
  for(i = 0; i < updatedRecords.length; i++){
    for(j = 0; j < sheet2SearchAreaOn_updateRecord.sheetSearchArea.length; j++){

      if(sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][0] == updatedRecords[i][0]){

      sheet2SearchAreaOn_updateRecord.sheetSearchArea[j] = updatedRecords[i];
      
      }
    }
  }

  console.log(sheet2SearchAreaOn_updateRecord)

  console.log(sheet2SearchAreaOn_updateRecord.sheetSearchArea)

  //社員番号が更新された場合はそれを受け付けないのでそれを確認するために更新前のリストシートのレコード群を持ってくる。
  let sheet2SearchArea2On_updateRecord = decidingSearchArea(sheet2);

  //リストシートに更新結果を反映
  sheet2.getRange(2,1,sheet2SearchAreaOn_updateRecord.sheetLastRow,sheet2SearchAreaOn_updateRecord.sheetLastColumn).setValues(sheet2SearchAreaOn_updateRecord.sheetSearchArea);

  //66～83加筆修正、更新前リストシートと更新後リストシートのsheetSearchAreaが同一だった場合、社員番号は変更できませんのメッセージを表示する。
  if(sheet2SearchAreaOn_updateRecord.sheetSearchArea == sheet2SearchAreaOn_updateRecord.sheetSearchArea){
    Browser.msgBox("社員番号は変更できません。");

    //社員番号以外が同じで、更新用配列との比較で社員番号が異なっているレコードを発見次第、社員番号が変更されたとみなして、更新用配列の社員番号を上書きする。
    for(i = 0; i < updatedRecords.length; i++){
      for(j = 0; j < sheet2SearchAreaOn_updateRecord.sheetSearchArea.length; j++){

        if(sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][0] != updatedRecords[i][0] && sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][1] == updatedRecords[i][1] && sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][2] == updatedRecords[i][2] && sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][3] == updatedRecords[i][3] && sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][4] == updatedRecords[i][4]){

        updatedRecords[i] = sheet2SearchAreaOn_updateRecord.sheetSearchArea[j];
        }
      }
    }
    //参照シートを更新前に戻す
    sheet3.getRange(3,2,sheet3AreaOn_updateRecord.sheetLastRow,sheet3AreaOn_updateRecord.sheetLastColumn - 1).setValues(updatedRecords);
    return;
  }

  Browser.msgBox("更新しました。");
}


/*レコードが入力規則に沿ってるかどうかを調べる。引数は2次元配列。戻り値は文字列。OUTかOKかで返す。*/
function judgeRecord(checkRecords){

  console.log(checkRecords);

  //レコード群の要素に空白があったら、（空白編集）空白入力はできないとしてエラーメッセージを出し、undefinedで返す。
  for(i = 0; i < checkRecords.length; i++){
    for(j = 0; j < checkRecords[i].length; j++){
      if(checkRecords[i][j] == ""){
        Browser.msgBox("空白入力はできません。")
        return "OUT";
      }
    }
  }

  //レコード群の先頭要素に数値以外が入力されたら、社員番号が数値ではないとしてエラーメッセージを出す。
  for(i = 0; i < checkRecords.length; i++){
    if(!isFinite(checkRecords[i][0])){
      Browser.msgBox("社員番号を数値以外に編集することはできません。");
      return "OUT";
    }
    else if(isFinite(checkRecords[i][1]) || checkRecords[i][1].toString().indexOf(" ") >= 0 || checkRecords[i][1].toString().indexOf("　") >= 0){
      Browser.msgBox("姓に文字列以外を入力することはできません。");
      return "OUT";
    }
    else if(isFinite(checkRecords[i][2]) || checkRecords[i][2].toString().indexOf(" ") >= 0 || checkRecords[i][2].toString().indexOf("　") >= 0){
      Browser.msgBox("名に文字列以外を入力することはできません。");
      return "OUT";
    }
  }

  return "OK"; 
}