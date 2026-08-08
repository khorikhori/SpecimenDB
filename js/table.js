 /*
 ==================================================
 植物標本データベース
 table.js

 検索結果の表示・ページング・ソートを担当

 仕様
 --------------------------------------------------
 ・CSVの1行目と同じ順序で列を生成
 ・1ページ 50 / 100件
 ・列見出しクリックでソート
 ・昇順 → 降順 → 昇順
 ・検索前はデータを表示しない
 ・CSV由来の文字列を安全に表示
 ==================================================
 */

"use strict";


/*
--------------------------------------------------
テーブルの状態
--------------------------------------------------
*/

// CSVのヘッダー
let tableHeaders = [];

// 現在の表示データ
let tableData = [];

// 現在のページ
let currentPage = 1;

// 1ページあたりの件数
let currentPageLength = 50;

// ソート対象の列
let currentSortField = null;

// ソート方向
// "asc"  = 昇順
// "desc" = 降順
let currentSortDirection = "asc";


/*
--------------------------------------------------
テーブル初期化
--------------------------------------------------

app.jsから呼び出される。
--------------------------------------------------
*/

function initializeTable(headers) {

    console.log(
        "Initializing table:",
        headers
    );


    /*
    ----------------------------------------------
    ヘッダーを保存
    ----------------------------------------------
    */

    tableHeaders = Array.isArray(headers)
        ? [...headers]
        : [];


    /*
    ----------------------------------------------
    テーブルヘッダー生成
    ----------------------------------------------
    */

    generateTableHeader();


    /*
    ----------------------------------------------
    初期状態
    ----------------------------------------------
    */

    tableData = [];

    currentPage = 1;

    currentSortField = null;

    currentSortDirection = "asc";


    /*
    ----------------------------------------------
    テーブルを空にする
    ----------------------------------------------
    */

    renderTable([]);

}


/*
--------------------------------------------------
テーブルヘッダー生成
--------------------------------------------------
*/

function generateTableHeader() {

    const headerRow =
        document.getElementById(
            "result-header-row"
        );


    if (!headerRow) {

        console.error(
            "#result-header-row が見つかりません。"
        );

        return;

    }


    /*
    ----------------------------------------------
    初期化
    ----------------------------------------------
    */

    headerRow.innerHTML = "";


    /*
    ----------------------------------------------
    CSVヘッダー順に列を作成
    ----------------------------------------------
    */

    tableHeaders.forEach(
        function (header, index) {

            const th =
                document.createElement("th");


            /*
            --------------------------------------
            列名
            --------------------------------------
            */

            th.dataset.field =
                header;


            th.dataset.columnIndex =
                index;


            /*
            --------------------------------------
            クリックでソート
            --------------------------------------
            */

            th.addEventListener(
                "click",
                function () {

                    sortTable(header);

                }
            );


            /*
            --------------------------------------
            表示
            --------------------------------------
            */

            const label =
                document.createElement("span");

            label.className =
                "column-label";

            label.textContent =
                header;


            /*
            --------------------------------------
            ソート記号
            --------------------------------------
            */

            const indicator =
                document.createElement("span");

            indicator.className =
                "sort-indicator";

            indicator.dataset.field =
                header;


            th.appendChild(label);

            th.appendChild(indicator);

            headerRow.appendChild(th);

        }
    );


    updateSortIndicators();

}


/*
--------------------------------------------------
テーブル描画
--------------------------------------------------

data = 検索結果全体

ただしHTMLに実際に生成するのは、
現在のページの50/100件だけ。
--------------------------------------------------
*/

function renderTable(data) {

    console.log(
        "Rendering table:",
        data.length,
        "records"
    );


    /*
    ----------------------------------------------
    データを保存
    ----------------------------------------------
    */

    tableData = Array.isArray(data)
        ? [...data]
        : [];


    /*
    ----------------------------------------------
    1ページ目へ戻す
    ----------------------------------------------
    */

    currentPage = 1;


    /*
    ----------------------------------------------
    ソート状態を維持して並べ替え
    ----------------------------------------------
    */

    applyCurrentSort();


    /*
    ----------------------------------------------
    本文を描画
    ----------------------------------------------
    */

    renderCurrentPage();


    /*
    ----------------------------------------------
    ページングを描画
    ----------------------------------------------
    */

    renderPagination();


    /*
    ----------------------------------------------
    ソート表示
    ----------------------------------------------
    */

    updateSortIndicators();

}


/*
--------------------------------------------------
現在のページを描画
--------------------------------------------------
*/

