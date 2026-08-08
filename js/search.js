# /*

植物標本データベース
search.js

検索処理

## 仕様

・CSVの1行目から検索項目を自動生成
・1項目につきキーワードは1つ
・複数項目を入力した場合はAND検索
・学名は属名を完全一致
・その他の項目は部分一致
・採集日は yyyy/mm/dd として比較
・検索前は結果を表示しない
=============

*/

"use strict";

# /*

# 検索フォーム生成

*/

/**

* CSVヘッダーから検索フォームを生成する
*
* @param {Array} headers CSVのヘッダー
  */
  function generateSearchFields(headers) {

  const container =
  document.getElementById("search-fields");

  if (!container) {

  ```
   console.error(
       "#search-fields が見つかりません。"
   );

   return;
  ```

  }

  ## /*

  ## 既存の検索項目を削除

  */

  container.innerHTML = "";

  ## /*

  ## CSVのヘッダー順に検索欄を作成

  */

  headers.forEach(function (header, index) {

  ```
   const column =
       document.createElement("div");

   /*
   Bootstrap
   */

   column.className =
       "col-12 col-md-6 col-lg-3";


   /*
   ------------------------------------------
   ラベル
   ------------------------------------------
   */

   const label =
       document.createElement("label");

   label.className =
       "form-label";

   label.htmlFor =
       "search-field-" + index;

   label.textContent =
       header;


   /*
   ------------------------------------------
   入力欄
   ------------------------------------------
   */

   const input =
       document.createElement("input");

   input.type =
       "text";

   input.id =
       "search-field-" + index;

   input.className =
       "form-control search-input";


   /*
   CSVヘッダーを保存
   */

   input.dataset.field =
       header;


   /*
   ------------------------------------------
   プレースホルダー
   ------------------------------------------
   */

   if (header === "採集日") {

       input.placeholder =
           "yyyy/mm/dd";

   } else {

       input.placeholder =
           "検索";

   }


   /*
   ------------------------------------------
   Enterキーで検索
   ------------------------------------------
   */

   input.addEventListener(
       "keydown",
       function (event) {

           if (event.key === "Enter") {

               event.preventDefault();

               executeSearch();

           }

       }
   );


   /*
   ------------------------------------------
   要素を追加
   ------------------------------------------
   */

   column.appendChild(label);

   column.appendChild(input);

   container.appendChild(column);
  ```

  });

  console.log(
  "Search fields generated:",
  headers.length
  );

}

# /*

# 検索条件取得

*/

/**

* 現在入力されている検索条件を取得する
*
* @param {Array} headers CSVのヘッダー
* @returns {Array} 検索条件
  */
  function getSearchConditions(headers) {

  const conditions = [];

  headers.forEach(function (header, index) {

  ```
   const input =
       document.getElementById(
           "search-field-" + index
       );


   if (!input) {

       return;

   }


   const keyword =
       input.value.trim();


   /*
   ------------------------------------------
   空欄は検索条件に含めない
   ------------------------------------------
   */

   if (keyword === "") {

       return;

   }


   conditions.push({

       field: header,

       value: keyword

   });
  ```

  });

  return conditions;

}

# /*

# 検索実行

*/

