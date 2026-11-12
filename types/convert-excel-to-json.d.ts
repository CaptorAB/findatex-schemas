declare module "convert-excel-to-json" {
  type ExcelToJsonOptions = {
    sourceFile: string;
    columnToKey?: Record<string, string>;
    sheets?: string[];
  } & Record<string, unknown>;

  export default function excelToJson(
    options: ExcelToJsonOptions,
  ): Record<string, Record<string, unknown>[]>;
}

