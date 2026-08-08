# /*

植物標本データベース
csv-loader.js

CSV読み込み担当

## 仕様

・UTF-8 CSV
・カンマ区切り
・1行目をヘッダーとして使用
・CSVのヘッダー順をそのまま維持
・全データを window.specimenData に保存
・ヘッダーを window.csvHeaders に保存
・検索フォームをCSVから自動生成
・DataTablesを初期化
===============

*/

"use strict";

# /*

# CSVファイル

*/

const CSV_FILE =
"data/specimens.csv";

# /*

# CSV読み込み

*/

function loadCSV() {

```
console.log(
    "Loading CSV:",
    CSV_FILE
);


/*
----------------------------------------------
Papa Parseが読み込まれているか確認
----------------------------------------------
*/

if (
    typeof Papa === "undefined"
) {

    console.error(
        "Papa Parse is not loaded."
    );

    showCSVError(
        "CSV読み込みライブラリ（Papa Parse）が読み込まれていません。"
    );

    return;

}


/*
----------------------------------------------
CSV読み込み
----------------------------------------------
*/

Papa.parse(
    CSV_FILE,
    {

        /*
        --------------------------------------
        1行目をヘッダーとして扱う
        --------------------------------------
        */

        header: true,


        /*
        --------------------------------------
        空行を無視
        --------------------------------------
        */

        skipEmptyLines: true,


        /*
        --------------------------------------
        UTF-8
        --------------------------------------
        */

        encoding: "UTF-8",


        /*
        --------------------------------------
        ダウンロード完了
        --------------------------------------
        */

        download: true,


        /*
        --------------------------------------
        完了
        --------------------------------------
        */

        complete: function (
            results
        ) {

            handleCSVResult(
                results
            );

        },


        /*
        --------------------------------------
        エラー
        --------------------------------------
        */

        error: function (
            error
        ) {

            console.error(
                "CSV loading error:",
                error
            );


            showCSVError(
                "CSVファイルの読み込みに失敗しました。"
            );

        }

    }
);
```

}

# /*

# CSV結果処理

*/

function handleCSVResult(
results
) {

```
console.log(
    "CSV parsing completed."
);


/*
----------------------------------------------
Papa Parseエラー確認
----------------------------------------------
*/

if (
    results.errors &&
    results.errors.length > 0
) {

    console.warn(
        "CSV parsing warnings/errors:",
        results.errors
    );

}


/*
----------------------------------------------
データ取得
----------------------------------------------
*/

const data =
    results.data;


/*
----------------------------------------------
データの存在確認
----------------------------------------------
*/

if (
    !Array.isArray(data) ||
    data.length === 0
) {

    console.error(
        "CSV contains no records."
    );


    showCSVError(
        "CSVファイルにデータがありません。"
    );

    return;

}


/*
----------------------------------------------
ヘッダー取得
----------------------------------------------
*/

const firstRow =
    data[0];


if (
    !firstRow ||
    typeof firstRow !== "object"
) {

    console.error(
        "CSV first row is invalid."
    );


    showCSVError(
        "CSVの1行目を読み込めませんでした。"
    );

    return;

}


const headers =
    Object.keys(firstRow);


/*
----------------------------------------------
ヘッダー数確認
----------------------------------------------
*/

if (
    headers.length === 0
) {

    console.error(
        "CSV has no headers."
    );


    showCSVError(
        "CSVファイルに項目がありません。"
    );

    return;

}


/*
----------------------------------------------
グローバル変数へ保存
----------------------------------------------
*/

window.specimenData =
    data;

window.csvHeaders =
    headers;


/*
----------------------------------------------
デバッグ情報
----------------------------------------------
*/

console.log(
    "CSV headers:",
    headers
);


console.log(
    "CSV records:",
    data.length
);


/*
----------------------------------------------
各行の項目数を確認
----------------------------------------------
*/

validateCSVRows(
    data,
    headers
);


/*
----------------------------------------------
検索フォーム生成
----------------------------------------------
*/

if (
    typeof generateSearchFields ===
    "function"
) {

    generateSearchFields(
        headers
    );

} else {

    console.error(
        "generateSearchFields() が見つかりません。"
    );

}


/*
----------------------------------------------
DataTables初期化
----------------------------------------------
*/

if (
    typeof initializeTable ===
    "function"
) {

    initializeTable(
        headers
    );

} else {

    console.error(
        "initializeTable() が見つかりません。"
    );

}


/*
----------------------------------------------
初期状態
----------------------------------------------

検索前なので0件。
----------------------------------------------
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
```

}

# /*

# CSV各行の項目数チェック

*/

function validateCSVRows(
data,
headers
) {

```
const expectedCount =
    headers.length;


let invalidRows = 0;


data.forEach(
    function (
        row,
        index
    ) {

        const count =
            Object.keys(row).length;


        if (
            count !== expectedCount
        ) {

            invalidRows++;


            console.warn(
                "CSV row has unexpected number of fields:",
                index + 2,
                count,
                "expected:",
                expectedCount,
                row
            );

        }

    }
);


if (
    invalidRows > 0
) {

    console.warn(
        "CSV validation:",
        invalidRows,
        "rows have unexpected field counts."
    );

} else {

    console.log(
        "CSV validation passed:",
        expectedCount,
        "fields ×",
        data.length,
        "records"
    );

}
```

}

# /*

# CSVエラー表示

*/

function showCSVError(
message
) {

```
/*
----------------------------------------------
検索フォーム
----------------------------------------------
*/

const searchFields =
    document.getElementById(
        "search-fields"
    );


if (searchFields) {

    searchFields.innerHTML =
        '<div class="col-12">' +
        '<div class="alert alert-danger">' +
        escapeCSVErrorHTML(message) +
        "</div>" +
        "</div>";

}


/*
----------------------------------------------
結果件数
----------------------------------------------
*/

const count =
    document.getElementById(
        "resultCount"
    );


if (count) {

    count.textContent =
        "0";

}
```

}

# /*

# エラーメッセージ用HTMLエスケープ

*/

function escapeCSVErrorHTML(
value
) {

```
return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}
