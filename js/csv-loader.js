"use strict";

const CSV_FILE = "data/specimens.csv";

async function loadCSV() {

    console.log("CSV loading started");
    console.log("CSV file:", CSV_FILE);

    if (typeof Papa === "undefined") {

        console.error("Papa is not defined.");

        showCSVError(
            "Papa Parseが読み込まれていません。"
        );

        return;
    }

    try {

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

        if (!response.ok) {

            throw new Error(
                "HTTP error: " +
                response.status +
                " " +
                response.statusText
            );

        }

        const csvText =
            await response.text();

        console.log(
            "CSV text length:",
            csvText.length
        );

        console.log(
            "CSV first 200 characters:",
            csvText.substring(0, 200)
        );

        if (
            csvText.trim() === ""
        ) {

            throw new Error(
                "CSV file is empty."
            );

        }

        const results =
            Papa.parse(
                csvText,
                {
                    header: true,
                    skipEmptyLines: true
                }
            );

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

        const headers =
            results.meta &&
            Array.isArray(results.meta.fields)
                ? results.meta.fields
                : [];

        console.log(
            "CSV headers:",
            headers
        );

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

        const data =
            Array.isArray(results.data)
                ? results.data
                : [];

        console.log(
            "CSV records:",
            data.length
        );

        window.specimenData = data;

        window.csvHeaders = headers;

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

        if (
            typeof updateDataTable ===
            "function"
        ) {

            updateDataTable([]);

        }

        console.log(
            "CSV initialization completed"
        );

    } catch (error) {

        console.error(
            "CSV loading failed:",
            error
        );

        showCSVError(
            "CSVファイルの読み込みに失敗しました。"
        );

    }

}

function showCSVError(message) {

    const searchFields =
        document.getElementById(
            "searchForm"
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

}

function escapeErrorText(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}