function renderCurrentPage() {

    const tbody =
        document.getElementById(
            "result-body"
        );


    if (!tbody) {

        console.error(
            "#result-body が見つかりません。"
        );

        return;

    }


    /*
    ----------------------------------------------
    初期化
    ----------------------------------------------
    */

    tbody.innerHTML = "";


    /*
    ----------------------------------------------
    データがない場合
    ----------------------------------------------
    */

    if (tableData.length === 0) {

        const tr =
            document.createElement("tr");


        const td =
            document.createElement("td");


        td.className =
            "no-results";


        td.colSpan =
            Math.max(tableHeaders.length, 1);


        td.textContent =
            "検索結果はありません。";


        tr.appendChild(td);

        tbody.appendChild(tr);

        return;

    }


    /*
    ----------------------------------------------
    ページ範囲
    ----------------------------------------------
    */

    const startIndex =
        (currentPage - 1) *
        currentPageLength;


    const endIndex =
        Math.min(
            startIndex + currentPageLength,
            tableData.length
        );


    /*
    ----------------------------------------------
    現在のページだけ描画
    ----------------------------------------------
    */

    for (
        let i = startIndex;
        i < endIndex;
        i++
    ) {

        const row =
            tableData[i];


        const tr =
            document.createElement("tr");


        tableHeaders.forEach(
            function (header) {

                const td =
                    document.createElement("td");


                /*
                ----------------------------------
                CSVの値
                ----------------------------------
                */

                let value =
                    row[header];


                if (
                    value === null ||
                    value === undefined
                ) {

                    value = "";

                }


                /*
                ----------------------------------
                textContentで表示
                ----------------------------------

                innerHTMLを使わないことで、
                CSVにHTMLタグが入っていても
                HTMLとして実行されない。
                ----------------------------------
                */

                td.textContent =
                    String(value);


                tr.appendChild(td);

            }
        );


        tbody.appendChild(tr);

    }

}


/*
--------------------------------------------------
ソート
--------------------------------------------------
*/

function sortTable(field) {

    console.log(
        "Sorting:",
        field
    );


    /*
    ----------------------------------------------
    同じ列をクリック
    ----------------------------------------------
    */

    if (currentSortField === field) {

        if (
            currentSortDirection === "asc"
        ) {

            currentSortDirection = "desc";

        } else {

            currentSortDirection = "asc";

        }

    } else {

        /*
        ------------------------------------------
        新しい列
        ------------------------------------------
        */

        currentSortField = field;

        currentSortDirection = "asc";

    }


    /*
    ----------------------------------------------
    並び替え
    ----------------------------------------------
    */

    applyCurrentSort();


    /*
    ----------------------------------------------
    1ページ目へ
    ----------------------------------------------
    */

    currentPage = 1;


    /*
    ----------------------------------------------
    再描画
    ----------------------------------------------
    */

    renderCurrentPage();

    renderPagination();

    updateSortIndicators();

}


/*
--------------------------------------------------
現在のソート条件を適用
--------------------------------------------------
*/

function applyCurrentSort() {

    if (
        !currentSortField ||
        tableData.length <= 1
    ) {

        return;

    }


    const field =
        currentSortField;


    const direction =
        currentSortDirection;


    tableData.sort(
        function (a, b) {

            const valueA =
                a[field] === null ||
                a[field] === undefined
                    ? ""
                    : String(a[field]);


            const valueB =
                b[field] === null ||
                b[field] === undefined
                    ? ""
                    : String(b[field]);


            /*
            --------------------------------------
            空欄の扱い
            --------------------------------------
            */

            if (
                valueA === "" &&
                valueB === ""
            ) {

                return 0;

            }

            if (valueA === "") {

                return 1;

            }

            if (valueB === "") {

                return -1;

            }


            /*
            --------------------------------------
            数値として比較できる場合
            --------------------------------------
            */

            const numberA =
                Number(valueA);

            const numberB =
                Number(valueB);


            if (
                !Number.isNaN(numberA) &&
                !Number.isNaN(numberB)
            ) {

                return direction === "asc"
                    ? numberA - numberB
                    : numberB - numberA;

            }


            /*
            --------------------------------------
            日付
            --------------------------------------

            採集日の場合は、
            yyyy/mm/dd を正しく比較する。
            --------------------------------------
            */

            if (field === "採集日") {

                const dateA =
                    parseDateForSort(valueA);

                const dateB =
                    parseDateForSort(valueB);


                if (
                    dateA !== null &&
                    dateB !== null
                ) {

                    return direction === "asc"
                        ? dateA - dateB
                        : dateB - dateA;

                }

            }


            /*
            --------------------------------------
            通常の文字列比較
            --------------------------------------
            */

            const comparison =
                valueA.localeCompare(
                    valueB,
                    "ja",
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );


            return direction === "asc"
                ? comparison
                : -comparison;

        }
    );

}


/*
--------------------------------------------------
日付をソート用数値に変換
--------------------------------------------------
*/

function parseDateForSort(value) {

    const text =
        String(value).trim();


    const match =
        text.match(
            /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/
        );


    if (!match) {

        return null;

    }


    const year =
        Number(match[1]);

    const month =
        Number(match[2]);

    const day =
        Number(match[3]);


    const date =
        new Date(
            year,
            month - 1,
            day
        );


    /*
    ----------------------------------------------
    不正な日付
    ----------------------------------------------
    */

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {

        return null;

    }


    return date.getTime();

}


/*
--------------------------------------------------
ソート記号を更新
--------------------------------------------------
*/

