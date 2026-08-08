"use strict";

let specimenData = [];

let csvHeaders = [];

let filteredData = [];


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Specimen Database start"
        );

        initializeApp();

    }
);


function initializeApp() {

    console.log(
        "Initializing application..."
    );


    if (
        typeof loadCSV === "function"
    ) {

        loadCSV();

    } else {

        console.error(
            "loadCSV() が見つかりません。"
        );

    }


    const searchButton =
        document.getElementById(
            "searchButton"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Search button clicked"
                );

                if (
                    typeof executeSearch ===
                    "function"
                ) {

                    executeSearch();

                } else {

                    console.error(
                        "executeSearch() が見つかりません。"
                    );

                }

            }
        );

    }


    const resetButton =
        document.getElementById(
            "resetButton"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Reset button clicked"
                );

                if (
                    typeof resetSearch ===
                    "function"
                ) {

                    resetSearch();

                }

            }
        );

    }


    console.log(
        "Application initialized"
    );

}


function updateResultCount(count) {

    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (!resultCount) {

        return;

    }


    resultCount.textContent =
        count.toLocaleString();

}


function setFilteredData(data) {

    filteredData =
        Array.isArray(data)
            ? data
            : [];

}


function getFilteredData() {

    return filteredData;

}


function getSpecimenData() {

    return specimenData;

}


function getCSVHeaders() {

    return csvHeaders;

}