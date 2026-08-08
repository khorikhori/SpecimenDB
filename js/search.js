"use strict";

# /*

# 検索機能

*/

## /*

## 検索フォーム生成

*/

function generateSearchFields(headers) {

console.log(
    "Generating search fields:",
    headers
);


const container =
    document.getElementById(
        "searchForm"
    );


if (!container) {

    console.error(
        "searchForm が見つかりません。"
    );

    return;

}


container.innerHTML = "";


headers.forEach(function(header, index) {

    const col =
        document.createElement("div");

    col.className =
        "col-md-6 col-lg-4";


    const label =
        document.createElement("label");

    label.className =
        "form-label";

    label.textContent =
        header;


    const input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "form-control";

    input.id =
        "search-" + index;

    input.dataset.header =
        header;

    input.placeholder =
        header + "を入力";


    col.appendChild(label);

    col.appendChild(input);

    container.appendChild(col);

});


console.log(
    "Search fields generated:",
    headers.length
);


}

## /*

## 検索

*/

function executeSearch() {


if (
    !Array.isArray(
        window.specimenData
    )
) {

    console.error(
        "specimenData がありません。"
    );

    return;

}


const data =
    window.specimenData;

const headers =
    window.csvHeaders;


const conditions = [];


headers.forEach(function(header, index) {

    const input =
        document.getElementById(
            "search-" + index
        );


    if (!input) {

        return;

    }


    const value =
        input.value.trim();


    if (value !== "") {

        conditions.push({

            header: header,

            value: value

        });

    }

});


/*
----------------------------------------------
検索条件がない場合
----------------------------------------------
*/

if (
    conditions.length === 0
) {

    updateDataTable([]);

    updateResultCount(0);

    return;

}


/*
----------------------------------------------
AND検索
----------------------------------------------
*/

const results =
    data.filter(function(row) {

        return conditions.every(
            function(condition) {

                const cell =
                    String(
                        row[
                            condition.header
                        ] ?? ""
                    ).trim();


                /*
                --------------------------------
                学名
                --------------------------------

                「Pteris」と検索した場合、

                Pteris faba → ヒット
                Dryopteris faba → ヒットしない

                --------------------------------
                */

                if (
                    condition.header ===
                    "学名"
                ) {

                    const firstWord =
                        cell.split(
                            /\s+/
                        )[0];


                    return (
                        firstWord.toLowerCase() ===
                        condition.value.toLowerCase()
                    );

                }


                /*
                --------------------------------
                その他の項目
                --------------------------------
                */

                return cell
                    .toLowerCase()
                    .includes(
                        condition.value.toLowerCase()
                    );

            }
        );

    });


/*
----------------------------------------------
DataTablesへ渡す
----------------------------------------------
*/

updateDataTable(
    results
);


updateResultCount(
    results.length
);


}

## /*

## 検索結果件数

*/

function updateResultCount(count) {


const element =
    document.getElementById(
        "resultCount"
    );


if (element) {

    element.textContent =
        count;

}


}

## /*

## 検索リセット

*/

function resetSearch() {


const headers =
    window.csvHeaders || [];


headers.forEach(function(header, index) {

    const input =
        document.getElementById(
            "search-" + index
        );


    if (input) {

        input.value = "";

    }

});


updateDataTable([]);

updateResultCount(0);


}