function updateSortIndicators() {

    const indicators =
        document.querySelectorAll(
            ".sort-indicator"
        );


    indicators.forEach(
        function (indicator) {

            const field =
                indicator.dataset.field;


            if (
                field === currentSortField
            ) {

                if (
                    currentSortDirection === "asc"
                ) {

                    indicator.textContent =
                        " ▲";

                } else {

                    indicator.textContent =
                        " ▼";

                }

            } else {

                indicator.textContent =
                    "";

            }

        }
    );

}


/*
--------------------------------------------------
ページング
--------------------------------------------------
*/

function renderPagination() {

    const pagination =
        document.getElementById(
            "pagination"
        );


    if (!pagination) {

        console.error(
            "#pagination が見つかりません。"
        );

        return;

    }


    /*
    ----------------------------------------------
    初期化
    ----------------------------------------------
    */

    pagination.innerHTML = "";


    /*
    ----------------------------------------------
    ページ数
    ----------------------------------------------
    */

    const totalPages =
        Math.ceil(
            tableData.length /
            currentPageLength
        );


    /*
    ----------------------------------------------
    ページが不要
    ----------------------------------------------
    */

    if (totalPages <= 1) {

        return;

    }


    /*
    ----------------------------------------------
    前へ
    ----------------------------------------------
    */

    const previousButton =
        createPageButton(
            "?",
            currentPage - 1,
            currentPage === 1
        );


    pagination.appendChild(
        previousButton
    );


    /*
    ----------------------------------------------
    ページ番号
    ----------------------------------------------
    */

    const pages =
        getVisiblePages(
            currentPage,
            totalPages
        );


    pages.forEach(
        function (page) {

            if (page === "...") {

                const span =
                    document.createElement("span");

                span.textContent =
                    "…";

                span.style.padding =
                    "0 5px";

                pagination.appendChild(span);

                return;

            }


            const button =
                createPageButton(
                    String(page),
                    page,
                    false
                );


            if (page === currentPage) {

                button.classList.add(
                    "active"
                );

            }


            pagination.appendChild(
                button
            );

        }
    );


    /*
    ----------------------------------------------
    次へ
    ----------------------------------------------
    */

    const nextButton =
        createPageButton(
            "?",
            currentPage + 1,
            currentPage === totalPages
        );


    pagination.appendChild(
        nextButton
    );

}


/*
--------------------------------------------------
表示するページ番号を取得
--------------------------------------------------
*/

function getVisiblePages(
    current,
    total
) {

    /*
    ----------------------------------------------
    ページ数が少ない場合
    ----------------------------------------------
    */

    if (total <= 7) {

        const pages = [];

        for (
            let i = 1;
            i <= total;
            i++
        ) {

            pages.push(i);

        }

        return pages;

    }


    const pages = [];


    /*
    ----------------------------------------------
    最初
    ----------------------------------------------
    */

    pages.push(1);


    /*
    ----------------------------------------------
    左側の省略
    ----------------------------------------------
    */

    if (current > 4) {

        pages.push("...");

    }


    /*
    ----------------------------------------------
    現在位置周辺
    ----------------------------------------------
    */

    const start =
        Math.max(
            2,
            current - 1
        );


    const end =
        Math.min(
            total - 1,
            current + 1
        );


    for (
        let i = start;
        i <= end;
        i++
    ) {

        pages.push(i);

    }


    /*
    ----------------------------------------------
    右側の省略
    ----------------------------------------------
    */

    if (current < total - 3) {

        pages.push("...");

    }


    /*
    ----------------------------------------------
    最後
    ----------------------------------------------
    */

    pages.push(total);


    return pages;

}


/*
--------------------------------------------------
ページボタン生成
--------------------------------------------------
*/

function createPageButton(
    text,
    page,
    disabled
) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.textContent =
        text;


    button.disabled =
        disabled;


    button.addEventListener(
        "click",
        function () {

            if (disabled) {

                return;

            }


            if (
                page < 1 ||
                page >
                Math.ceil(
                    tableData.length /
                    currentPageLength
                )
            ) {

                return;

            }


            currentPage =
                page;


            renderCurrentPage();

            renderPagination();

            /*
            ページ移動時に
            結果表の先頭へ戻す。
            */

            const resultSection =
                document.getElementById(
                    "result-section"
                );


            if (resultSection) {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );


    return button;

}


/*
--------------------------------------------------
表示件数変更
--------------------------------------------------

app.jsから呼び出される。
--------------------------------------------------
*/

function changePageLength(length) {

    /*
    ----------------------------------------------
    50 / 100 以外を防止
    ----------------------------------------------
    */

    if (
        length !== 50 &&
        length !== 100
    ) {

        length = 50;

    }


    currentPageLength =
        length;


    /*
    ----------------------------------------------
    1ページ目へ
    ----------------------------------------------
    */

    currentPage = 1;


    /*
    ----------------------------------------------
    再描画
    ----------------------------------------------
    */

    renderCurrentPage();

    renderPagination();

}