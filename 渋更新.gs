function uppdata() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const kensakusheet = ss.getSheetByName('検索');
  const listsheet = ss.getSheetByName('リスト');


   const START_COL_NUM = 1; //getRangeメソッドで読み込み始める列番号
  const START_ROW_NUM = 1; //getRangeメソッドで読み込み始める行番号
  const lastCol = listsheet.getLastColumn();
  const lastRow = listsheet.getLastRow();

  //C,複数のセルから値を取得
  const listdata = listsheet.getRange(START_ROW_NUM+1, START_COL_NUM, lastRow, lastCol).getValues(); //リストシート内のデータを全て取得
  Logger.log(listdata);

  const kensakudata = kensakusheet.getRange(START_ROW_NUM +4, START_COL_NUM +2, lastRow, lastCol).getValues(); 
  Logger.log(kensakudata);//リストシート内のデータを全て取得

  if(listdata ===! kensakudata){
    listsheet.getRange(4,1,lastRow,lastcol).setValues(kensakudata);
 }else{
  listsheet.getRange(2,1,lastRow,lastCol).setValues(kensakudata);
  return;
 }
}

























