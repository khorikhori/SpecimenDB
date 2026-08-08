# /*

植物標本データベース
table.js

DataTablesによる結果表示を担当

## 仕様

・CSVのヘッダー順に列を生成
・検索前は0件
・検索結果のみ表示
・1ページ 50 / 100件
・列クリックで昇順 / 降順
・レスポンシブ対応
・CSVの内容をHTMLとして解釈しない
====================

*/

"use strict";

# /*

# DataTables本体

*/

let specimenTable = null;

# /*

# DataTables初期化

*/

/**

* DataTablesを初期化する
*
* @param {Array} headers CSVヘッダー
  */
  function initializeTable(headers) {

  console.log(
  "Initializing DataTables..."
  );

  ## /*

  ## 既存のDataTablesがあれば破棄

  */

  if (
  specimenTable !== null &&
  $.fn.DataTable.isDataTable(
  "#specimenTable"
  )
  ) {

  ```
   specimenTable.destroy();

   specimenTable = null;
  ```

  }

  ## /*

  ## CSVヘッダーから列定義を作成

  */

  const columns =
  headers.map(function (header) {

  ```
       return {

           data: header,

           title: header,

           defaultContent: "",

           render: function (
               data,
               type
           ) {

               /*
               ----------------------------------
               ソートなどDataTables内部処理では
               元の値をそのまま返す。
               ----------------------------------
               */

               if (
                   type === "sort" ||
                   type === "type"
               ) {

                   return data ?? "";

               }


               /*
               ----------------------------------
               表示時
               ----------------------------------

               textとして返すことで、
               CSV内のHTML文字列などを
               HTMLとして実行させない。
               ----------------------------------
               */

               return escapeHTML(
                   data ?? ""
               );

           }

       };

   });
  ```

  ## /*

  ## DataTables初期化

  */

  specimenTable =
  new DataTable(
  "#specimenTable",
  {

  ```
           /*
           ----------------------------------
           初期データ

           検索前は空
           ----------------------------------
           */

           data: [],


           /*
           ----------------------------------
           列
           ----------------------------------
           */

           columns: columns,


           /*
           ----------------------------------
           ページング
           ----------------------------------
           */

           paging: true,


           /*
           ----------------------------------
           初期表示件数
           ----------------------------------
           */

           pageLength: 50,


           /*
           ----------------------------------
           50 / 100
           ----------------------------------
           */

           lengthMenu: [
               [50, 100],
               [50, 100]
           ],


           /*
           ----------------------------------
           DataTables標準検索を非表示
           ----------------------------------

           検索はsearch.jsで行う。
           ----------------------------------
           */

           searching: false,


           /*
           ----------------------------------
           件数表示
           ----------------------------------
           */

           info: true,


           /*
           ----------------------------------
           ページング
           ----------------------------------
           */

           pagingType:
               "full_numbers",


           /*
           ----------------------------------
           横幅
           ----------------------------------
           */

           autoWidth: false,


           /*
           ----------------------------------
           レスポンシブ
           ----------------------------------
           */

           responsive: true,


           /*
           ----------------------------------
           ソート
           ----------------------------------

           初期状態ではCSV順を維持。
           ----------------------------------
           */

           order: [],


           /*
           ----------------------------------
           日本語表示
           ----------------------------------
           */

           language: {

               emptyTable:
                   "検索結果はありません",

               info:
                   "_TOTAL_ 件中 _START_ ～ _END_ 件を表示",

               infoEmpty:
                   "0 件",

               infoFiltered:
                   "",

               lengthMenu:
                   "_MENU_ 件表示",

               loadingRecords:
                   "読み込み中...",

               processing:
                   "処理中...",

               zeroRecords:
                   "検索結果はありません",

               paginate: {

                   first: "最初",

                   last: "最後",

                   next: "次へ",

                   previous: "前へ"

               }

           }

       }
   );
  ```

  console.log(
  "DataTables initialized."
  );

}

# /*

# 検索結果をDataTablesへ渡す

*/

/**

* search.jsから呼び出される
*
* @param {Array} results 検索結果
  */
  function updateDataTable(results) {

  ## /*

  ## DataTablesが初期化されているか確認

  */

  if (specimenTable === null) {

  ```
   console.error(
       "DataTablesが初期化されていません。"
   );

   return;
  ```

  }

  ## /*

  ## データ更新

  */

  specimenTable
  .clear()
  .rows
  .add(results)
  .draw();

  ## /*

  ## 先頭ページへ

  */

  specimenTable.page("first").draw("page");

  console.log(
  "DataTables updated:",
  results.length,
  "records"
  );

}

# /*

# DataTablesを空にする

*/

function clearDataTable() {

```
if (specimenTable === null) {

    return;

}


specimenTable
    .clear()
    .draw();
```

}

# /*

# 表示件数を変更

*/

/**

* 必要になった場合に外部から
* 50 / 100件を変更するための関数
*
* @param {Number} length 表示件数
  */
  function setPageLength(length) {

  if (
  length !== 50 &&
  length !== 100
  ) {

  ```
   return;
  ```

  }

  if (specimenTable === null) {

  ```
   return;
  ```

  }

  specimenTable
  .page
  .len(length)
  .draw();

}

# /*

# CSVヘッダーからテーブルを再構築

*/

/**

* CSVを再読み込みした場合などに使用する。
*
* @param {Array} headers CSVヘッダー
  */
  function rebuildDataTable(headers) {

  console.log(
  "Rebuilding DataTables..."
  );

  initializeTable(headers);

}

# /*

# HTMLエスケープ

CSVに以下のような文字列が入っていても、

<script>alert("test")</script>

# HTMLとして実行されないようにする。

*/

function escapeHTML(value) {

```
if (
    value === null ||
    value === undefined
) {

    return "";

}


return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}
