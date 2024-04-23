//const ss = SpreadsheetApp.getActiveSpreadsheet();
//const sheet2 = ss.getSheetByName("リスト");
//const sheet3 = ss.getSheetByName("参照");

/**更新用メソッド*/
function updateRecord() {

  //本当は社員番号が変更をかけられたときを検知して、このメッセージを出したかったが期間が足りないため省略
  Browser.msgBox("社員番号の値は更新できませんのでご了承ください。")

  //参照シートに現在表示されているレコードをチェックボックス含めすべて持ってきて格納する。先頭要素がチェックボックスの真偽値なのでカラムは1列増える。
  let sheet3AreaOn_updateRecord = decidingSearchArea(sheet3);

  console.log(sheet3AreaOn_updateRecord);

  //リストシートに現在表示されているレコードを全て持ってくる。
  let sheet2SearchAreaOn_updateRecord = decidingSearchArea(sheet2);

  console.log(sheet2SearchAreaOn_updateRecord);

  //更新用配列を用意
  let workSpaceOn_updateRecord = new Array();
  let updatedRecords = new Array(workSpaceOn_updateRecord);

  //更新用配列に現在の参照シートの更新後の状態をチェックボックスを抜いた状態で格納する。
  for(i = 0; i < sheet3AreaOn_updateRecord.sheetSearchArea.length; i++){
    for(j = 0; j < (sheet3AreaOn_updateRecord.sheetSearchArea[i].length - 1); j++){
      updatedRecords[i][j] = sheet3AreaOn_updateRecord.sheetSearchArea[i][j + 1];
    }
  }

  console.log(updatedRecords);

  //リストシート内のレコード群にと更新用レコードのPKの値を比較して、リストシートのPKが同じレコードに更新用レコードを入れる。
  for(i = 0; i < updatedRecords.length; i++){
    for(j = 0; j < sheet2SearchAreaOn_updateRecord.sheetSearchArea.length; j++){

      console.log(updatedRecords[0][0]);
      console.log(sheet2SearchAreaOn_updateRecord.sheetSearchArea[0][0]);

      if(sheet2SearchAreaOn_updateRecord.sheetSearchArea[j][0] == updatedRecords[i][0]){

      sheet2SearchAreaOn_updateRecord.sheetSearchArea[j] = updatedRecords[i];
      
      }
    }
  }

  console.log(sheet2SearchAreaOn_updateRecord)

  //リストシートに更新結果を反映
  sheet2.getRange(2,1,sheet2SearchAreaOn_updateRecord.sheetLastRow,sheet2SearchAreaOn_updateRecord.sheetLastColumn).setValues(sheet2SearchAreaOn_updateRecord.sheetSearchArea);

  Browser.msgBox("更新処理が終了しました。");
}


/*レコードが入力規則に沿ってるかどうかを調べる。引数は2次元配列。戻り値は文字列。OUTかOKかで返す。*/
function judgeRecord(checkRecords){

  console.log(checkRecords);

  //レコード群の先頭要素以外に空白があったら、（空白編集）空白入力はできないとしてエラーメッセージを出し、undefinedで返す。
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
      Browser.msgBox("社員番号に数値以外を編集することはできません。");
      return "OUT";
    }
    else if("string" != typeof(checkRecords[i][1])){
      Browser.msgBox("姓に文字列以外を入力することはできません。");
      return "OUT";
    }
    else if("string" != typeof(checkRecords[i][2])){
      Browser.msgBox("名に文字列以外を入力することはできません。");
      return "OUT";
    }
  }

  return "OK"; 
}
