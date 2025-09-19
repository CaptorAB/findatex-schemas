import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'yaml'

// Load the EPT schema
const eptSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../schemas/ept.schema.json'), 'utf8')
)

// Initialize AJV validator with formats support
const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
const validate = ajv.compile(eptSchema)

describe('EPT Schema Validation', () => {
  // Test valid EPT YAML files
  const eptYamlFiles = [
    'findatex-ept-captor-2023-12-29.yaml',
    'findatex-ept-pimco.yaml'
  ]

  eptYamlFiles.forEach(filename => {
    it(`should validate ${filename}`, () => {
      const filePath = path.join(__dirname, '../examples', filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const data = yaml.parse(fileContent)

      const isValid = validate(data)
      
      if (!isValid) {
        console.error(`Validation errors for ${filename}:`, validate.errors)
      }
      
      expect(isValid).toBe(true)
    })
  })

  // Test invalid data
  it('should reject invalid EPT data', () => {
    const invalidData = {
      "00001_EPT_Version": "INVALID_VERSION", // Invalid version
      "00005_File_Generation_Date_And_Time": "invalid-date", // Invalid date format
      "00006_EPT_Data_Reporting_Narratives": "X", // Invalid enum value
    }

    const isValid = validate(invalidData)
    expect(isValid).toBe(false)
    expect(validate.errors).toBeDefined()
    expect(validate.errors?.length).toBeGreaterThan(0)
  })

  // Test missing required fields
  it('should reject data with missing required fields', () => {
    const incompleteData = {
      "00001_EPT_Version": "V21"
      // Missing other required fields
    }

    const isValid = validate(incompleteData)
    expect(isValid).toBe(false)
    expect(validate.errors).toBeDefined()
  })

  // Test valid minimal EPT data structure
  it('should accept valid minimal EPT data', () => {
    const validMinimalData = {
      "00001_EPT_Version": "V21",
      "00005_File_Generation_Date_And_Time": "2024-01-01T00:00:00Z",
      "00006_EPT_Data_Reporting_Narratives": "Y",
      "00007_EPT_Data_Reporting_Costs": "Y",
      "00008_EPT_Data_Reporting_Additional_Requirements_German_MOPs": "N",
      "00009_EPT_Additional_Information_Structured_Products": "N",
      "00010_Portfolio_Manufacturer_Name": "Test Manufacturer",
      "00015_Portfolio_Manufacturer_Group_Name": "Test Group",
      "00030_Portfolio_Identifying_Data": "TEST123456789",
      "00040_Type_Of_Identification_Code_For_The_Fund_Share_Or_Portfolio": 1,
      "00050_Portfolio_Name": "Test Portfolio",
      "00060_Portfolio_Or_Share_Class_Currency": "EUR",
      "00070_PRIIPs_KID_Publication_Date": "2024-01-01",
      "00080_Portfolio_PRIIPs_Category": 1,
      "00110_Is_An_Autocallable_Product": "N",
      "01080_Existing_Credit_Risk": "N",
      "01090_SRI": 1,
      "01095_IS_SRI_Adjusted": "N",
      "01100_MRM": 1,
      "01110_CRM": 1,
      "01120_Recommended_Holding_Period": 1,
      "01125_Has_A_Contractual_Maturity_Date": "N",
      "01140_Liquidity_Risk": "L",
      "02030_Portfolio_Return_Unfavourable_Scenario_RHP_Or_First_Call_Date": 0.05,
      "02032_Autocall_Applied_Unfavourable_Scenario": "N",
      "02060_Portfolio_Return_Moderate_Scenario_RHP_Or_First_Call_Date": 0.05,
      "02062_Autocall_Applied_Moderate_Scenario": "N",
      "02090_Portfolio_Return_Favourable_Scenario_RHP_Or_First_Call_Date": 0.05,
      "02092_Autocall_Applied_Favourable_Scenario": "N",
      "02120_Portfolio_Return_Stress_Scenario_RHP_Or_First_Call_Date": 0.05,
      "02122_Autocall_Applied_Stress_Scenario": "N",
      "02185_Portfolio_Past_Performance_Disclosure_Required": "N",
      "02220_Reference_Invested_Amount": 10000,
      "03010_One_Off_Cost_Portfolio_Entry_Cost": 0.01,
      "03015_One_Off_Cost_Portfolio_Entry_Cost_Acquired": 0.01,
      "03020_One_Off_Costs_Portfolio_Exit_Cost_At_RHP": 0.01,
      "03050_One_Off_Costs_Portfolio_Sliding_Exit_Cost_Indicator": "N",
      "03060_Ongoing_Costs_Management_Fees_And_Other_Administrative_Or_Operating_Costs": 0.01,
      "03080_Ongoing_Costs_Portfolio_Transaction_Costs": 0.01,
      "03090_Existing_Incidental_Costs_Portfolio": "N",
      "04020_Comprehension_Alert_Portfolio": "N",
      "04030_Intended_Target_Market_Retail_Investor_Portfolio": "Test target market",
      "04040_Investment_Objective_Portfolio": "Test investment objective",
      "04070_Type_Of_Underlying_Investment_Option": "Test investment type",
      "04080_Capital_Guarantee": "N",
      "04130_One_Off_Cost_Portfolio_Exit_Cost_Description": "Test exit cost description",
      "04140_Ongoing_Costs_Portfolio_Management_Costs_Description": "Test management cost description",
      "04150_Do_Costs_Depend_On_Invested_Amount": "N"
    }

    const isValid = validate(validMinimalData)
    expect(isValid).toBe(true)
  })
})
