# /*

植物標本データベース
csv-loader.js
=============

*/

"use strict";

## /*

## CSVファイル

*/

const CSV_FILE = "data/specimens.csv";

# /*

# CSV読み込み

*/

function loadCSV() {

```
console.log("Loading CSV:", CSV_FILE);


/*
------------------------------------------------
Papa Parseの確認
------------------------------------------------
*/

if (typeof Papa === "undefined") {

    console.error("Papa is not defined.");

    showCSVError(
        "CSV読み込みライブラリ（Papa Parse）が読み込まれていません。"
    );

    return;
}


/*
------------------------------------------------
CSVを読み込む
------------------------------------------------
*/

Papa.parse(CSV_FILE, {

    download: true,

    header: true,

    skipEmptyLines: true,

    encoding: "UTF-8",


    /*
    --------------------------------------------
    読み込み完了
    --------------------------------------------
    */

    complete: function(results) {

        console.log("Papa Parse completed.");
        console.log("Papa Parse result:", results);


        /*
        ----------------------------------------
        CSVのヘッダーを取得
        ----------------------------------------
        */

        const headers =
            results.meta &&
            results.meta.fields
                ? results.meta.fields
                : [];


        console.log(
            "CSV headers:",
            headers
        );


        /*
        ----------------------------------------
        ヘッダー確認
        ----------------------------------------
        */

        if (headers.length === 0) {

            console.error(
                "CSV header could not be detected."
            );

            console.error(
                "Papa Parse meta:",
                results.meta
            );

            console.error(
                "Papa Parse data:",
                results.data
            );


            showCSVError(
                "CSVファイルの1行目を正しく読み込めませんでした。"
            );

            return;
        }


        /*
        ----------------------------------------
        データ
        ----------------------------------------
        */

        const data = results.data;


        console.log(
            "CSV records:",
            data.length
        );


        /*
        ----------------------------------------
        グローバルに保存
        ----------------------------------------
        */

        window.specimenData = data;

        window.csvHeaders = headers;


        /*
        ----------------------------------------
        検索フォームを生成
        ----------------------------------------
        */

        if (
            typeof generateSearchFields ===
            "function"
        ) {

            generateSearchFields(headers);

        } else {

            console.error(
                "generateSearchFields() is not defined."
            );

        }


        /*
        ----------------------------------------
        DataTablesを初期化
        ----------------------------------------
        */

        if (
            typeof initializeTable ===
            "function"
        ) {

            initializeTable(headers);

        } else {

            console.error(
                "initializeTable() is not defined."
            );

        }


        /*
        ----------------------------------------
        初期状態は0件
        ----------------------------------------
        */

        if (
            typeof updateDataTable ===
            "function"
        ) {

            updateDataTable([]);

        }


        console.log(
            "CSV initialization completed."
        );

    },


    /*
    --------------------------------------------
    エラー
    --------------------------------------------
    */

    error: function(error) {

        console.error(
            "CSV loading error:",
            error
        );


        showCSVError(
            "CSVファイルの読み込みに失敗しました。"
        );

    }

});
```

}

# /*

# CSVエラー表示

*/

function showCSVError(message) {

```
const searchFields =
    document.getElementById(
        "search-fields"
    );


if (searchFields) {

    searchFields.innerHTML =
        '<div class="col-12">' +
        '<div class="alert alert-danger">' +
        escapeErrorText(message) +
        '</div>' +
        '</div>';

}


const count =
    document.getElementById(
        "resultCount"
    );


if (count) {

    count.textContent = "0";

}
```

}

# /*

# エラーメッセージのHTMLエスケープ

*/

function escapeErrorText(value) {

```
return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}
