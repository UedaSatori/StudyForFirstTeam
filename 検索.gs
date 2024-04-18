//検索＿担当：中島

const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet2 = ss.getSheetByName("リスト")
const sheet3 = ss.getSheetByName("参照");

var checkLastRow = sheet3.getRange(3,1,5000,5).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRowIndex();

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

  
  
  //シート２のリストデータを取得
  let listData = sheet2.getRange(2,1,5000,5).getValues(); //(開始行、開始列、何行分か、何列分か)を範囲選択し、引数で取得
                                   //↑を何に変えればいいか悩み中（要件定義に合わせて、一旦5000に設定）
  console.log(listData);

  SpreadsheetApp.flush();

  //検索条件欄を取得
  var searchWords = sheet3.getRange('A1');


  //条件入力欄が空白かどうか判定
  if (searchWords.isBlank()){
    sheet3.getRange(3,2,5000,5).setValues(listData); //シート２のリストをシート３にを全体を表示させる処理
                      //↑上と同じくここを何に変えればいいか悩み中
    
    //シート３内でデータが存在する最終行を取得
    var rowRangeDown = sheet3.getRange(3,2,5000,5).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow() -2;
      //シート3の上2行はデータとして見なさないため、最後に-2の処理

    var allCheckRange = sheet3.getRange(3,1,(rowRangeDown),1); //チェックボックスを配置する箇所をシート３のA列に指定する変数
    var removeAllCheckRange = sheet3.getRange(3,1,5000,1);     //既に配置されているチェックボックスを削除するための変数
    removeAllCheckRange.removeCheckboxes();                    //チェックボックスを削除する処理

    SpreadsheetApp.flush();
    allCheckRange.insertCheckboxes(); //反映されたデータの数だけA列にチェックボックスを配置
  
    //else if //listRangeの中から条件に当てはまるデータを抽出する処理

    /*for構文を用いてデータをループする
    1.該当のデータがある場合、そのデータを出力
    2.該当のデータがない場合、エラーメッセージを表示*/

    //Browser.msgBox("検索条件に該当するデータが存在しません",Browser.Buttons.OK);
  
  }
}
