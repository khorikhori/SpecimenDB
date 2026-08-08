/*
==================================================
植物標本データベース
search.js

検索処理を担当

検索仕様
--------------------------------------------------
・複数項目を入力した場合 → AND
・各項目につきキーワードは1つ
・「学名」 → 属名を完全一致
・その他の項目 → 部分一致
・「採集日」 → 日付を正規化して比較
==================================================
*/

"use strict";


/*
--------------------------------------------------
検索処理
--------------------------------------------------
*/

function executeSearch() {

    console.log("Executing search...");


    /*
    ----------------------------------------------
    CSVデータを取得
    ----------------------------------------------
    */

    const data = getSpecimenData();

    const headers = getCSVHeaders();


    if (!Array.isArray(data)) {

        console.error("CSVデータがありません。");

        return;

    }


    if (!Array.isArray(headers)) {

        console.error("CSVヘッダーがありません。");

        return;

    }


    /*
    ----------------------------------------------
    検索条件を取得
    ----------------------------------------------
    */

    const conditions = getSearchConditions(headers);


    console.log(
        "Search conditions:",
        conditions
    );


    /*
    ----------------------------------------------
    検索条件が1つもない場合
    ----------------------------------------------
    */

    if (conditions.length === 0) {

        console.log(
            "No search conditions."
        );


        setFilteredData([]);


        updateResultCount(0);


        if (typeof renderTable === "function") {

            renderTable([]);

        }


        return;

    }


    /*
    ----------------------------------------------
    データを検索
    ----------------------------------------------
    */

    const results = data.filter(
        function (row) {

            return matchesAllConditions(
                row,
                conditions
            );

        }
    );


    /*
    ----------------------------------------------
    検索結果を保存
    ----------------------------------------------
    */

    setFilteredData(results);


    /*
    ----------------------------------------------
    件数表示
    ----------------------------------------------
    */

    updateResultCount(results.length);


    /*
    ----------------------------------------------
    結果表示
    ----------------------------------------------
    */

    if (typeof renderTable === "function") {

        renderTable(results);

    }


    console.log(
        "Search completed:",
        results.length,
        "records"
    );

}


/*
--------------------------------------------------
検索条件を取得
--------------------------------------------------
*/

function getSearchConditions(headers) {

    const conditions = [];


    headers.forEach(
        function (header) {

            const input =
                document.querySelector(
                    `[data-search-field="${CSS.escape(header)}"]`
                );


            if (!input) {

                return;

            }


            const value =
                input.value.trim();


            /*
            --------------------------------------
            空欄は検索条件にしない
            --------------------------------------
            */

            if (value === "") {

                return;

            }


            conditions.push({

                field: header,

                value: value

            });

        }
    );


    return conditions;

}


/*
--------------------------------------------------
すべての検索条件に一致するか
--------------------------------------------------

複数項目を入力した場合はAND検索。
--------------------------------------------------
*/

function matchesAllConditions(row, conditions) {

    return conditions.every(
        function (condition) {

            return matchesCondition(
                row,
                condition
            );

        }
    );

}


/*
--------------------------------------------------
1つの検索条件に一致するか
--------------------------------------------------
*/

function matchesCondition(row, condition) {

    const field =
        condition.field;

    const keyword =
        condition.value;


    /*
    ----------------------------------------------
    CSVの値
    ----------------------------------------------
    */

    let value = row[field];


    if (
        value === null ||
        value === undefined
    ) {

        value = "";

    }


    value = String(value).trim();


    /*
    ----------------------------------------------
    学名
    ----------------------------------------------

    例：

    Pteris faba
         ↓
    Pteris

    Dryopteris melaocarpa
         ↓
    Dryopteris

    「Pteris」を検索した場合、

    Pteris faba       → ○
    Dryopteris faba   → ×
    ----------------------------------------------
    */

    if (field === "学名") {

        return matchesScientificName(
            value,
            keyword
        );

    }


    /*
    ----------------------------------------------
    採集日
    ----------------------------------------------

    日付として正規化して比較する。
    ----------------------------------------------
    */

    if (field === "採集日") {

        return matchesDate(
            value,
            keyword
        );

    }


    /*
    ----------------------------------------------
    その他の項目
    ----------------------------------------------

    部分一致
    大文字・小文字は区別しない。
    ----------------------------------------------
    */

    return normalizeText(value)
        .includes(
            normalizeText(keyword)
        );

}


/*
--------------------------------------------------
学名検索
--------------------------------------------------

学名の最初の単語だけを取得し、
検索語と完全一致させる。

例：

CSV:
Dryopteris faba

検索:
Pteris

結果:
false

CSV:
Pteris faba

検索:
Pteris

結果:
true
--------------------------------------------------
*/

