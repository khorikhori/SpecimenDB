"use strict";

let specimenTable = null;


function initializeTable(headers) {

    console.log(
        "Initializing DataTables:",
        headers
    );


    if (
        $.fn.DataTable.isDataTable(
            "#specimenTable"
        )
    ) {

        $("#specimenTable")
            .DataTable()
            .destroy();

    }


    specimenTable =
        $("#specimenTable").DataTable({

            data: [],

            columns:
                headers.map(function(header) {

                    return {
                        title: header,
                        data: header,
                        defaultContent: ""
                    };

                }),


            pageLength: 50,


            lengthMenu: [
                [50, 100],
                [50, 100]
            ],


            searching: false,


            ordering: true,


            order: [],


            responsive: true,


            autoWidth: false,


            language: {

                emptyTable:
                    "検索結果はありません",

                info:
                    "_TOTAL_ 件中 _START_ ～ _END_ 件を表示",

                infoEmpty:
                    "0 件",

                lengthMenu:
                    "_MENU_ 件表示",

                paginate: {

                    first: "最初",

                    last: "最後",

                    next: "次へ",

                    previous: "前へ"

                }

            }

        });


    console.log(
        "DataTables initialized."
    );

}


function updateDataTable(results) {

    if (!specimenTable) {

        console.error(
            "DataTablesが初期化されていません。"
        );

        return;

    }


    specimenTable
        .clear()
        .rows
        .add(results)
        .draw();

}