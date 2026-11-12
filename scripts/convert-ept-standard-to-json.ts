// Copyright (c) 2024 Captor Fund Management AB.
// see LICENSE file

// npx tsx scripts/convert-ept-standard-to-json.ts > json/EPT_V2.1_Final.json

import excelToJson from "convert-excel-to-json";

const result = excelToJson({
  sourceFile: "original/EPT_V2.1_Final.xlsx",
  header: {
    // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
    rows: 7,
  },
  columnToKey: {
    B: "field",
    C: "definition",
    D: "codification",
    E: "comment",
    F: "synchronisedWithPriips",
    G: "mandatory",
    H: "neededUK",
  },
});

console.log(JSON.stringify(result, null, 2));
