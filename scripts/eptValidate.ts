#!/usr/bin/env node
// Copyright (c) 2024 Captor Fund Management AB.
// see LICENSE file

import { program } from "commander";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import { version } from "../package.json";
import * as fs from "fs";
import eptSchema from "../schemas/ept.schema.json";

const ajv = new Ajv({ allowUnionTypes: true });
addFormats(ajv);
ajv.addKeyword("components");
const validateEpt = ajv.compile(eptSchema);

program
  .version(version)
  .argument("<files...>", "one or more ept yaml files")
  .action((files: string[]) => {
    if (!files) {
      console.error("no file specified");
      process.exit(1);
    }
    files.forEach((filePath) => {
      if (!filePath.endsWith(".yaml")) {
        console.error(filePath + " does not seems to be an .yaml file");
        process.exit(1);
      }
      const text = fs.readFileSync(filePath, "utf8");
      const data = parse(text);

      const valid = validateEpt(data);
      if (!valid) {
        console.error(JSON.stringify(validateEpt.errors, null, 2));
        process.exit(1);
      } else {
        console.log(filePath + " is valid");
      }
    });
  })
  .parse(process.argv);
