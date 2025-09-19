[![npm version](https://badge.fury.io/js/findatex-schemas.svg)](https://badge.fury.io/js/findatex-schemas)

# findatex-schemas

Note: findatex-schemas is not in any way affiliated with findatex.eu

Excel files are neither human nor machine friendly. This project tries convert the excel description of the EPT format to a JSON schema.
The data can then be written in YAML (with editor validation) and converted to .xlsx file afterwards.

## JSON schemas for [https://findatex.eu](https://findatex.eu) formats

- [ept.schema.json](/schemas/ept.schema.json) corresponds to [EPT_V2.1_Final.xlsx](https://findatex.eu/mediaitem/d6a4e027-ee5c-4b61-a8e0-e6f147f5090f/EPT_V2.1_Final.xlsx)
- TPT not done yet
- EMT not done yet
- EET not done yet

## installation

```bash
npm install -g findatex-schemas
```

## validation

### command line

```bash
eptValidate findatex-ept-captor-2023-12-29.yaml
```

### vscode

In vscode you can add something like this to .vscode/settings.json and install [redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

```json
{
  "json.schemas": [
    {
      "fileMatch": ["findatex-ept*.json"],
      "url": "https://raw.githubusercontent.com/CaptorAB/findatex-schemas/refs/heads/master/schemas/ept.schema.json"
    }
  ],
  "yaml.schemas": {
    "https://raw.githubusercontent.com/CaptorAB/findatex-schemas/refs/heads/master/schemas/ept.schema.json": [
      "findatex-ept*.yaml"
    ]
  }
}
```

## executables

In addition to [ept.schema.json](https://github.com/CaptorAB/findatex-schemas/blob/master/schemas/ept.schema.json) findatex-schemas
exposes executables to convert .xslx files to .yaml and back again.

for example:

```bash
eptExcel2yaml examples/findatex-ept-captor-2023-12-29.xlsx
eptYaml2excel findatex-ept-captor-2023-12-29.yaml
eptValidate findatex-ept-captor-2023-12-29.yaml
```

## testing

There are some tests that validates the files in examples dir against their schemas.

Run the tests by running:

```bash
npm test
```

## Contributions

Feel free to report bugs and submit pull requests
