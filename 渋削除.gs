function dlate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const kensakusheet = ss.getSheetByName('検索');
  const listsheet = ss.getSheetByName('リスト');


  const searchValue = kensakusheet.getRange('C2').getValue();; // 検索したい値を指定してください
  const dataRange = listsheet.getDataRange();
  const values = dataRange.getValues();

  const matchArray = [];

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    if (row.indexOf(searchValue) !== -1) {
      // 検索したい値が含まれている行のデータをログに出力
      Logger.log('行番号: ' + (i + 1));
      Logger.log(row.join(', ')); // データをカンマ区切りで表
      matchArray.push(row.join);
      
    }
  }
}

























