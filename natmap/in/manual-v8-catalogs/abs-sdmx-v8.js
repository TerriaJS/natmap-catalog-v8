module.exports = {
  id: "DPYjz1cT",
  type: "sdmx-group",
  name: "ABS.Stat (Beta)",
  description:
    "Users of NationalMap can access the Beta release of the ABS Data API, which allows to preview the data API before it is released in its final form. It gives the opportunity to provide the ABS with feedback as it works to enhance the service by emailing api.data@abs.gov.au.  \n\nData in this ABS.Stat beta release may not necessarily be the most up to date. You are advised to check the [ABS website ](https://www.abs.gov.au/)for the latest data.  \nWe recognise that there are still some issues in the beta release. We have compiled a [list of issues ](https://www.abs.gov.au/websitedbs/D3310114.nsf/home/absstat+issues) identified so far and are currently working to rectify these. If further issues are discovered please let us know using api.data@abs.gov.au. The [ABS privacy policy ](https://www.abs.gov.au/about/legislation-and-policy/privacy/privacy-abshow) outlines how the ABS handles any personal information that you provide to us.  \n\nFor more information on the ABS.Stat Beta release, please refer to https://stat.data.abs.gov.au/.",
  url: "https://api.data.abs.gov.au",
  // Exclude LGA 2019/2020 datasets as we don't have regions
  excludeMembers: [
    "DPYjz1cT/category-LGA2019",
    "DPYjz1cT/category-LGA2020",
    "DPYjz1cT/dataflow-ABS_ANNUAL_ERP_LGA2019",
    "DPYjz1cT/dataflow-ABS_ANNUAL_ERP_LGA2020",
    "DPYjz1cT/dataflow-ERP_COMP_LGA2019",
    "DPYjz1cT/dataflow-ERP_LGA2019",
    "DPYjz1cT/dataflow-BA_LGA2021",
    "DPYjz1cT/dataflow-BA_LGA2020",
    "DPYjz1cT/dataflow-BA_LGA2019",
    "DPYjz1cT/dataflow-BA_LGA2018",
    // Remove hidden group which adds info to dataflows
    "abs-sdmx-hidden-group",
    // Remove COVID data with no timeseries or regions
    "DPYjz1cT/dataflow-COVID_SC",
    "DPYjz1cT/dataflow-COVID_SALTS",
    "DPYjz1cT/dataflow-COVID_HS",
    "DPYjz1cT/dataflow-COVID_HI",
  ],
  modelOverrides: [
    // Configure "region-type" dimensions
    // These are used to set region mapping type
    // Usually they include SA2, SA3, SA4, States and Territories
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).REGION_TYPE",
      type: "region-type",
      selectedId: "SA2",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_REGION_TYPE(1.1.0)",
      type: "region-type",
      selectedId: "SA2",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_REGION_TYPE(1.0.0)",
      type: "region-type",
      selectedId: "SA2",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).GEO_LEVEL",
      type: "region-type",
      selectedId: "SA2",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION_TYPE",
      type: "region-type",
      selectedId: "SA2",
    },
    // Configure "region" dimensions
    // Mark these dimensions as type "region" and set some "regionTypes" for some
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).REGION",
      type: "region",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION",
      type: "region",
    },
    {
      id: "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_STATE(1.0.0)",
      type: "region",
      regionType: "STE_2016",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_DEATHS_INDIGENOUS_STATES(1.0.0)",
      type: "region",
      regionType: "STE_2016",
    },
    {
      id: "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_GCCSA(1.0.0)",
      type: "region",
      regionType: "GCCSA_2016",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_NRM_2012(1.0.0)",
      type: "region",
      regionType: "NRMR",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_SSC_2016(1.0.0)",
      type: "region",
      regionType: "SSC_2016",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_SEIFA(1.0.0).SLA",
      type: "region",
      regionType: "SLA",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_SEIFA_SA1_2016(1.0.0)",
      type: "region",
      regionType: "SA1_7DIGIT_2016",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_C11_ASGS(1.0.0)",
      type: "region",
      regionTypeReplacements: [
        {
          find: "SA2_2016",
          replace: "SA2_2011",
        },
        {
          find: "SA3_2016",
          replace: "SA3_2011",
        },
        {
          find: "SA4_2016",
          replace: "SA4_2011",
        },
        {
          find: "STE_2016",
          replace: "STE_2011",
        },
      ],
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_C11_ASGS_SA(1.0.0)",
      type: "region",
      regionType: "SA1_2011",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_ASGS_2011(1.0.0)",
      type: "region",
      regionTypeReplacements: [
        {
          find: "SA2_2016",
          replace: "SA2_2011",
        },
        {
          find: "SA3_2016",
          replace: "SA3_2011",
        },
        {
          find: "SA4_2016",
          replace: "SA4_2011",
        },
        {
          find: "STE_2016",
          replace: "STE_2011",
        },
      ],
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).ASGS_2011",
      type: "region",
      regionTypeReplacements: [
        {
          find: "SA2_2016",
          replace: "SA2_2011",
        },
        {
          find: "SA3_2016",
          replace: "SA3_2011",
        },
        {
          find: "SA4_2016",
          replace: "SA4_2011",
        },
        {
          find: "STE_2016",
          replace: "STE_2011",
        },
      ],
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).REGION_SA1",
      type: "region",
      regionType: "SA1",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).STATE_TERR",
      type: "region",
      regionType: "STE_2016",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).LGA_2011",
      type: "region",
      regionType: "LGA_2011",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).LGA_2011",
      type: "region",
      regionType: "LGA_2011",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).IND_REGION",
      type: "region",
      regionType: "IREG",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION_ARR",
      type: "region",
      regionType: "SA4_2016",
    },
    // We don't have "Australian Agricultural Environments" (AAE) - so use State instead
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_ASGS_AAE(1.0.0)",
      type: "region",
      regionType: "STE_2016",
    },
    // We don't have "Federal electoral divisions" (FED) - so use State instead
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).FED",
      type: "region",
      regionType: "STE_2016",
    },
    // We don't have "Federal electoral divisions" (FED) - so use State instead
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_AEC_FED_2017(1.0.0)",
      type: "region",
      regionType: "STE_2016",
    },
    // This is a State dimension - which can mess with region mapping
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).STATE",
      disable: true,
      allowUndefined: true,
    },
    // Set some default values for problematic dimensions
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_PERSON(1.0.0).AGE",
      selectedId: "TOT",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_DEMOG(1.0.0).AGE",
      selectedId: "TT",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_REGIONAL_LGA2020_MEASURE(1.0.0)",
      selectedId: "ERP_P_20",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_LEND_LOANTYPE(1.0.0)",
      selectedId: "DV8541",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_LEND_HOUSING_LOANPURP(1.0.0)",
      selectedId: "TOTHOUS",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ABS:CL_LEND_PERSONAL_LOANPURP(1.0.0)",
      selectedId: "TOTLOANPURP_EXCLREFIN",
    },
  ],
  // This is used to override dataflow properties without having to re-create group structure - this group is hidden from view
  members: [
    {
      id: "abs-sdmx-hidden-group",
      type: "group",
      members: [
        // Mariage postal survey datasets only have state info for GEO_LEVEL (Not SAs) - so disable dimension
        {
          id: "DPYjz1cT/dataflow-AMLPS_PART_2017",
          type: "sdmx-json",

          modelOverrides: [
            {
              id:
                "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).GEO_LEVEL",
              type: "region-type",
              selectedId: "STE",
              disable: true,
            },
          ],
        },
        {
          id: "DPYjz1cT/dataflow-AMLPS_RESP_2017",
          type: "sdmx-json",
          modelOverrides: [
            {
              id:
                "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).GEO_LEVEL",
              type: "region-type",
              selectedId: "STE",
              disable: true,
            },
          ],
        },
        // Longitudinal datasets don't have correct region info - so set manually to state
        {
          id: "DPYjz1cT/dataflow-ABS_ACLD_UNPAIDASST",
          type: "sdmx-json",
          modelOverrides: [
            {
              id:
                "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION",
              type: "region",
              regionType: "STE_2016",
            },
          ],
        },
        {
          id: "DPYjz1cT/dataflow-ABS_ACLD_TENURE",
          type: "sdmx-json",
          modelOverrides: [
            {
              id:
                "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION",
              type: "region",
              regionType: "STE_2016",
            },
          ],
        },
        {
          id: "DPYjz1cT/dataflow-ABS_ACLD_VOLWORK",
          type: "sdmx-json",
          modelOverrides: [
            {
              id:
                "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION",
              type: "region",
              regionType: "STE_2016",
            },
          ],
        },
        {
          id: "DPYjz1cT/dataflow-ABS_ACLD_LFSTATUS",
          type: "sdmx-json",
          modelOverrides: [
            {
              id:
                "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).REGION",
              type: "region",
              regionType: "STE_2016",
            },
          ],
        },
      ],
    },
  ],
};
