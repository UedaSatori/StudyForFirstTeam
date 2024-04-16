// @ts-nocheck
//シート全体を取得
const ss = SpreadsheetApp.getActiveSpreadsheet();

//DBシートを取得
const dbSheet = ss.getSheetByName('DBシート');

//表示シートを取得
const displaySheet = ss.getSheetByName('表示シート');

//検索文字列のセルを取得
const searchStringArea = displaySheet.getRange('C2:C4');

//検索文字列の値を取得
const searchString = searchStringArea.getValue();

//デフォルトメッセージ
const defaultMessage = "検索文字列を入力してください"

console.log(searchString);

//検索ボタンが押された時に実際に呼ばれるメソッド。引数なし。戻り値はSearchRecordの戻り値
function doSearch(){

  //SearchRecordの戻り値を改めて格納する。
  var result = SearchRecord(searchString);

  //戻り値がデフォルトメッセージだった時とnullだった時はSearchRecord側で出力処理を行うのでこちらは何もせずに処理を終了する。
  if(result == defaultMessage || result == null){

    return;

  }else{
    //表示エリアの左上のセルを取得  
    var displayBaseCell = displaySheet.getRange('C6');

    //前回の表示エリアを取得し、それを削除する。
    var displayArea = displaySheet.getRange(6,2,displayBaseCell.getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(),displayBaseCell.getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn());

    //前回の表示エリア全域を空にする。
    displayArea.setValue("");

    //チェックボックス分の1列を追加しながら今回の表示エリアを取得する。
    displayArea = displaySheet.getRange(6,2,result.length,result[0].length+1);
    
    //結果用配列の先頭要素にfalseの値を追加する。
    for(i = 0; i < result.length; i++){
      result[i].unshift('false');
    }

    //取得した表示エリアに結果配列を表示する。
    displayArea.setValues(result);

    return;
  }
}

//検索メソッド。検索文字列を引数に取る。主に別の引数のないメソッドから呼ばれる。
function SearchRecord(searchString) {

  //検索文字列がデフォルトメッセージまたは、空白の際は処理を終了し戻り値としてデフォルトメッセージを返す。
  if(searchString == defaultMessage || searchStringArea.isBlank()){

    //メッセージボックスにデフォルトメッセージを含めた文字列を出力する。
    Browser.msgBox("セルC2:C4に" + defaultMessage);

    //検索文字列にデフォルトメッセージを表示
    searchStringArea.setValue(defaultMessage);

    //検索文字列がなくて検索できない場合の戻り値としてdefaultMessageを返す。
    return defaultMessage;
  }

  //DBシートの最初のレコードの先頭のPKを取得
  var dbFirstPKCell = dbSheet.getRange(4,2);

  //最初のレコードの先頭のPK（社員番号）が空白ならレコードが存在しないとしてnullを返す。
  if(dbFirstPKCell.isBlank()){
    Browser.msgBox("データが存在しません。");
    return null;
  }

  //先頭レコードが存在することを確認した後で、何行目に最終レコードがあるかを代入
  var dbLastRowNumber = dbSheet.getRange(3,2).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

  //最終行行番号-2行でレコードが何行あるかを代入
  var dbLastRow = dbLastRowNumber-2;

  //最終列番号を代入
  var dbLastColumnNumber = dbSheet.getRange(4,2).getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn();

  //最終列番号-1で列数を代入
  var dbLastColumn = dbLastColumnNumber-1;

  console.log(dbLastRow);
  console.log(dbLastColumn);

  //検索エリア内の値を代入する。
  var searchArea = dbSheet.getRange(4,2,dbLastRow,dbLastColumn).getValues();

  console.log(searchArea);

  //結果用配列を宣言する。（二次元配列）
  var workSpace = new Array();
  var result = new Array(workSpace);

  console.log(result);

  //結果が格納されたとき、インクリメントする一次元添え字用ローカル変数を初期値0で宣言する。
  var indexForResult = 0;

  for(i = 0 ;i < dbLastRow; i++){
    for(j = 0; j < dbLastColumn; j++){
      if(searchArea[i][j] == searchString){

        //検索文字列に引っかかったレコードを結果用配列に格納する。  
        result[indexForResult] = searchArea[i];

        //一次元添え字用ローカル変数をインクリメントする。
        indexForResult++;
      }
    }
  }
  console.log(result);

  return result;
}
