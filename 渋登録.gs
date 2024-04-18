function touroku() {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const touroku_sheet = ss.getSheetByName('登録');
  const listsheet = ss.getSheetByName('リスト');

  
  
    //データが入っている次の列にデータを入れる
    var lastrow = listsheet.getRange(1,1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow()+1;
    console.log(lastrow); 


    //データがA２に入っていなかったら、A2にいれる
    if(listsheet.getRange('A2').isBlank()){ 
      lastrow = 2;
      console.log(lastrow);
    }

    //登録のデータを取得する
    const number = touroku_sheet.getRange('B3').getValue();
    Logger.log(number);
    const surname = touroku_sheet.getRange('B7').getValue();
    Logger.log(surname);
    const name = touroku_sheet.getRange('B11').getValue();
    const job = touroku_sheet.getRange('B15').getValue();
    const base =touroku_sheet.getRange('B19').getValue();

    //numberが空白だった場合と数字ではなかった場合エラー文を表示する
    if(touroku_sheet.getRange('B3').isBlank() || !isFinite(number)){  
      Browser.msgBox("入力が内容があっていません。");
      return;
    }

 // 既存のIDと新しいIDが一致する場合、登録を拒否
  var data = listsheet.getRange("A:A").getValues(); // A列の値を取得
  console.log(data);

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === number) {
      
      Browser.msgBox("この社員番号は登録されています");
      return ;
    }
  }
  
  


 


    //「リスト」シートの空白セルに転記
    listsheet.getRange("A"+lastrow).setValue(number);
    listsheet.getRange("B"+lastrow).setValue(surname);
    listsheet.getRange("C"+lastrow).setValue(name);
    listsheet.getRange("D"+lastrow).setValue(job);
    listsheet.getRange("E"+lastrow).setValue(base);



    //入力を削除する
    var cellsToClear = [3, 7, 11, 15, 19];
    for (var row of cellsToClear) {
    touroku_sheet.getRange('B' + row).clearContent();
  }
  

}
  

  

  

  