function matchesScientificName(
    scientificName,
    keyword
) {

    /*
    ----------------------------------------------
    学名を空白で分割
    ----------------------------------------------
    */

    const parts =
        scientificName
            .trim()
            .split(/\s+/);


    if (parts.length === 0) {

        return false;

    }


    /*
    ----------------------------------------------
    属名
    ----------------------------------------------
    */

    const genus =
        parts[0];


    /*
    ----------------------------------------------
    完全一致
    ----------------------------------------------
    */

    return normalizeText(genus) ===
        normalizeText(keyword);

}


/*
--------------------------------------------------
日付検索
--------------------------------------------------

基本形式：

yyyy/mm/dd

CSV:
2024/4/10

検索:
2024/04/10

→ 一致

CSV:
2024/4/10

検索:
2024/4/10

→ 一致
--------------------------------------------------
*/

function matchesDate(
    dateValue,
    keyword
) {

    const normalizedDate =
        normalizeDate(dateValue);

    const normalizedKeyword =
        normalizeDate(keyword);


    /*
    ----------------------------------------------
    日付として解釈できない場合
    ----------------------------------------------
    */

    if (
        normalizedDate === null ||
        normalizedKeyword === null
    ) {

        /*
        通常の文字列として部分一致
        */

        return normalizeText(dateValue)
            .includes(
                normalizeText(keyword)
            );

    }


    return normalizedDate ===
        normalizedKeyword;

}


/*
--------------------------------------------------
日付の正規化
--------------------------------------------------

以下を同じ日付として扱う。

2024/4/10
2024/04/10
2024-4-10
2024-04-10

内部形式：

2024/04/10
--------------------------------------------------
*/

function normalizeDate(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }


    const text =
        String(value).trim();


    /*
    ----------------------------------------------
    yyyy/mm/dd
    yyyy-mm-dd
    ----------------------------------------------
    */

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


    /*
    ----------------------------------------------
    日付の妥当性確認
    ----------------------------------------------
    */

    const date =
        new Date(
            year,
            month - 1,
            day
        );


    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {

        return null;

    }


    /*
    ----------------------------------------------
    YYYY/MM/DD
    ----------------------------------------------
    */

    return (
        String(year).padStart(4, "0") +
        "/" +
        String(month).padStart(2, "0") +
        "/" +
        String(day).padStart(2, "0")
    );

}


/*
--------------------------------------------------
文字列の正規化
--------------------------------------------------

・前後空白削除
・連続空白を1つにする
・小文字化
--------------------------------------------------
*/

function normalizeText(value) {

    return String(value)
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


/*
--------------------------------------------------
検索フォーム生成
--------------------------------------------------

CSVのヘッダーから検索項目を自動生成する。

例：

番号
和名
学名
場所
採集者
採集日
同定者名
メモ

↓

検索フォーム
--------------------------------------------------
*/

function generateSearchFields(headers) {

    const container =
        document.getElementById(
            "search-fields"
        );


    if (!container) {

        console.error(
            "#search-fields が見つかりません。"
        );

        return;

    }


    /*
    ----------------------------------------------
    初期化
    ----------------------------------------------
    */

    container.innerHTML = "";


    /*
    ----------------------------------------------
    各項目を生成
    ----------------------------------------------
    */

    headers.forEach(
        function (header, index) {

            const field =
                document.createElement("div");

            field.className =
                "search-field";


            /*
            --------------------------------------
            label
            --------------------------------------
            */

            const label =
                document.createElement("label");

            label.textContent =
                header;

            label.setAttribute(
                "for",
                "search-field-" + index
            );


            /*
            --------------------------------------
            input
            --------------------------------------
            */

            const input =
                document.createElement("input");

            input.type = "text";

            input.id =
                "search-field-" + index;

            input.className =
                "search-input";


            /*
            CSVヘッダーを識別子として保存
            */

            input.dataset.searchField =
                header;


            /*
            --------------------------------------
            日付
            --------------------------------------

            採集日の場合は入力例を表示。
            --------------------------------------
            */

            if (header === "採集日") {

                input.placeholder =
                    "yyyy/mm/dd";

            } else {

                input.placeholder =
                    "検索";

            }


            /*
            --------------------------------------
            要素を追加
            --------------------------------------
            */

            field.appendChild(label);

            field.appendChild(input);

            container.appendChild(field);

        }
    );


    console.log(
        "Search fields generated:",
        headers.length
    );

}


/*
--------------------------------------------------
検索リセット
--------------------------------------------------
*/

function resetSearch() {

    console.log("Reset search");


    /*
    ----------------------------------------------
    すべての検索欄を空にする
    ----------------------------------------------
    */

    const inputs =
        document.querySelectorAll(
            ".search-input"
        );


    inputs.forEach(
        function (input) {

            input.value = "";

        }
    );


    /*
    ----------------------------------------------
    検索結果をクリア
    ----------------------------------------------
    */

    setFilteredData([]);

    updateResultCount(0);


    if (typeof renderTable === "function") {

        renderTable([]);

    }

}