/**

* CSVデータに対して検索を実行する
*
* @returns {Array} 検索結果
  */
  function executeSearch() {

  console.log(
  "Executing search..."
  );

  ## /*

  ## CSVデータを取得

  */

  if (
  !window.specimenData ||
  !Array.isArray(window.specimenData)
  ) {

  ```
   console.error(
       "CSVデータがまだ読み込まれていません。"
   );

   return [];
  ```

  }

  ## /*

  ## ヘッダーを取得

  */

  const headers =
  window.csvHeaders || [];

  ## /*

  ## 検索条件

  */

  const conditions =
  getSearchConditions(headers);

  console.log(
  "Search conditions:",
  conditions
  );

  ## /*

  ## 検索条件がない場合

  「全件表示」にはしない。

  数万～数十万件を扱うため、
  検索前は0件とする。
  ----------

  */

  if (conditions.length === 0) {

  ```
   displaySearchResult([]);

   return [];
  ```

  }

  ## /*

  ## AND検索

  */

  const results =
  window.specimenData.filter(
  function (row) {

  ```
           return conditions.every(
               function (condition) {

                   return matchesCondition(
                       row,
                       condition
                   );

               }
           );

       }
   );
  ```

  ## /*

  ## 結果表示

  */

  displaySearchResult(results);

  console.log(
  "Search completed:",
  results.length,
  "records"
  );

  return results;

}

# /*

# 1つの検索条件を判定

*/

function matchesCondition(row, condition) {

```
const field =
    condition.field;


const keyword =
    condition.value;


let value =
    row[field];


if (
    value === null ||
    value === undefined
) {

    value = "";

}


value =
    String(value).trim();


/*
----------------------------------------------
学名
----------------------------------------------

学名の最初の単語＝属名だけを比較する。

例：

Dryopteris faba
↓
Dryopteris

「Pteris」で検索

Pteris faba      → ○
Dryopteris faba  → ×
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
----------------------------------------------
*/

return normalizeText(value)
    .includes(
        normalizeText(keyword)
    );
```

}

# /*

# 学名検索

*/

function matchesScientificName(
scientificName,
keyword
) {

```
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
```

}

# /*

# 日付検索

*/

function matchesDate(
dateValue,
keyword
) {

```
const normalizedDate =
    normalizeDate(dateValue);


const normalizedKeyword =
    normalizeDate(keyword);


/*
----------------------------------------------
両方とも正しい日付なら完全一致
----------------------------------------------
*/

if (
    normalizedDate !== null &&
    normalizedKeyword !== null
) {

    return normalizedDate ===
        normalizedKeyword;

}


/*
----------------------------------------------
不正な日付の場合
----------------------------------------------

通常の部分一致にする。
----------------------------------------------
*/

return normalizeText(dateValue)
    .includes(
        normalizeText(keyword)
    );
```

}

# /*

# 日付正規化

以下を同一の日付として扱う。

2024/4/10
2024/04/10
2024-4-10
2024-04-10

↓

# 2024/04/10

*/

function normalizeDate(value) {

```
if (
    value === null ||
    value === undefined
) {

    return null;

}


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


/*
----------------------------------------------
実在する日付か確認
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


return (
    String(year).padStart(4, "0") +
    "/" +
    String(month).padStart(2, "0") +
    "/" +
    String(day).padStart(2, "0")
);
```

}

# /*

# 文字列正規化

*/

function normalizeText(value) {

```
return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
```

}

# /*

# 検索結果表示

*/

/**

* 検索結果をDataTablesへ渡す
*
* table.js側の関数を呼び出す。
*
* @param {Array} results 検索結果
  */
  function displaySearchResult(results) {

  ## /*

  ## 件数表示

  */

  const countElement =
  document.getElementById(
  "resultCount"
  );

  if (countElement) {

  ```
   countElement.textContent =
       results.length.toLocaleString();
  ```

  }

  ## /*

  ## DataTablesへ渡す

  */

  if (
  typeof updateDataTable ===
  "function"
  ) {

  ```
   updateDataTable(results);
  ```

  } else {

  ```
   console.error(
       "updateDataTable() が見つかりません。"
   );
  ```

  }

}

# /*

# 検索リセット

*/

function resetSearch() {

```
console.log(
    "Reset search"
);


/*
----------------------------------------------
検索欄を空にする
----------------------------------------------
*/

const inputs =
    document.querySelectorAll(
        ".search-input"
    );


inputs.forEach(function (input) {

    input.value = "";

});


/*
----------------------------------------------
検索結果を0件にする
----------------------------------------------
*/

displaySearchResult([]);
```

}
