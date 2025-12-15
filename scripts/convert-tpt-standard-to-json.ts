// see LICENSE file
//
// Usage:
//   npx ts-node scripts/convert-tpt-standard-to-json.ts \\
//     original/TPT_V7\\ 20241125_updated.xlsx \\
//     > json/TPT_V7_20241125_updated.json
//
// The script:
// - reads the first worksheet
// - finds the header row containing "NUM_DATA"
// - uses that row as column names (blank headers become "Unnamed: <idx>")
// - drops empty rows and section heading rows (e.g. "Portfolio Characteristics...")
// - outputs JSON array to stdout

import XLSX from "xlsx";

function normalizeHeader(value: unknown, idx: number): string {
  const trimmed =
    value === undefined || value === null ? "" : String(value).trim();
  return trimmed === "" ? `Unnamed: ${idx}` : String(value);
}

function isSectionHeader(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  const text = String(value).trim();
  return (
    text === "NUM_DATA" || text === "Portfolio Characteristics and valuation"
  );
}

function convert(inputPath: string) {
  const workbook = XLSX.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  const headerRowIdx = rows.findIndex(
    (row) => String(row?.[0] ?? "").trim() === "NUM_DATA"
  );
  if (headerRowIdx === -1) {
    throw new Error(`Could not find header row ("NUM_DATA") in ${inputPath}`);
  }

  const headerRow = rows[headerRowIdx];
  const headers = headerRow.map((value, idx) => normalizeHeader(value, idx));

  const dataRows = rows.slice(headerRowIdx + 1).filter((row) => {
    const first = row?.[0];
    const allEmpty =
      !row ||
      row.every(
        (cell) =>
          cell === null || cell === undefined || String(cell).trim() === ""
      );
    return !allEmpty && !isSectionHeader(first);
  });

  const records = dataRows.map((row) => {
    const record: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      const value = row[idx];
      record[header] = value === undefined ? null : value;
    });
    return record;
  });

  return records;
}

function main() {
  const [inputPath] = process.argv.slice(2);
  if (!inputPath) {
    console.error(
      "Usage: ts-node scripts/convert-tpt-standard-to-json.ts <path-to-xlsx>"
    );
    process.exit(1);
  }

  const records = convert(inputPath);
  // Pretty-print to keep compatibility with existing checked-in JSON files.
  process.stdout.write(JSON.stringify(records, null, 2));
}

main();
