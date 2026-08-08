/*
==================================================
植物標本データベース
app.js

アプリケーション全体の起動・初期化を管理
==================================================
*/

"use strict";


/*
--------------------------------------------------
グローバルなデータ
--------------------------------------------------
*/

// CSVから読み込んだ全データ
let specimenData = [];

// CSVのヘッダー
let csvHeaders = [];

// 現在の検索結果
let filteredData = [];


/*
--------------------------------------------------
アプリケーション開始
--------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", function () {

    console.log("Specimen Database start");

    initializeApp();

});


/*
--------------------------------------------------
アプリケーション初期化
--------------------------------------------------
*/

function initializeApp() {

    console.log("Initializing application...");

    /*
    ----------------------------------------------
    CSV読み込み
    ----------------------------------------------
    */

    if (typeof loadCSV === "function") {

        loadCSV();

    } else {

        console.error(
            "loadCSV() が見つかりません。csv-loader.jsを確認してください。"
        );

    }


    /*
    ----------------------------------------------
    検索フォーム
    ----------------------------------------------
    */

    const searchForm = document.getElementById("search-form");

    if (searchForm) {

        searchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            console.log("Search button clicked");

            if (typeof executeSearch === "function") {

                executeSearch();

            } else {

                console.error(
                    "executeSearch() が見つかりません。search.jsを確認してください。"
                );

            }

        });

    }


    /*
    ----------------------------------------------
    リセットボタン
    ----------------------------------------------
    */

    const resetButton = document.getElementById("reset-button");

    if (resetButton) {

        resetButton.addEventListener("click", function () {

            console.log("Reset button clicked");

            if (typeof resetSearch === "function") {

                resetSearch();

            } else {

                console.error(
                    "resetSearch() が見つかりません。search.jsを確認してください。"
                );

            }

        });

    }


    /*
    ----------------------------------------------
    表示件数変更
    ----------------------------------------------
    */

    const pageLength = document.getElementById("page-length");

    if (pageLength) {

        pageLength.addEventListener("change", function () {

            console.log(
                "Page length changed:",
                pageLength.value
            );

            /*
            検索結果が存在する場合、
            表示ページを1ページ目に戻して再描画する。
            */

            if (typeof changePageLength === "function") {

                changePageLength(
                    Number(pageLength.value)
                );

            }

        });

    }


    console.log("Application initialized");

}


/*
--------------------------------------------------
CSV読み込み完了後に呼び出す関数
--------------------------------------------------

csv-loader.jsから呼び出す。
--------------------------------------------------
*/

function onCSVLoaded(data, headers) {

    console.log("CSV loaded");

    console.log(
        "Number of records:",
        data.length
    );

    console.log(
        "CSV headers:",
        headers
    );


    /*
    ----------------------------------------------
    グローバルデータを保存
    ----------------------------------------------
    */

    specimenData = data;

    csvHeaders = headers;


    /*
    ----------------------------------------------
    検索フォーム生成
    ----------------------------------------------
    */

    if (typeof generateSearchFields === "function") {

        generateSearchFields(headers);

    } else {

        console.error(
            "generateSearchFields() が見つかりません。"
        );

    }


    /*
    ----------------------------------------------
    結果テーブルのヘッダー生成
    ----------------------------------------------
    */

    if (typeof initializeTable === "function") {

        initializeTable(headers);

    } else {

        console.error(
            "initializeTable() が見つかりません。"
        );

    }


    /*
    ----------------------------------------------
    初期状態
    ----------------------------------------------

    CSVを読み込んだだけでは、
    全データを表示しない。
    */

    filteredData = [];

    if (typeof renderTable === "function") {

        renderTable([]);

    }


    /*
    ----------------------------------------------
    検索結果件数
    ----------------------------------------------
    */

    updateResultCount(0);


    console.log(
        "CSV initialization completed"
    );

}


/*
--------------------------------------------------
検索結果件数を更新
--------------------------------------------------
*/

function updateResultCount(count) {

    const resultCount =
        document.getElementById("result-count");

    if (!resultCount) {

        return;

    }


    resultCount.textContent =
        "検索結果：" + count.toLocaleString() + "件";

}


/*
--------------------------------------------------
検索結果を保存
--------------------------------------------------
*/

function setFilteredData(data) {

    filteredData = Array.isArray(data)
        ? data
        : [];

}


/*
--------------------------------------------------
現在の検索結果を取得
--------------------------------------------------
*/

function getFilteredData() {

    return filteredData;

}


/*
--------------------------------------------------
CSVデータを取得
--------------------------------------------------
*/

function getSpecimenData() {

    return specimenData;

}


/*
--------------------------------------------------
CSVヘッダーを取得
--------------------------------------------------
*/

function getCSVHeaders() {

    return csvHeaders;

}