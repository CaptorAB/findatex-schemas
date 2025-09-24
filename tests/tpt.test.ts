import { describe, it, expect } from "vitest";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

// Load the TPT schema
const tptSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../schemas/tpt.schema.json"), "utf8")
);

// Initialize AJV validator with formats support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(tptSchema);

describe("TPT Schema Validation", () => {
  const yamlTptFiles = fs
    .readdirSync(path.join(__dirname, "../examples")) //
    .filter((file) => file.endsWith(".yaml")) //
    .filter((file) => file.includes("_TPTV6_"));

  const jsonTptFiles = fs
    .readdirSync(path.join(__dirname, "../examples")) //
    .filter((file) => file.includes("_TPTV6_"))
    .filter((file) => file.endsWith(".json"));

  yamlTptFiles.forEach((filename) => {
    it(`should validate ${filename} as yaml file`, () => {
      const fileContent = fs.readFileSync(
        path.join(__dirname, "../examples", filename),
        "utf8"
      );

      // Parse YAML content
      const yaml = require("yaml");
      const data = yaml.parse(fileContent);

      const isValid = validate(data);

      if (!isValid) {
        console.error(`Validation errors for ${filename}:`, validate.errors);
      }
      if (!isValid) {
        console.error(`Validation errors for ${filename}:`, validate.errors);
      }
      expect(isValid).toBe(true);
    });
  });

  jsonTptFiles.forEach((filename) => {
    it(`should validate ${filename} as json file`, () => {
      const fileContent = fs.readFileSync(
        path.join(__dirname, "../examples", filename),
        "utf8"
      );
      const data = JSON.parse(fileContent);

      const isValid = validate(data);

      if (!isValid) {
        console.error(`Validation errors for ${filename}:`, validate.errors);
      }

      expect(isValid).toBe(true);
    });
  });

  // Test invalid data
  it("should reject invalid TPT data", () => {
    const invalidData = {
      "0001_Portfolio_identifying_data": "TEST123",
      "0002_Type_of_identification_code_for_the_fund_share_or_portfolio":
        "INVALID_TYPE", // Invalid type
      "0003_Portfolio_name": "Test Portfolio",
      "0004_Portfolio_currency_(B)": "INVALID_CURRENCY", // Invalid currency
      "0005_Net_asset_valuation_of_the_portfolio_or_the_share_class_in_portfolio_currency":
        "not_a_number", // Invalid number
    };

    console.log("--------------------------------");
    const isValid = validate(invalidData);
    expect(isValid).toBe(false);
    expect(validate.errors).toBeDefined();
    expect(validate.errors?.length).toBeGreaterThan(0);
  });

  // Test missing required fields
  it("should reject data with missing required fields", () => {
    const incompleteData = {
      "0001_Portfolio_identifying_data": "TEST123",
      // Missing other required fields
    };

    const isValid = validate(incompleteData);
    expect(isValid).toBe(false);
    expect(validate.errors).toBeDefined();
  });
});
