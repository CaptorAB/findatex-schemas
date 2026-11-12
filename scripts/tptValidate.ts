#!/usr/bin/env node
// Copyright (c) 2026 Captor Fund Management AB.
// see LICENSE file

import { program } from "commander";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import { version } from "../package.json";
import * as fs from "fs";
import schemaV7 from "../schemas/tpt.v7.schema.json";
import schemaV8 from "../schemas/tpt.v8.schema.json";

const ajv = new Ajv({ allowUnionTypes: true });
addFormats(ajv);
ajv.addKeyword("components");

program
  .version(version)
  .option("--v7", "validate against the TPT V7 schema instead of V8")
  .argument("<files...>", "one or more yaml files")
  .action((files: string[], options: { v7?: boolean }) => {
    if (!files) {
      console.error("no file specified");
      process.exit(1);
    }
    const validate = ajv.compile(options.v7 ? schemaV7 : schemaV8);
    files.forEach((filePath) => {
      if (!filePath.endsWith(".yaml")) {
        console.error(filePath + " does not seems to be an .yaml file");
        process.exit(1);
      }
      const text = fs.readFileSync(filePath, "utf8");
      const data = parse(text);

      const valid = validate(data);
      if (!valid) {
        console.error(JSON.stringify(validate.errors, null, 2));
        process.exit(1);
      } else {
        console.log(filePath + " is valid");
      }
    });
  })
  .parse(process.argv);
