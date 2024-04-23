// @ts-nocheck
//検索＿担当：中島
//const ss = SpreadsheetApp.getActiveSpreadsheet();
//const sheet2 = ss.getSheetByName("リスト");
//const sheet3 = ss.getSheetByName("参照");

//自分のスプシで運用するためのコード
//const sheet2 = ss.getSheetByName("DBシート");
//const sheet3 = ss.getSheetByName("表示シート");

function enterWords(){ //検索条件入力に関するfunction

  //入力ボックスを配置
  var ui = SpreadsheetApp.getUi();
  var btn1 = ui.ButtonSet.OK_CANCEL;

  //最初のプロンプトを表示
  var response = ui.prompt("検索条件の個数を入力してください。※全件選択をしたい場合は１から５の整数を押して次へ進んでください。",btn1);

  //キャンセルボタンが押された時、処理を終了する。  
  if (response.getSelectedButton() == ui.Button.CANCEL){
    Browser.msgBox("処理を終了します。");
    return;
  }

  //一つ目の個数入力を数値で受け取る。
  const text1 = Number(response.getResponseText());

  let returnOfinputOnPrompt;

  //個数入力が正確に出来ているかを判別する。出来ていなければ、有効な個数を入力してくださいのmsgBoxを出力し、breakする。
  switch(text1){

    //横項目の数だけ分岐を与える。
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      returnOfinputOnPrompt = inputOnPrompt(text1);
      break;
    default:
      Browser.msgBox("有効な個数を入力してください。");
      return;
  }

  //console.log(returnOfinputOnPrompt);

  let resultFordisplayRecord = searchValues(returnOfinputOnPrompt,sheet2);

  console.log(resultFordisplayRecord);

  /*let workSpaceFordisplayRecord2 = searchValues(returnOfinputOnPrompt, sheet3);
  console.log(workSpaceFordisplayRecord2);*/

  displayRecord(resultFordisplayRecord);

  return;
}

//入力用プロンプトを出力、入力値を判定するスクリプト。この関数内でSearchメソッドを呼び出す。
function inputOnPrompt(text1){

  //入力ボックスを配置
  var ui = SpreadsheetApp.getUi();
  var btn1 = ui.ButtonSet.OK_CANCEL;

  //最初の入力で指定された個数だけ、プロンプトを表示し、その入力内容を可変長配列へ格納する。戻り値は可変長配列
  //可変長配列を用意する。
  var inputList = new Array();

  //表示用変数を宣言しておく。型推論になるので予め、空白文字列を入力し、型をString型と認識させておく。
  var inputValues = "";

  //最初のプロンプトを表示する。
  var response1 = ui.prompt("検索条件を1つ入力してください。※全リストを表示する場合は、空白のままOKボタンを押してください。",btn1);

  //ボタンの入力値を取得する。
  var buttonResponse1 = response1.getSelectedButton();

  //ボタンの入力値を判定し、OKが押されたらSwitch文を抜けて処理続行、キャンセルが押されたら関数を終了する。
  switch(buttonResponse1){
    case ui.Button.OK:
      break;
    case ui.Button.CANCEL:
      //87加筆
      Browser.msgBox("処理を終了します。");
      return;
  }
  
  //プロンプトの検索条件が空白だった場合に全件選択を示すポップアップを出す。
  if(response1.getResponseText() == ""){
    var response2 = Browser.msgBox("全件選択でよろしいですか？",btn1);

    //全件選択確認ポップアップで押されたボタンに応じて戻り値を変える。OKが押された場合nullを返す。
    switch(response2){
      case "ok":
        return null;
      case "cancel":
        Browser.msgBox("検索条件の個数選択からやり直してください。");
        return;
    }
  }
  else if(response1.getResponseText().toString().indexOf(" ") >= 0 || response1.getResponseText().toString().indexOf("　") >= 0){
    Browser.msgBox("検索条件に半角全角スペースを入力することは許可されていません。検索条件の個数選択からやり直してください。");
    return;
  }

  //最初の検索文字列を格納する。
  inputList[0] = response1.getResponseText()

  //入力値を入力させるフェーズ。
  for(i = 1; i < text1; i++){

    //今回のプロンプトを表示する。
    let response3 = ui.prompt("次の検索条件を入力してください。",btn1);

    //今回のプロンプトのボタン押下に応じて処理を変える。キャンセルボタンが押されたら、処理を中断する。
    switch(response3.getSelectedButton()){
      case ui.Button.OK:
        break;
      case ui.Button.CANCEL:
        Browser.msgBox("検索を中断します。");
        return;
    }

    //127から132まで加筆修正。
    //2つ目以降の検索文字列で空白が入力された場合、エラーメッセージを出力し、処理を中断する。
    if(response3.getResponseText() == "" || response3.getResponseText().toString().indexOf(" ") >= 0 || response3.getResponseText().toString().indexOf("　") >= 0){
      Browser.msgBox("2つ目以降の検索文字列で空白および、半角全角スペースを入力することは許可されていません。検索条件の個数選択からやり直してください。");
      return;
    }

    //今回のプロンプトに入力された値を文字列として可変長配列に格納する。
    inputList[i] = response3.getResponseText();
  }

  //表示用変数に入力値の一覧を入力する。
  for(i = 0; i < text1; i++){
    
    inputValues += inputList[i];
    inputValues += ",";
  }

  //入力値の最終チェックを行う。
  let btnCheckFor_searchValue = Browser.msgBox(inputValues+"検索値は以上でよろしいでしょうか？数値が検索文字列として入力されている場合は数値は社員番号と見なされるので数値以外の検索文字列は無視されます。",btn1);

  switch(btnCheckFor_searchValue){
    case "ok":
      break;
    case "cancel":
      Browser.msgBox("検索を中断します。")
      return;
  }

  //155~169加筆
  let outputPKs = new Array()
  let outputPKsIndex = 0;

  //社員番号が検索文字列に入力された際は、社員番号で求めたいレコードを固定している形にするので、社員番号だけを出力するようにする。
  for(i = 0; i < inputList.length; i++){
    if(isFinite(inputList[i])){
      outputPKs[outputPKsIndex] = inputList[i];
      outputPKsIndex++;
    }
  }

  //社員番号格納配列が存在するならば社員番号格納配列の方を返し、処理を終える。
  if(isFinite(outputPKs[0])){
    return outputPKs;
  }

  return inputList;
}

