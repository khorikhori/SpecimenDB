"use strict";

function generateSearchFields(headers) {

    const container =
        document.getElementById("searchForm");

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

}


function executeSearch() {

    const data =
        window.specimenData || [];

    const headers =
        window.csvHeaders || [];


    if (data.length === 0) {

        console.warn(
            "検索対象のデータがありません。"
        );

        updateDataTable([]);

        updateResultCount(0);

        return;

    }


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


    console.log(
        "Search conditions:",
        conditions
    );


    if (conditions.length === 0) {

        updateDataTable([]);

        updateResultCount(0);

        return;

    }


    const results =
        data.filter(function(row) {

            return conditions.every(
                function(condition) {

                    const cell =
                        String(
                            row[condition.header] ?? ""
                        ).trim();


                    if (
                        condition.header === "学名"
                    ) {

                        const firstWord =
                            cell.split(/\s+/)[0];


                        return (
                            firstWord.toLowerCase() ===
                            condition.value.toLowerCase()
                        );

                    }


                    return cell
                        .toLowerCase()
                        .includes(
                            condition.value.toLowerCase()
                        );

                }
            );

        });


    console.log(
        "Search results:",
        results.length,
        results
    );


    updateDataTable(results);

    updateResultCount(
        results.length
    );

}


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