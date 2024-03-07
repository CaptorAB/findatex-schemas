# findatex-schemas

Note: findatex-schemas is not in any way affiliated with findatex.eu

Excel files are neither human nor machine friendly. This project tries convert the excel description of EPT format to a JSON schema, for validating YAML files.

## JSON schemas for [https://findatex.eu](https://findatex.eu) formats

- [ept.schema.json](/schemas/ept.schema.json) corresponds to [EPT_V2.1_Final.xlsx](https://findatex.eu/mediaitem/d6a4e027-ee5c-4b61-a8e0-e6f147f5090f/EPT_V2.1_Final.xlsx)
- TPT not done yet
- EMP not done yet
- EET not done yet

## validation

### command line

```bash
npx ts-node scripts/validateEpt.ts findatex-ept-captor-2023-12-29.yaml
```

### vscode

In vscode you can add something like this to .vscode/settings.json and install [redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

```json
{
  "json.schemas": [
    {
      "fileMatch": ["findatex-ept*.json"],
      "url": "./schemas/ept.schema.json"
    }
  ],
  "yaml.schemas": {
    "schemas/ept.schema.json": ["findatex-ept*.yaml"]
  }
}
```

## executables

In addition to [ept.schema.json](/schemas/ept.schema.json) findatex-schemas exposes two executables to convert .xslx files to .yaml and back again.

for example:

```bash
npx ts-node scripts/eptExcel2yaml.ts examples/findatex-ept-captor-2023-12-29.xlsx
npx ts-node scripts/eptYaml2excel.ts findatex-ept-captor-2023-12-29.yaml
npx ts-node scripts/validateEpt.ts findatex-ept-captor-2023-12-29.yaml
```