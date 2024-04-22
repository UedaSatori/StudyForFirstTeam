function registerDateToList() {
  
  //使用するシートを定義
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet1 = ss.getSheetByName('登録');
  const sheet2 = ss.getSheetByName('リスト');
  //上書き防止処置
  const writingLow = sheet2.getLastRow() + 1;


　//「登録」から記入したデータを取得
　const number = sheet1.getRange("C5").getValue(); 
　Logger.log(number);
　const firstName = sheet1.getRange("C8").getValue(); 
　const LastName = sheet1.getRange("C11").getValue(); 
　const gyoushu = sheet1.getRange("C14").getValue(); 
　const kyoten = sheet1.getRange("C17").getValue(); 


　//社員番号欄が空欄・番号以外の場合、エラーメッセージ出力
　if(sheet1.getRange("C5").isBlank() || !isFinite(number)){
      Browser.msgBox("入力内容が有効ではありません");
      return;
　}


　// 既存の社員番号と新しい社員番号が一致する場合、登録を拒否しエラーメッセージ出力
  var data = sheet2.getRange("A:A").getValues(); // A列の値を取得
  console.log(data);

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == number) {
      Browser.msgBox("この社員番号は登録されています");
      return ;
    }
  }


　//「リスト」に転記
　sheet2.getRange("A"+ writingLow).setValue(number);
　sheet2.getRange("B"+ writingLow).setValue(firstName);
　sheet2.getRange("C"+ writingLow).setValue(LastName);
　sheet2.getRange("D"+ writingLow).setValue(gyoushu);
　sheet2.getRange("E"+ writingLow).setValue(kyoten);


  //「登録」の入力の削除
  var cellsToClear= [4, 7, 10, 13, 16];
  for (var row of cellsToClear) {
    sheet1.getRange('B' + row).clearContent();
  }
}
