#!/usr/bin/env node
// Copyright (c) 2024 Captor Fund Management AB.
// see LICENSE file

import { program } from "commander";
import { parse } from "yaml";
import * as fs from "fs";
import { writeFile, utils } from "xlsx";
import { version } from "../package.json";

const EPT_HEADERS = [
  "00001_EPT_Version",
  "00002_EPT_Producer_Name",
  "00004_EPT_Producer_Email",
  "00005_File_Generation_Date_And_Time",
  "00006_EPT_Data_Reporting_Narratives",
  "00007_EPT_Data_Reporting_Costs",
  "00008_EPT_Data_Reporting_Additional_Requirements_German_MOPs",
  "00009_EPT_Additional_Information_Structured_Products",
  "00010_Portfolio_Manufacturer_Name",
  "00015_Portfolio_Manufacturer_Group_Name",
  "00016_Portfolio_Manufacturer_LEI",
  "00017_Portfolio_Manufacturer_Email",
  "00020_Portfolio_Guarantor_Name",
  "00030_Portfolio_Identifying_Data",
  "00040_Type_Of_Identification_Code_For_The_Fund_Share_Or_Portfolio",
  "00050_Portfolio_Name",
  "00060_Portfolio_Or_Share_Class_Currency",
  "00070_PRIIPs_KID_Publication_Date",
  "00075_PRIIPs_KID_Web_Address",
  "00080_Portfolio_PRIIPs_Category",
  "00090_Fund_CIC_Code",
  "00110_Is_An_Autocallable_Product",
  "00120_Reference_Language",
  "01010_Valuation_Frequency",
  "01020_Portfolio_VEV_Reference",
  "01030_IS_Flexible",
  "01040_Flex_VEV_Historical",
  "01050_Flex_VEV_Ref_Asset_Allocation",
  "01060_IS_Risk_Limit_Relevant",
  "01070_Flex_VEV_Risk_Limit",
  "01080_Existing_Credit_Risk",
  "01090_SRI",
  "01095_IS_SRI_Adjusted",
  "01100_MRM",
  "01110_CRM",
  "01120_Recommended_Holding_Period",
  "01125_Has_A_Contractual_Maturity_Date",
  "01130_Maturity_Date",
  "01140_Liquidity_Risk",
  "02010_Portfolio_Return_Unfavourable_Scenario_1_Year",
  "02020_Portfolio_Return_Unfavourable_Scenario_Half_RHP",
  "02030_Portfolio_Return_Unfavourable_Scenario_RHP_Or_First_Call_Date",
  "02032_Autocall_Applied_Unfavourable_Scenario",
  "02035_Autocall_Date_Unfavourable_Scenario",
  "02040_Portfolio_Return_Moderate_Scenario_1_Year",
  "02050_Portfolio_Return_Moderate_Scenario_Half_RHP",
  "02060_Portfolio_Return_Moderate_Scenario_RHP_Or_First_Call_Date",
  "02062_Autocall_Applied_Moderate_Scenario",
  "02065_Autocall_Date_Moderate_Scenario",
  "02070_Portfolio_Return_Favourable_Scenario_1_Year",
  "02080_Portfolio_Return_Favourable_Scenario_Half_RHP",
  "02090_Portfolio_Return_Favourable_Scenario_RHP_Or_First_Call_Date",
  "02092_Autocall_Applied_Favourable_Scenario",
  "02095_Autocall_Date_Favourable_Scenario",
  "02100_Portfolio_Return_Stress_Scenario_1_Year",
  "02110_Portfolio_Return_Stress_Scenario_Half_RHP",
  "02120_Portfolio_Return_Stress_Scenario_RHP_Or_First_Call_Date",
  "02122_Autocall_Applied_Stress_Scenario",
  "02125_Autocall_Date_Stress_Scenario",
  "02130_Portfolio_Number_Of_Observed_Return_M0",
  "02140_Portfolio_Mean_Observed_Returns_M1",
  "02150_Portfolio_Observed_Sigma",
  "02160_Portfolio_Observed_Skewness",
  "02170_Portfolio_Observed_Excess_Kurtosis",
  "02180_Portfolio_Observed_Stressed_Volatility",
  "02185_Portfolio_Past_Performance_Disclosure_Required",
  "02190_Past_Performance_Link",
  "02200_Previous_Performance_Scenarios_Calculation_Link",
  "02210_Past_Performance_Number_Of_Years",
  "02220_Reference_Invested_Amount",
  "03010_One_Off_Cost_Portfolio_Entry_Cost",
  "03015_One_Off_Cost_Portfolio_Entry_Cost_Acquired",
  "03020_One_Off_Costs_Portfolio_Exit_Cost_At_RHP",
  "03030_One_Off_Costs_Portfolio_Exit_Cost_At_1_Year",
  "03040_One_Off_Costs_Portfolio_Exit_Cost_At_Half_RHP",
  "03050_One_Off_Costs_Portfolio_Sliding_Exit_Cost_Indicator",
  "03060_Ongoing_Costs_Management_Fees_And_Other_Administrative_Or_Operating_Costs",
  "03080_Ongoing_Costs_Portfolio_Transaction_Costs",
  "03090_Existing_Incidental_Costs_Portfolio",
  "03095_Incidental_Costs",
  "04020_Comprehension_Alert_Portfolio",
  "04030_Intended_Target_Market_Retail_Investor_Portfolio",
  "04040_Investment_Objective_Portfolio",
  "04050_Risk_Narrative_Portfolio",
  "04060_Other_Materially_Relevant_Risk_Narrative_Portfolio",
  "04070_Type_Of_Underlying_Investment_Option",
  "04080_Capital_Guarantee",
  "04081_Capital_Guarantee_Level",
  "04082_Capital_Guarantee_Limitations",
  "04083_Capital_Guarantee_Early_Exit_Conditions",
  "04084_Capital_Guarantee_Portfolio",
  "04085_Possible_Maximum_Loss_Portfolio",
  "04086_Description_Past_Interval_Unfavourable_Scenario",
  "04087_Description_Past_Interval_Moderate_Scenario",
  "04088_Description_Past_Interval_Favourable_Scenario",
  "04089_Was_Benchmark_Used_Performance_Calculation",
  "04090_Portfolio_Performance_Fees_Carried_Interest_Narrative",
  "04120_One_Off_Cost_Portfolio_Entry_Cost_Description",
  "04130_One_Off_Cost_Portfolio_Exit_Cost_Description",
  "04140_Ongoing_Costs_Portfolio_Management_Costs_Description",
  "04150_Do_Costs_Depend_On_Invested_Amount",
  "04160_Cost_Dependence_Explanation",
  "06005_German_MOPs_Reference_Date",
  "06010_Bonds_Weight",
  "06020_Annualized_Return_Volatility",
  "06030_Duration_Bonds",
  "06040_Existing_Capital_Preservation",
  "06050_Capital_Preservation_Level",
  "06060_Time_Interval_Maximum_Loss",
  "06070_Uses_PI",
  "06080_Multiplier_PI",
  "07005_First_Possible_Call_Date",
  "07010_Total_Cost_1_Year_Or_First_Call",
  "07020_RIY_1_Year_Or_First_Call",
  "07030_Total_Cost_Half_RHP",
  "07040_RIY_Half_RHP",
  "07050_Total_Cost_RHP",
  "07060_RIY_RHP",
  "07070_One_Off_Costs_Portfolio_Entry_Cost",
  "07080_One_Off_Costs_Portfolio_Exit_Cost",
  "07090_Ongoing_Costs_Portfolio_Transaction_Costs",
  "07100_Ongoing_Costs_Management_Fees_And_Other_Administrative_Or_Operating_Costs",
  "07110_Incidental_Costs_Portfolio_Performance_Fees_Carried_Interest",
  "08010_UK_PRIIP_Or_UCITS_Or_Both_data_delivery",
  "08020_UK_Ongoing_Costs_Portfolio_Transaction_Costs",
  "08030_UK_Transactions_costs_methodology",
  "08040_UK_Anti_Dilution_Benefit_Derived",
  "08045_UK_PRIIPs_Data_Reference_Date",
  "08050_UK_PRIIPs_KID_Publication_Date",
  "08060_UK_PRIIPs_KID_Web_Address",
  "08070_Investment_Objective_Portfolio",
  "08080_UK_Other_Materially_Relevant_Risk_Narrative_Portfolio",
  "08090_UK_Performance_Information_Main_Factors",
  "08100_UK_Performance_Information_Comparator",
  "08110_UK_Performance_Information_Higher_Returns",
  "08120_UK_Performance_Information_Lower_Returns_Or_Loss",
  "08130_UK_Performance_Information_Adverse_Conditions",
  "08140_UK_Assumed_Portfolio_Return",
  "08150_UCITS_KIID_Publication_Date",
  "08160_UCITS_KIID_Web_Address",
  "08170_UCITS_SRRI",
  "08180_UCITS_Ongoing_Charges",
  "08190_UCITS_Existing_Performance_Fees",
  "08200_UCITS_Performance_Fees",
];

const fillOutHoles = (data: Record<string, any>[]): Record<string, any>[] => {
  const result: Record<string, any>[] = [];
  data.forEach((row: Record<string, any>) => {
    const filledRow: Record<string, any> = {};
    EPT_HEADERS.forEach((header: string) => {
      filledRow[header] = row[header] ? row[header] : null;
    });
    result.push(filledRow);
  });
  return result;
};

program
  .version(version)
  .argument("<files...>", "one or more excel files")
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

      let excelFileName = filePath.replace(/\.yaml/, "") + ".xlsx";
      excelFileName =
        excelFileName.split(/[\\/]/).pop() ?? filePath.replace(/\.yaml$/, "") + ".xlsx";

      const text = fs.readFileSync(filePath, "utf8");
      const data = parse(text);
      const patchedData = fillOutHoles(data);

      const worksheet = utils.json_to_sheet(patchedData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Sheet1");
      writeFile(workbook, excelFileName);
      console.log("wrote " + excelFileName);
    });
  })
  .parse(process.argv);
