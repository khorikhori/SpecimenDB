/*
==================================================
植物標本データベース
csv-loader.js

CSVファイルの読み込みを担当

CSV:
UTF-8
カンマ区切り
1行目 = ヘッダー
==================================================
*/

"use strict";


/*
--------------------------------------------------
CSVファイルの場所
--------------------------------------------------
*/

const CSV_FILE = "data/specimens.csv";


/*
--------------------------------------------------
CSV読み込み
--------------------------------------------------
*/

function loadCSV() {

    console.log("Loading CSV...");

    Papa.parse(CSV_FILE, {

        /*
        ------------------------------------------
        CSVの1行目を項目名として扱う
        ------------------------------------------
        */

        header: true,


        /*
        ------------------------------------------
        空行を無視
        ------------------------------------------
        */

        skipEmptyLines: true,


        /*
        ------------------------------------------
        UTF-8
        ------------------------------------------
        */

        encoding: "UTF-8",


        /*
        ------------------------------------------
        読み込み完了
        ------------------------------------------
        */

        complete: function (results) {

            console.log("CSV loading completed");


            /*
            --------------------------------------
            エラー確認
            --------------------------------------
            */

            if (results.errors && results.errors.length > 0) {

                console.warn(
                    "CSV parsing warnings:",
                    results.errors
                );

            }


            /*
            --------------------------------------
            データ取得
            --------------------------------------
            */

            const data = results.data;


            /*
            --------------------------------------
            ヘッダー取得
            --------------------------------------

            Papa Parseで取得したデータの
            最初のオブジェクトからキーを取得する。

            ただし、データが0件の場合に備える。
            --------------------------------------
            */

            let headers = [];


            if (
                data.length > 0 &&
                data[0] &&
                typeof data[0] === "object"
            ) {

                headers = Object.keys(data[0]);

            }


            /*
            --------------------------------------
            ヘッダー確認
            --------------------------------------
            */

            console.log(
                "CSV headers:",
                headers
            );


            /*
            --------------------------------------
            データ件数確認
            --------------------------------------
            */

            console.log(
                "CSV records:",
                data.length
            );


            /*
            --------------------------------------
            ヘッダーがない場合
            --------------------------------------
            */

            if (headers.length === 0) {

                showCSVError(
                    "CSVファイルに項目がありません。"
                );

                return;

            }


            /*
            --------------------------------------
            空のヘッダーをチェック
            --------------------------------------
            */

            const emptyHeader = headers.some(
                function (header) {

                    return (
                        header === null ||
                        header === undefined ||
                        header.trim() === ""
                    );

                }
            );


            if (emptyHeader) {

                showCSVError(
                    "CSVの1行目に空の項目名があります。"
                );

                return;

            }


            /*
            --------------------------------------
            重複したヘッダーをチェック
            --------------------------------------
            */

            const uniqueHeaders = new Set(headers);


            if (uniqueHeaders.size !== headers.length) {

                showCSVError(
                    "CSVの1行目に重複した項目名があります。"
                );

                return;

            }


            /*
            --------------------------------------
            app.jsへ渡す
            --------------------------------------

            onCSVLoaded() はapp.jsで定義する。
            --------------------------------------
            */

            if (typeof onCSVLoaded === "function") {

                onCSVLoaded(data, headers);

            } else {

                console.error(
                    "onCSVLoaded() が見つかりません。"
                );

            }

        },


        /*
        ------------------------------------------
        ファイル読み込みエラー
        ------------------------------------------
        */

        error: function (error) {

            console.error(
                "CSV loading error:",
                error
            );


            showCSVError(
                "CSVファイルを読み込めませんでした。"
            );

        }

    });

}


/*
--------------------------------------------------
CSVエラー表示
--------------------------------------------------
*/

function showCSVError(message) {

    console.error(message);


    /*
    ----------------------------------------------
    検索フォーム
    ----------------------------------------------
    */

    const searchFields =
        document.getElementById("search-fields");

    if (searchFields) {

        searchFields.innerHTML = "";

    }


    /*
    ----------------------------------------------
    結果件数
    ----------------------------------------------
    */

    const resultCount =
        document.getElementById("result-count");

    if (resultCount) {

        resultCount.textContent =
            "データを読み込めませんでした";

    }


    /*
    ----------------------------------------------
    結果テーブル
    ----------------------------------------------
    */

    const resultBody =
        document.getElementById("result-body");

    if (resultBody) {

        resultBody.innerHTML = `
            <tr>
                <td class="no-results">
                    ${escapeHTML(message)}
                </td>
            </tr>
        `;

    }

}


/*
--------------------------------------------------
HTMLエスケープ
--------------------------------------------------

CSV由来の文字列をHTMLに直接入れる場合に、
HTMLタグとして解釈されることを防ぐ。

この関数は後でtable.jsなどからも
使用できるようにグローバル関数にしておく。
--------------------------------------------------
*/

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}