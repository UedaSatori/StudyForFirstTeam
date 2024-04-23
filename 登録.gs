const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet2 = ss.getSheetByName("リスト");
const sheet3 = ss.getSheetByName("参照");
const touroku_sheet = ss.getSheetByName('登録');

//登録ボタンが押された時に行う関数
function touroku() { 

  let ui2 = SpreadsheetApp.getUi();
  let btnFor_touroku = ui2.ButtonSet.OK_CANCEL;
  
  //データが入っている次の列にデータを入れるために最終行の行番号＋1の行番号を取得する。リストシートにレコードがない場合、
  //シート全体の空白セルの最終行を返すので、先頭レコードが空白ではないかを後々判定する。
  var lastrow = sheet2.getRange(1,1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow()+1;
  console.log(lastrow); 

  //先頭レコードが存在しない場合の処理
  //データがA２に入っていなかったら、A2にいれる
  if(sheet2.getRange('A2').isBlank()){ 
    lastrow = 2;
    console.log(lastrow);
  }

  //登録のデータを取得する
  const number = touroku_sheet.getRange('C5').getValue();
  Logger.log(number);
  const surname = touroku_sheet.getRange('C8').getValue();
  Logger.log(surname);
  const name = touroku_sheet.getRange('C11').getValue();
  const job = touroku_sheet.getRange('C14').getValue();
  const base =touroku_sheet.getRange('C17').getValue();

  //結果用の二次元配列を作成
  let workSpaceFortouroku = new Array();
  let resultOntouroku = new Array(workSpaceFortouroku);

  //returnの時に登録情報を返す改修ができるように結果用2次元配列を用意しておく。
  resultOntouroku[0][0] = number;
  resultOntouroku[0][1] = surname;
  resultOntouroku[0][2] = name;
  resultOntouroku[0][3] = job;
  resultOntouroku[0][4] = base;

  console.log(resultOntouroku);

  //入力データを格納した配列が空白文字を格納しているかを調べる。空白があった場合、エラー文を表示する。
  for(i = 0; i < resultOntouroku[0].length; i++){
    if(resultOntouroku[0][i] == ""){
      Browser.msgBox("空白の項目があります。");
      deleteInput_touroku();
      return
    }
  }

  //登録情報を格納した2次元配列を渡して、入力規則に登録情報が則っているかを調べる。
  let judge = judgeRecord(resultOntouroku);

  //判定値に応じて処理の継続か中断かを選ぶ
  switch(judge){
    case "OK":
      break;
    case "OUT":
      deleteInput_touroku();
      return;
  }
  //上の情報判定文は更新メソッドでも使う。

  /*
  //numberが数字ではなかった場合エラー文を表示する
  if(!isFinite(number)){  
    Browser.msgBox("数値を入力してください。");
    deleteInput_touroku();
    return;
  }
  */

  //リストレコードのレコードの存在を戻り値として受け取る。
  let searchAreaOn_touroku = decidingSearchArea(sheet2);

  // 既存のIDと新しいIDが一致する場合、登録を拒否
  //var data = sheet2.getRange("A:A").getValues(); // A列の値を取得

  //受け取った戻り値からレコードを1つずつ受け取り、そのレコードのPKの値が入力値と等しいかを調べる。
  for (let searchRecord of searchAreaOn_touroku.sheetSearchArea) {

    console.log(searchRecord);

    if(searchRecord[0] == number){
      Browser.msgBox("この社員番号は登録されています");
      deleteInput_touroku();
      return;
    }else if(searchRecord[1] == surname && searchRecord[2] == name){

      let btnCheckFor_touroku1 = Browser.msgBox("社員番号" + searchRecord[0] + "," + searchRecord[1] + "," + searchRecord[2] + "さんは" 
      + searchRecord[3] + "," + searchRecord[4] 
      + "で既に登録されています。" + "同一人物を再登録する場合は、登録済みのデータを削除してください。" + "\n※このまま登録する場合はOKを押してください"
      ,btnFor_touroku);

      console.log(btnCheckFor_touroku1);

      //押されたボタンで処理を続けるか、関数から抜けるかを判定。
      switch(btnCheckFor_touroku1){
        case "ok":
          break;
          
        case "cancel":
          Browser.msgBox("削除するレコード: " + searchRecord );
          deleteInput_touroku();
          return;
      }
    }
  }
    

  /*
  //「リスト」シートの空白セルに転記
  listsheet.getRange("A"+lastrow).setValue(number);
  listsheet.getRange("B"+lastrow).setValue(surname);
  listsheet.getRange("C"+lastrow).setValue(name);
  listsheet.getRange("D"+lastrow).setValue(job);
  listsheet.getRange("E"+lastrow).setValue(base);
  */

  //最終確認を行う。  
  btnCheckFor_touroku1 = Browser.msgBox("社員番号: " + resultOntouroku[0][0] + "," + "姓: " + resultOntouroku[0][1] + "," + "名: " + resultOntouroku[0][2] + "," 
  + "職種: " + resultOntouroku[0][3] + "," + "拠点: " + resultOntouroku[0][4] + "で登録します。よろしいですか？", btnFor_touroku);

  //最終確認判定
  switch(btnCheckFor_touroku1){
    case "ok":
      Browser.msgBox("登録しました。");
      break;

    case "cancel":
      Browser.msgBox("登録処理を中断します。");
      deleteInput_touroku();
      return;
  }

  //登録情報を反映する。
  sheet2.getRange(lastrow,1,1,5).setValues(resultOntouroku);
  
  deleteInput_touroku();

  return;
}

//登録用入力セルの削除メソッド
function deleteInput_touroku(){
  //入力を削除する
    var cellsToClear = [5, 8, 11, 14, 17];
    for (var row of cellsToClear) {
    touroku_sheet.getRange('C' + row).clearContent();
  }
  return;
}