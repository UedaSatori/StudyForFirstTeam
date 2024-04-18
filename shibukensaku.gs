function sarch() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const kensakusheet = ss.getSheetByName('検索');
  const listsheet = ss.getSheetByName('リスト');

  //検索ワード取得
  const sarchword = kensakusheet.getRange('C2').getValue();
  Logger.log(sarchword);


  //B,シートの定義
  const START_COL_NUM = 1; //getRangeメソッドで読み込み始める列番号
  const START_ROW_NUM = 1; //getRangeメソッドで読み込み始める行番号
  const lastCol = listsheet.getLastColumn();
  const lastRow = listsheet.getLastRow();

  //C,複数のセルから値を取得
  const nameArray = listsheet.getRange(START_ROW_NUM, START_COL_NUM, lastRow, lastCol).getValues(); //リストシート内のデータを全て取得
  Logger.log(nameArray);
  const nameArrayLen = nameArray.length;
  const matchArray = []; //部分一致したものだけを格

  //D,部分一致すれば配列に格納
  for(var i=0; i<nameArrayLen; i++){
    if( i===0 ){ //最初の要素は判定処理しない
      continue;
    }else{
      const valueArray = nameArray[i][0].indexOf(sarchword);
      Logger.log(valueArray);
      if(valueArray != -1){
        matchArray.push(nameArray[i]);
        }else if(valueArray == 0){
          matchArray.push(nameArray[i]);
          

      }
    }

  }

  //E,「検索結果」に部分一致した値を記入
  const matchArrayLen = matchArray.length;
  kensakusheet.getRange(5, 3, matchArrayLen, lastCol).setValues(matchArray);
  
}

  //const range = listsheet.getDataRange();
  //const values = range.getValues();
  //console.log(values);

  

 

  //kensakusheet.activate();
 
  //let range = kensakusheet.getRange('C3');
  //let SearchChar = range.getValue();
  //Logger.log(SearchChar);
 
  //kensakusheet.getRange('C6').setValue('=QUERY(リスト!A:E,"SELECT A,B,C,D,E WHERE A,B,C,D,E SearchChar")');


