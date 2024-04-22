//検索＿担当：中島

/*const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet2 = ss.getSheetByName("リスト")
const sheet3 = ss.getSheetByName("参照");*/


function enterWords(){ //検索条件入力に関するfunction
  
  //入力ボックスを配置
  var ui = SpreadsheetApp.getUi();
  var btn = ui.ButtonSet.OK_CANCEL;

  var response = ui.prompt("検索条件を入力してください","※全リストを表示する場合は、空白のまま検索",btn); //入力ボックス表示内容

  const text = response.getResponseText(); //入力された条件を取得
  var button = response.getSelectedButton(); //選択されたボタンの種類を判別

  //ボタンごとに処理を区別
  switch(button){

    case ui.Button.CANCEL:
      break;

    case ui.Button.OK:
      sheet3.getRange('A1').setValue(text)
      break;
  }
}
  

function searchValues(){

  const START_COL_NUM = 1; //getRangeメソッドで読み込み始める列番号
  const START_ROW_NUM = 1; //getRangeメソッドで読み込み始める行番号

  const lastCol2 = sheet2.getLastColumn();
  const lastRow2 = sheet2.getLastRow();

  const lastCol3 = sheet3.getLastColumn();
  const lastRow3 = sheet3.getLastRow();

  //シート２のリストデータを取得
  let listData = sheet2.getRange(2,1, lastRow2, lastCol2).getValues(); 
  
  console.log(listData);

  //検索条件欄を取得
  var searchWords = sheet3.getRange('A1');


  const nameArray = sheet3.getRange(3,1,lastRow3, lastCol3).getValues(); //リストシート内のデータを全て取得
  Logger.log(nameArray);


  //条件入力欄が空白かどうか判定
  if (searchWords.isBlank()){
    sheet3.getRange(3,2,lastRow3, lastCol3).setValues(listData);
    //シート２のリストをシート３にを全体を表示させる処理
     
    var rowRangeDown = sheet3.getRange(START_ROW_NUM, START_COL_NUM, lastRow3, lastCol3).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow() -2;
    //シート3の上2行はデータとして見なさないため、最後に-2の処理

    console.log(rowRangeDown);

    var allCheckRange = sheet3.getRange(3,1,(rowRangeDown),1); //チェックボックスを配置する箇所をシート３のA列に指定する変数
    var removeAllCheckRange = sheet3.getRange(3,1,lastRow3,1);     //既に配置されているチェックボックスを削除するための変数
    removeAllCheckRange.removeCheckboxes();                    //チェックボックスを削除する処理

    SpreadsheetApp.flush();
    allCheckRange.insertCheckboxes(); //反映されたデータの数だけA列にチェックボックスを配置
  
     
  
    //}else if{ //listRangeの中から条件に当てはまるデータを抽出する処理
    
    /*for構文を用いてデータをループする
    1.該当のデータがある場合、そのデータを出力
    2.該当のデータがない場合、エラーメッセージを表示*/

    //Browser.msgBox("検索条件に該当するデータが存在しません",Browser.Buttons.OK);
  }
}


/*入力ボックスを表示させる
  const title = "検索条件を入力してください"
  const prompt = "例）田中、関西（全ての情報を表示する場合は空白）"
  const response = Browser.inputBox(title,prompt,Browser.Buttons.OK_CANCEL);

  //入力ボックスの情報を取得
  const sign = response.getResponseText();

  //ボタンが押された際の処理
  const button = response.getSelectedButton();
  switch(button){
    case Browser.Buttons.CANCEL:
      break;
    
    case Browser.Buttons.OK:
      SpreadsheetApp.sheet3().getRange('B1').setValue(sign)
      break;
  }*/

//シート2におけるデータが存在する1番下の行を取得
  //var lastRow = sheet2.getRange(A2:E2).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRowIndex();
  
  //var lastColumn = sheet2.getRange(2,1).getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumnIndex();
/*表の開始行列（A1）から下方向に空白行の手前までを取得
  var rowRangeDown = sheet.getRange('A1').getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
  Logger.log('「getNextDataCell」メソッドを使用した表の最終行取得：'+rowRangeDown);*/
/*データが入っている最終列を取得
　 getLastColumn()*/