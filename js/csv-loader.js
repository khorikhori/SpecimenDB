"use strict";

# /*

植物標本データベース
csv-loader.js
=============

*/

const CSV_FILE = "data/specimens.csv";

# /*

# CSV読み込み

*/

async function loadCSV() {

```
console.log("=================================");
console.log("CSV loading started");
console.log("CSV file:", CSV_FILE);
console.log("=================================");


/*
----------------------------------------------
Papa Parse確認
----------------------------------------------
*/

if (typeof Papa === "undefined") {

    console.error("Papa is not defined.");

    showCSVError(
        "CSV読み込みライブラリ（Papa Parse）が読み込まれていません。"
    );

    return;
}


try {

    /*
    ------------------------------------------
    CSVファイルを取得
    ------------------------------------------
    */

    const response = await fetch(
        CSV_FILE,
        {
            cache: "no-store"
        }
    );


    console.log(
        "CSV HTTP status:",
        response.status
    );


    console.log(
        "CSV response OK:",
        response.ok
    );


    /*
    ------------------------------------------
    HTTPエラー
    ------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            "HTTP error: " +
            response.status +
            " " +
            response.statusText
        );

    }


    /*
    ------------------------------------------
    CSVをテキストとして取得
    ------------------------------------------
    */

    const csvText =
        await response.text();


    console.log(
        "CSV text length:",
        csvText.length
    );


    /*
    ------------------------------------------
    CSV先頭部分を確認
    ------------------------------------------

    デバッグ用です。
    ------------------------------------------
    */

    console.log(
        "CSV first 200 characters:",
        csvText.substring(0, 200)
    );


    /*
    ------------------------------------------
    CSVが空か確認
    ------------------------------------------
    */

    if (
        csvText.trim() === ""
    ) {

        throw new Error(
            "CSV file is empty."
        );

    }


    /*
    ------------------------------------------
    Papa Parse
    ------------------------------------------
    */

    const results =
        Papa.parse(
            csvText,
            {

                header: true,

                skipEmptyLines: true,

                encoding: "UTF-8"

            }
        );


    /*
    ------------------------------------------
    Papa Parse結果
    ------------------------------------------
    */

    console.log(
        "Papa Parse result:",
        results
    );


    console.log(
        "Papa Parse errors:",
        results.errors
    );


    console.log(
        "Papa Parse meta:",
        results.meta
    );


    console.log(
        "Papa Parse data:",
        results.data
    );


    /*
    ------------------------------------------
    Papa Parseエラー
    ------------------------------------------
    */

    if (
        results.errors &&
        results.errors.length > 0
    ) {

        console.warn(
            "CSV parsing warnings:",
            results.errors
        );

    }


    /*
    ------------------------------------------
    ヘッダー
    ------------------------------------------
    */

    const headers =
        results.meta &&
        Array.isArray(results.meta.fields)
            ? results.meta.fields
            : [];


    console.log(
        "CSV headers:",
        headers
    );


    /*
    ------------------------------------------
    ヘッダーがない場合
    ------------------------------------------
    */

    if (
        headers.length === 0
    ) {

        console.error(
            "CSV headers could not be detected."
        );


        showCSVError(
            "CSVファイルの1行目を正しく読み込めませんでした。"
        );


        return;

    }


    /*
    ------------------------------------------
    データ
    ------------------------------------------
    */

    const data =
        Array.isArray(results.data)
            ? results.data
            : [];


    console.log(
        "CSV records:",
        data.length
    );


    /*
    ------------------------------------------
    グローバル変数
    ------------------------------------------
    */

    window.specimenData =
        data;

    window.csvHeaders =
        headers;


    /*
    ------------------------------------------
    検索フォーム
    ------------------------------------------
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
            "generateSearchFields() is not defined."
        );

    }


    /*
    ------------------------------------------
    DataTables
    ------------------------------------------
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
            "initializeTable() is not defined."
        );

    }


    /*
    ------------------------------------------
    検索前は0件
    ------------------------------------------
    */

    if (
        typeof updateDataTable ===
        "function"
    ) {

        updateDataTable([]);

    }


    console.log("=================================");
    console.log("CSV initialization completed");
    console.log("=================================");


} catch (error) {

    console.error(
        "CSV loading failed:",
        error
    );


    showCSVError(
        "CSVファイルの読み込みに失敗しました。"
    );

}
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

# HTMLエスケープ

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
