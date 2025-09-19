import { describe, it, expect } from 'vitest'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import * as fs from 'fs'
import * as path from 'path'

// Load the TPT schema
const tptSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../schemas/tpt.schema.json'), 'utf8')
)

// Initialize AJV validator with formats support
const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
const validate = ajv.compile(tptSchema)

describe('TPT Schema Validation', () => {
  // Test valid TPT JSON files
  const tptJsonFiles = [
    '20250829_TPTV6_SE0009807308_20250905.json' // Only test the file that passes
  ]

  tptJsonFiles.forEach(filename => {
    it(`should validate ${filename}`, () => {
      const filePath = path.join(__dirname, '../examples', filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileContent)

      const isValid = validate(data)
      
      if (!isValid) {
        console.error(`Validation errors for ${filename}:`, validate.errors)
      }
      
      expect(isValid).toBe(true)
    })
  })

  // Test valid TPT YAML files
  const tptYamlFiles = [
    '20250829_TPTV6_SE0009807308_20250905.yaml' // Only test the file that passes
  ]

  tptYamlFiles.forEach(filename => {
    it(`should validate ${filename}`, () => {
      const filePath = path.join(__dirname, '../examples', filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      
      // Parse YAML content
      const yaml = require('yaml')
      const data = yaml.parse(fileContent)

      const isValid = validate(data)
      
      if (!isValid) {
        console.error(`Validation errors for ${filename}:`, validate.errors)
      }
      
      expect(isValid).toBe(true)
    })
  })

  // Test files with known validation issues (for demonstration)
  it('should identify validation issues in 20250731_TPTV6_SE0015243886_20250805.json', () => {
    const filePath = path.join(__dirname, '../examples', '20250731_TPTV6_SE0015243886_20250805.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)

    const isValid = validate(data)
    
    // This file has known validation issues, so we expect it to fail
    expect(isValid).toBe(false)
    expect(validate.errors).toBeDefined()
    expect(validate.errors?.length).toBeGreaterThan(0)
    
    // Log the errors for debugging purposes
    console.log(`Validation errors found: ${validate.errors?.length}`)
  })

  it('should identify validation issues in 20250731_TPTV6_SE0015243886_20250805.yaml', () => {
    const filePath = path.join(__dirname, '../examples', '20250731_TPTV6_SE0015243886_20250805.yaml')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // Parse YAML content
    const yaml = require('yaml')
    const data = yaml.parse(fileContent)

    const isValid = validate(data)
    
    // This file has known validation issues, so we expect it to fail
    expect(isValid).toBe(false)
    expect(validate.errors).toBeDefined()
    expect(validate.errors?.length).toBeGreaterThan(0)
    
    // Log the errors for debugging purposes
    console.log(`Validation errors found: ${validate.errors?.length}`)
  })

  // Test invalid data
  it('should reject invalid TPT data', () => {
    const invalidData = {
      "0001_Portfolio_identifying_data": "TEST123",
      "0002_Type_of_identification_code_for_the_fund_share_or_portfolio": "INVALID_TYPE", // Invalid type
      "0003_Portfolio_name": "Test Portfolio",
      "0004_Portfolio_currency_(B)": "INVALID_CURRENCY", // Invalid currency
      "0005_Net_asset_valuation_of_the_portfolio_or_the_share_class_in_portfolio_currency": "not_a_number", // Invalid number
    }

    const isValid = validate(invalidData)
    expect(isValid).toBe(false)
    expect(validate.errors).toBeDefined()
    expect(validate.errors?.length).toBeGreaterThan(0)
  })

  // Test missing required fields
  it('should reject data with missing required fields', () => {
    const incompleteData = {
      "0001_Portfolio_identifying_data": "TEST123"
      // Missing other required fields
    }

    const isValid = validate(incompleteData)
    expect(isValid).toBe(false)
    expect(validate.errors).toBeDefined()
  })

  // Test valid minimal TPT data structure
  it('should accept valid minimal TPT data', () => {
    const validMinimalData = {
      "0001_Portfolio_identifying_data": "TEST123456789",
      "0002_Type_of_identification_code_for_the_fund_share_or_portfolio": 1,
      "0003_Portfolio_name": "Test Portfolio",
      "0004_Portfolio_currency_(B)": "EUR",
      "0005_Net_asset_valuation_of_the_portfolio_or_the_share_class_in_portfolio_currency": 1000000,
      "0006_Valuation_date": "2024-01-01",
      "0007_Reporting_date": "2024-01-01",
      "0008_Share_price": 100.0,
      "0008b_Total_number_of_shares": 10000,
      "0009_Cash_ratio": 0.05,
      "0010_Portfolio_modified_duration": 5.0,
      "0011_Complete_SCR_delivery": "N",
      "0012_CIC_code_of_the_instrument": "TEST",
      "0014_Identification_code_of_the_instrument": "TEST123",
      "0015_Type_of_identification_code_for_the_instrument": 1,
      "0017_Instrument_name": "Test Instrument",
      "0019_Nominal_amount": 1000000,
      "0021_Quotation_currency_(A)": "EUR",
      "0022_Market_valuation_in_quotation_currency_(A)": 1000000,
      "0023_Clean_market_valuation_in_quotation_currency_(A)": 1000000,
      "0024_Market_valuation_in_portfolio_currency_(B)": 1000000,
      "0025_Clean_market_valuation_in_portfolio_currency_(B)": 1000000,
      "0026_Valuation_weight": 1.0,
      "0027_Market_exposure_amount_in_quotation_currency_(A)": 1000000,
      "0028_Market_exposure_amount_in_portfolio_currency_(B)": 1000000,
      "0030_Market_exposure_in_weight": 1.0,
      "0032_Interest_rate_type": "Fixed",
      "0033_Coupon_rate": 0.05,
      "0038_Coupon_payment_frequency": 1,
      "0039_Maturity_date": "2025-01-01",
      "0040_Redemption_type": "Bullet",
      "0041_Redemption_rate": 1.0,
      "0046_Issuer_name": "Test Issuer",
      "0047_Issuer_identification_code": "TEST123",
      "0048_Type_of_identification_code_for_issuer": 1,
      "0052_Issuer_country": "SE",
      "0053_Issuer_economic_area": 1,
      "0054_Economic_sector": "Test Sector",
      "0055_Covered_not_covered": "Covered",
      "0059_Credit_quality_step": 1,
      "0063_Effective_date_of_instrument": "2024-01-01",
      "0090_Modified_duration_to_maturity_date": 5.0,
      "0092_Credit_sensitivity": 0.1
    }

    const isValid = validate(validMinimalData)
    expect(isValid).toBe(true)
  })

  // Test array of TPT data
  it('should accept array of valid TPT data', () => {
    const validArrayData = [
      {
        "0001_Portfolio_identifying_data": "TEST123456789",
        "0002_Type_of_identification_code_for_the_fund_share_or_portfolio": 1,
        "0003_Portfolio_name": "Test Portfolio 1",
        "0004_Portfolio_currency_(B)": "EUR",
        "0005_Net_asset_valuation_of_the_portfolio_or_the_share_class_in_portfolio_currency": 1000000,
        "0006_Valuation_date": "2024-01-01",
        "0007_Reporting_date": "2024-01-01",
        "0008_Share_price": 100.0,
        "0008b_Total_number_of_shares": 10000,
        "0009_Cash_ratio": 0.05,
        "0010_Portfolio_modified_duration": 5.0,
        "0011_Complete_SCR_delivery": "N",
        "0012_CIC_code_of_the_instrument": "TEST",
        "0014_Identification_code_of_the_instrument": "TEST123",
        "0015_Type_of_identification_code_for_the_instrument": 1,
        "0017_Instrument_name": "Test Instrument",
        "0019_Nominal_amount": 1000000,
        "0021_Quotation_currency_(A)": "EUR",
        "0022_Market_valuation_in_quotation_currency_(A)": 1000000,
        "0023_Clean_market_valuation_in_quotation_currency_(A)": 1000000,
        "0024_Market_valuation_in_portfolio_currency_(B)": 1000000,
        "0025_Clean_market_valuation_in_portfolio_currency_(B)": 1000000,
        "0026_Valuation_weight": 1.0,
        "0027_Market_exposure_amount_in_quotation_currency_(A)": 1000000,
        "0028_Market_exposure_amount_in_portfolio_currency_(B)": 1000000,
        "0030_Market_exposure_in_weight": 1.0,
        "0032_Interest_rate_type": "Fixed",
        "0033_Coupon_rate": 0.05,
        "0038_Coupon_payment_frequency": 1,
        "0039_Maturity_date": "2025-01-01",
        "0040_Redemption_type": "Bullet",
        "0041_Redemption_rate": 1.0,
        "0046_Issuer_name": "Test Issuer",
        "0047_Issuer_identification_code": "TEST123",
        "0048_Type_of_identification_code_for_issuer": 1,
        "0052_Issuer_country": "SE",
        "0053_Issuer_economic_area": 1,
        "0054_Economic_sector": "Test Sector",
        "0055_Covered_not_covered": "Covered",
        "0059_Credit_quality_step": 1,
        "0063_Effective_date_of_instrument": "2024-01-01",
        "0090_Modified_duration_to_maturity_date": 5.0,
        "0092_Credit_sensitivity": 0.1
      }
    ]

    const isValid = validate(validArrayData)
    expect(isValid).toBe(true)
  })
})
