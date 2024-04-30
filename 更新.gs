//const ss = SpreadsheetApp.getActiveSpreadsheet();
//const sheet2 = ss.getSheetByName("リスト");
//const sheet3 = ss.getSheetByName("参照");

function updateRecord() {
  //社員番号が更新された際は、不確定の挙動をするがここは実装しない。

  //参照シートに現在表示されているレコードをチェックボックス含めすべて持ってきて格納する。先頭要素がチェックボックスの真偽値なのでカラムは1列増える。
  let sheet3AreaOn_updateRecord = decidingSearchArea(sheet3);


  //リストシートに現在表示されているレコードを全て持ってくる。
  let sheet2SearchAreaOn_updateRecord = decidingSearchArea(sheet2);

  //更新用配列を用意
  let workSpaceOn_updateRecord = new Array(5);
  let updatedRecords = new Array(workSpaceOn_updateRecord);

  //20～25加筆4月24日
  if(sheet2SearchAreaOn_updateRecord == null){
    return;
  }
  else if(sheet3AreaOn_updateRecord == null){
    return;
  }


  //更新用配列に現在の参照シートの更新後の状態をチェックボックスを抜いた状態で格納する。
  for(i = 0; i < sheet3AreaOn_updateRecord.sheetSearchArea.length; i++){
    sheet3AreaOn_updateRecord.sheetSearchArea[i].splice(0,1);
    
    updatedRecords[i] = sheet3AreaOn_updateRecord.sheetSearchArea[i];
  }


  //更新情報を格納した2次元配列を渡して、入力規則に登録情報が則っているかを調べる。
  let judgeUpdatedRecords = judgeRecord(updatedRecords);

  //判定値に応じて処理の継続か中断かを選ぶ
  switch(judgeUpdatedRecords){
    case "OK":
      break;
    case "OUT":
      Browser.msgBox("処理を終了します。");
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



  //社員番号が更新された場合はそれを受け付けないのでそれを確認するために更新前のリストシートのレコード群を持ってくる。
  let sheet2SearchArea2On_updateRecord = decidingSearchArea(sheet2);


  //リストシートに更新結果を反映
  sheet2.getRange(2,1,sheet2SearchAreaOn_updateRecord.sheetLastRow,sheet2SearchAreaOn_updateRecord.sheetLastColumn).setValues(sheet2SearchAreaOn_updateRecord.sheetSearchArea);


  //68～81加筆修正、更新前リストシートと更新後リストシートのsheetSearchAreaが同一だった場合、社員番号は変更できませんのメッセージを表示する。
  let sameCheck = sheet2SearchAreaOn_updateRecord.sheetSearchArea.filter(function(e){return sheet2SearchArea2On_updateRecord.sheetSearchArea.filter(function(f){ return e.toString() == f.toString()}).length > 0});
  

  if(sameCheck.length == sheet2SearchArea2On_updateRecord.sheetLastRow){
    Browser.msgBox("社員番号が変更された、もしくは更新箇所がなかったので、更新せずに終了します。");

    //参照シートを更新前に戻すのを実装したかったが更新前の参照シート内のレコードを作るのが大変なのでここは、戻さずにしておく。
    return;
  }
  Browser.msgBox("更新しました。");
}


/*レコードが入力規則に沿ってるかどうかを調べる。引数は2次元配列。戻り値は文字列。OUTかOKかで返す。*/
function judgeRecord(checkRecords){


  //レコード群の要素に空白があったら、（空白編集）空白入力はできないとしてエラーメッセージを出し、undefinedで返す。
  for(i = 0; i < checkRecords.length; i++){
    for(j = 0; j < checkRecords[i].length; j++){
      console.log(checkRecords[i][j]);
      if(checkRecords[i][j] == "" || checkRecords[i][j] === undefined){
        Browser.msgBox("空白入力はできません。")
        return "OUT";
      }
    }
  }

  //レコード群の先頭要素に数値以外が入力されたら、社員番号が数値ではないとしてエラーメッセージを出す。
  for(i = 0; i < checkRecords.length; i++){
    if(!isFinite(checkRecords[i][0])){
      Browser.msgBox("社員番号に数値以外を入力することはできません。");
      return "OUT";
    }
    else if(isFinite(checkRecords[i][1]) || checkRecords[i][1].toString().indexOf(" ") >= 0 || checkRecords[i][1].toString().indexOf("　") >= 0){
      Browser.msgBox("姓に文字列以外または、半角全角スペースを含んだ文字列を入力することはできません。");
      return "OUT";
    }
    else if(isFinite(checkRecords[i][2]) || checkRecords[i][2].toString().indexOf(" ") >= 0 || checkRecords[i][2].toString().indexOf("　") >= 0){
      Browser.msgBox("名に文字列以外または、半角全角スペースを含んだ文字列を入力することはできません。");
      return "OUT";
    }
    else if(checkRecords[i][3] != "開発" && checkRecords[i][3] != "インフラ" && checkRecords[i][3] != "営業" && checkRecords[i][3] != "その他"){
      Browser.msgBox("職種には「開発」「インフラ」「営業」「その他」のいずれかを入力してください。");
      return "OUT"
    }
    else if(checkRecords[i][4] != "関東" && checkRecords[i][4] != "関西" && checkRecords[i][4] != "愛知" && checkRecords[i][4] != "札幌" && checkRecords[i][4] != "福岡" && checkRecords[i][4] != "その他"){
      Browser.msgBox("拠点には「関東」「関西」「愛知」「札幌」「福岡」「その他」のいずれかを入力してください。");
      return "OUT";
    }
  }

  return "OK"; 
}