//検索用メソッドなどから表示用配列（2次元）を受け取ってそれを参照シートに表示するメソッド
function displayRecord(outputList){
  
  //検索が何らかのエラーで中断された場合、処理を終了する。
  if(outputList === undefined){
    return;
  }

  //outputListの1次元の添え字（行数）がいくつあるかをカウントする変数を用意する。
  let outputListRow = 0;

  //outputListの2次元の添え字（列数）がいくつあるかをカウントする変数を用意する。
  let outputListColumn = 0;

  for(i = 0; i < outputList.length; i++){
    //行数分カウントする。
    outputListRow++    
  }

  for(j = 0; j < outputList[0].length; j++){
    //列数分カウントする。
    outputListColumn++;
  }

  console.log(outputListRow);

  console.log(outputListColumn);

  if(outputListColumn == 0){

    return;

  }else{

    //前回の表示エリアを取得。
    var sheet3DisplayBeforeArea = sheet3.getRange(3,2,sheet3.getRange(3,2).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(),sheet3.getRange(3,2).getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn());

    //前回の表示エリアを空白にする。
    sheet3DisplayBeforeArea.setValue("");

    //A列全てのチェックボックスを外す。
    sheet3.getRange(3,1,sheet3.getMaxRows(),1).removeCheckboxes();

    //表示エリアを取得する。列数はチェックボックス表示用に1列多めに範囲を取るので初期値はセルB3
    var sheet3DisplayArea = sheet3.getRange(3,2,outputListRow,outputListColumn);

    //チェックボックス表示範囲を計算して取得し、そこにチェックボックスを表示する。
    sheet3.getRange("A3:A"+(2+outputListRow)).insertCheckboxes();

    //表示エリアに値を表示
    sheet3DisplayArea.setValues(outputList);

    return;
  }
}

//検索メソッド。引数を取る。引数は検索文字列を格納した配列inputListと検索対象シートsheet、戻り値が検索レコード群を格納した配列outputList
//返すレコードがない場合outputListの先頭要素にnullを入れて返す。
function searchValues(inputList,sheet){

  console.log(inputList);

  //結果用配列を準備
  var workSpaceOnsearchValues = new Array();
  var outputList = new Array(workSpaceOnsearchValues);
  
  //戻り値が存在しない(undefined)の場合は、この関数もundefinedを返して、処理を終了する。
  if(inputList === undefined){
    return;
  }

  //検索対象シートにおける検索範囲を戻り値として取得。
  let searchAreaOnsearchValue = decidingSearchArea(sheet);

  //検索エリアが存在しない場合、undefinedを返す。
  if(searchAreaOnsearchValue == null){
    return;
  }

  //検索エリアをログで出す。
  console.log(searchAreaOnsearchValue);


  let indexForOutputList = 0;

  //引数がnullならば全件選択なので全件のレコードをoutputListに格納する。
  if(inputList === null){

    console.log(searchAreaOnsearchValue.sheetSearchArea);

   for(i = 0; i < searchAreaOnsearchValue.sheetLastRow; i++){
    outputList[i] = searchAreaOnsearchValue.sheetSearchArea[i];
   } 
  }else{
    //拡張for文で検索文字列配列の要素を取り出し、それに該当するレコードがあるかを調べてくる。
    //検索文字列が「田中、野村」だった場合に田中さんと野村さんが同時に出る。
    for(let input of inputList){
      for(i = 0; i < searchAreaOnsearchValue.sheetLastRow; i++){
        for(j = 0; j < searchAreaOnsearchValue.sheetLastColumn; j++){
          if(searchAreaOnsearchValue.sheetSearchArea[i][j] == input){

            //検索エリアに該当したレコードを格納する。
            outputList[indexForOutputList] = searchAreaOnsearchValue.sheetSearchArea[i];

            indexForOutputList++;
          }
        }
      }
    }
  }

  for(i = 0; i < outputList.length; i++){
    //出力用配列内のPKにあたる部分をレコードの重複がないかを確かめるために格納する。
    let pk = outputList[i][0];

    //PKの重複判定を行い、PKが重複したレコードを削除する。その際、要素数が繰り上がってくるため、jの値を意図的にデクリメントする。
    for(j = i+1; j < outputList.length; j++){
      if(pk == outputList[j][0]){
        outputList.splice(j,1);
        j--;
      }
    }
  }

  console.log(outputList);

  //戻り値としてoutputListを返す。
  return outputList;
}

//シート内の検索エリアを確定する関数
function decidingSearchArea(sheet){
  let sheetName = sheet.getName();

  if(sheetName == "リスト"){
    //sheet2の最初のレコードのPKの値を取得。これの有無でシート内にレコードがあるかを判定する。
    var sheet2FirstRecordPK = sheet.getRange(2,1);

    

    //シート内にレコードがない場合、処理を終了する。
    if(sheet2FirstRecordPK.isBlank() == true){

      Browser.msgBox("シート内にレコードがないようです。");

      //返すレコードがないのでnullを入れて返す。
      return null;
    }

    //データが存在している範囲の最終行の行番号を取得。
    //-2することでレコードの行数を獲得
    var sheetLastRow = sheet.getRange(1,1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow()-1;

    //データが存在している範囲の最終列の列番号を取得
    var sheetLastColumn = sheet2FirstRecordPK.getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn();

    //参照シート内の検索エリア内のレコードを代入する。（2次元配列）
    var sheetSearchArea = sheet.getRange(2,1,sheetLastRow,sheetLastColumn).getValues();

    //戻り値は該当シートの検索範囲とその行番号と列番号
    return {sheetSearchArea,sheetLastRow,sheetLastColumn};

  }else if(sheetName = "参照"){

    //sheet3の最初のレコードのPKの値を取得。これの有無でシート内にレコードがあるかを判定する。
    var sheet3FirstRecordPK = sheet.getRange(3,2);

    //シート内にレコードがない場合、処理を終了する。
    if(sheet3FirstRecordPK.isBlank() == true){

      Browser.msgBox("シート内にレコードがないようです。");

      //返すレコードがないのでnullを入れて返す。
      return null;
    }

    //データが存在している範囲の最終行の行番号を取得。
    //-2することでレコードの行数を獲得
    var sheetLastRow = sheet.getRange("A2").getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow()-2;

    //データが存在している範囲の最終列の列番号を取得
    var sheetLastColumn = sheet3FirstRecordPK.getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn();

    //参照シート内の検索エリア内のレコードを代入する。（2次元配列）これはチェックボックスも含めたシートのデータをすべて持ってくるので先頭要素にはbooleanの値が入る。
    var sheetSearchArea = sheet.getRange(3,1,sheetLastRow,sheetLastColumn).getValues();

    //戻り値は該当シートの検索範囲と最終行番号と最終列番号
    return {sheetSearchArea,sheetLastRow,sheetLastColumn};
  }
}
