"use strict";
const _ = require("lodash");
const cloneFromCatalogPath = require("../helpers/cloneFromCatalogPath");
const findInMembers = require("../helpers/findInMembers");
const recursivelySortMembersByName = require("../helpers/recursivelySortMembersByName");
const modifyNetworkOpportunities = require("./network-opportunities");
const natmap20210921v8 = require("./in/natmap-2021-09-21-v8.json");
const aremi20210921v8 = require("./in/aremi-2021-09-21-v8.json");
const absSdmx = require("./in/manual-v8-catalogs/abs-sdmx-v8.js");
const aremiEvTraffic = require("./in/manual-v8-catalogs/aremi-traffic-v8.json");
const gaNewLayers = require("./in/manual-v8-catalogs/ga-new-layers-v8.json");

function cables(Cables) {
  Cables.layers = "cite:Cables_20210415";
}

function substations(Substations) {
  Substations.layers = "cite:Substations_20210415";
}

// remove "Land Use" subgroup from Agriculture
const Agriculture = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Agriculture",
]);
Agriculture.members = Agriculture.members.filter(
  (m) =>
    m.name !== "Land Use and Cover in South Australia" &&
    m.name !== "Catchment Scale Land Use 2018 [18 class classification]" &&
    m.name !== "Catchment Scale Land Use 2018 [Agricultural industries]" &&
    m.name !== "Catchment Scale Land Use 2018 [Agriculture]" &&
    m.name !== "Catchment Scale Land Use 2018 [Primary classification]" &&
    m.name !== "Catchment Scale Land Use 2018 [Secondary classification]" &&
    m.name !== "Agricultural Exposure" &&
    m.name !== "Australia’s Indigenous Forest Estate (2018)"
);

// Update URL
Agriculture.members.map(m => {
  if (m.name === "Forests of Australia (2018)") {
    m.type = "esri-mapServer",
      m.url = "http://www.asris.csiro.au/arcgis/rest/services/abares/forests_of_australia_2018/MapServer",
      m.layers = "0"
  }
})

// Add catchment as group.
const catchmentGroup = {
  type: "esri-mapServer-group",
  name: "Catchment Scale Land Use",
  url:
    "https://www.environment.gov.au/mapping/rest/services/abares/CLUM_50m/MapServer",
  id: "fdd5fa7d-8cfe-416d-a061-bb603a0f7079",
  shareKeys: [
    "Root Group/National Datasets/Agriculture/Catchment Scale Land Use",
    "Root Group/National Datasets/Land Cover and Land Use/Land Use and Cover/Catchment Scale Land Use",
  ],
};

Agriculture.members = [...Agriculture.members, catchmentGroup];

// remove ABC Photo Stories from Communications
const Communications = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Communications",
]);

const MobileBlackspot5 = {
  type: "ckan-item",
  name: "Mobile Black Spot Program - Round 5 Funded Base Stations",
  url: "https://data.gov.au",
  datasetId: "mobile-black-spot-program-round-5-funded-base-stations",
  resourceId: "7916e08c-2826-4f5a-b7f7-c849f1aa64d8",
  itemProperties: {
    opacity: 1,
    clipToRectangle: true,
  },
  supportedResourceFormats: [],
  id: "15152ee2-4dab-4fcf-8ff1-d8f4108f88d2",
  shareKeys: [
    "Root Group/National Datasets/Communications/Mobile Black Spot Program - Round 5 Funded Base Stations",
  ],
};

// Insert Mobile Black Spot Program - Round 4 Funded Base Stations
Communications.members.splice(
  Communications.members.findIndex(
    (val) =>
      val.name === "Mobile Black Spot Program - Round 4 Funded Base Stations"
  ) + 1,
  0,
  MobileBlackspot5
);

const TelecomsInNewDev = findInMembers(Communications.members, [
  "Telecommunications in New Developments",
]);

// Don't use resourceId that might change over time. Instead, use datasetId that is "telecommunications-in-new-developments".
TelecomsInNewDev.resourceId = undefined;
Communications.members = Communications.members
  .filter((m) => m.name !== "ABC Photo Stories (2009-2014)")
  .filter((m) => m.name !== "ABC Photo Stories by date");

const RadionLicenses = findInMembers(Communications.members, [
  "Radio Licenses - ACMA",
]);
RadionLicenses.url = RadionLicenses.url.replace("http://", "https://");
RadionLicenses.legends = undefined;

// Elevation
// move Terrain subgroup from Land Cover
const Terrain = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Land Cover and Land Use",
  "Terrain",
]);
Terrain.members.push(
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Elevation",
    "Contours",
  ]),
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Elevation",
    "Cuttings",
  ]),
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Elevation",
    "Embankments",
  ])
);
const Elevation = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Elevation",
]);
Elevation.members.push(Terrain);
Elevation.members = Elevation.members
  .filter((m) => m.name !== "Intertidal")
  .filter((m) => m.name !== "Aspect")
  .filter((m) => m.name !== "Land slope in percent")
  .filter((m) => m.name !== "Offshore Rocks and Wrecks")
  .filter((m) => m.name !== "Reefs and Shoals")
  .filter((m) => m.name !== "Contours")
  .filter((m) => m.name !== "Cuttings")
  .filter((m) => m.name !== "Embankments");

const ElectricVehicle = cloneFromCatalogPath(aremi20210921v8, [
  "Electric Vehicle",
]);

ElectricVehicle.members.push(...aremiEvTraffic);

const evRegistrationsByPostcode = findInMembers(ElectricVehicle.members, [
  "EV registrations by postcode",
]);

evRegistrationsByPostcode.columns = evRegistrationsByPostcode.columns.filter(
  (c) => c.name !== "Postcode"
);

evRegistrationsByPostcode.styles.find((s) => s.id === "Registrations").color = {
  colorPalette: "Blues",
};

cables(
  findInMembers(ElectricVehicle.members, [
    "Electricity Infrastructure",
    "Distribution Cables",
  ])
);

substations(
  findInMembers(ElectricVehicle.members, [
    "Electricity Infrastructure",
    "Distribution Substations",
  ])
);

const LandParcelAndProperty = {
  type: "group",
  name: "Land Parcel and Property",
  description:
    "The **Land Parcel and Property** is the new name of **Cadastre and Land Tenure** data group seen in this Energy section of the catalogue have been migrated from the former **Australian Renewable Energy Mapping Infrastructure (AREMI)** site to its new home here on National Map Beta platform. Should  you encounter discrepancies with the former AREMI functionality or content, please send us feedback at [info@terria.io](mailto:info@terria.io). The migration will be finalised once all the issues have been addressed.",
  members: [
    cloneFromCatalogPath(aremi20210921v8, [
      "Boundaries",
      "Cadastre and Land Tenure",
      "By State",
    ]),
  ],
};

LandParcelAndProperty.members.map((m) => {
  if (m.name === "By State") {
    m.members.map((m) => {
      if (m.name === "Cadastral Parcels - New South Wales") {
        m.name = "NSW";
      } else if (m.name === "Cadastral Parcels - Tasmania") {
        m.name = "TAS";
        m.rectangle = {
          west: 143.7,
          south: -43.8,
          east: 148.7,
          north: -40.3,
        };
      } else if (m.name === "Cadastral Parcels - Western Australia") {
        m.name = "WA";
      } else if (m.name === "Northern Territory") {
        m.name = "NT";
      } else if (m.name === "Queensland") {
        m.name = "QLD";
      } else if (m.name === "ACT") {
        m.members = [
          {
            type: "esri-mapServer-group",
            name: "Current Land Custodianship",
            id: "28d11d91-07be-4312-a3eb-b1ce2be60b2e",
            url:
              "https://data.actmapi.act.gov.au/arcgis/rest/services/actmapi/land_custodianship_current/MapServer",
            shareKeys: [
              "Root Group/National Datasets/Boundaries/Cadastre and Land Tenure/By State/ACT/Current Land Custodianship",
            ],
          },
        ];
      }
    });
  }
});

const ElectricityInfrastructure = cloneFromCatalogPath(aremi20210921v8, [
  "Electricity Infrastructure",
]);
const GenerationGroup = findInMembers(ElectricityInfrastructure.members, [
  "Generation",
]);
GenerationGroup.members = GenerationGroup.members.filter(
  (m) => m.name !== "Diesel Generators - South Australia"
);
const NetworkOpportunities = findInMembers(ElectricityInfrastructure.members, [
  "Network Opportunities",
]);

cables(
  findInMembers(NetworkOpportunities.members, [
    "Supporting Information",
    "Distribution Cables",
  ])
);

substations(
  findInMembers(NetworkOpportunities.members, [
    "Supporting Information",
    "Distribution Substations",
  ])
);

modifyNetworkOpportunities(NetworkOpportunities);

// Preserve order of NOM
const preserveOrderNOM = NetworkOpportunities.members.slice();

const RenewableEnergy = cloneFromCatalogPath(aremi20210921v8, [
  "Renewable Energy",
]);

const Bioenergy = findInMembers(RenewableEnergy.members, ["Bioenergy"]);

Bioenergy.description =
  "<p>Biomass data on the AREMI is developed and maintained through the Australian Biomass for Bioenergy Assessment, funded by the Australian Renewable Energy Agency. The project timeframe is 2015-2020, with further development and maintenance continuing beyond this timeframe through the partner organisations (custodians of the data), listed below.</p><p>The purpose of the Australian Biomass and Bioenergy Assessment is to catalyse investment in the renewable energy sector through the provision of detailed information about biomass resources across Australia, to assist in project development and decision making for new bioenergy projects, and provide linkages between biomass supply, thorough the supply chain, to the end user.</p><p>The bioenergy data may be integrated with other layers on the AREMI, such as electricity infrastructure, to aid in decision making. Analytical capabilities are also under development with Queensland University of Technology, and University of the Sunshine Coast.</p><p>The partner organisations and contact details are:</p><p>  <strong>Western Australia - Department of Primary Industries and Regional Development</strong><br/>  Kim Brooksbank<br/>  Email: <strong><a href='kim.brooksbank@dpird.wa.gov.au'>kim.brooksbank@dpird.wa.gov.au</a></strong><br/><br />  Ronald Master<br/>  Email: <strong><a href='ronald.master@dpird.wa.gov.au'>ronald.master@dpird.wa.gov.au</a></strong></p><p>  <strong>Victoria - Sustainability Victoria</strong><br/>  Kelly Wickham<br/>  Email: <strong><a href='Kelly.Wickham@sustainability.vic.gov.au'>Kelly.Wickham@sustainability.vic.gov.au</a></strong></p><p>  <strong>Tasmania - Department of State Growth</strong><br/>  Martin Moroni<br/>  Email: <strong><a href='Martin.Moroni@stategrowth.tas.gov.au'>Martin.Moroni@stategrowth.tas.gov.au</a></strong></p><p>  <strong>New South Wales - Department of Primary Industries - Forestry</strong><br/>  Fabiano Ximenes<br/>  Email: <strong><a href='fabiano.ximenes@dpi.nsw.gov.au'>fabiano.ximenes@dpi.nsw.gov.au</a></strong></p><p>  <strong>South Australia - Department for Energy & Mining</strong><br/>  Mary Lewitzka<br/>  Email: <strong><a href='Mary.Lewitzka@sa.gov.au'>Mary.Lewitzka@sa.gov.au</a></strong></p><p>  <strong>Queensland -  Department of Environment and Science</strong><br/>  Kelly Bryant<br/>  Email: <strong><a href='Kelly.Bryant@des.qld.gov.au'>Kelly.Bryant@des.qld.gov.au</a></strong></p><p>  <strong>Research, analytics - Queensland University of Technology, University of Sunshine Coast</strong><br/>  Ian O'Hara<br/>  Email: <strong><a href='i.ohara@qut.edu.au'>i.ohara@qut.edu.au</a></strong></p>";

const BioenergyWa = findInMembers(RenewableEnergy.members, [
  "Bioenergy",
  "Western Australia",
]);

BioenergyWa.members = BioenergyWa.members.map((m) => {
  if (m.url === "http://catalogue.beta.data.wa.gov.au") {
    m.url = "https://catalogue.data.wa.gov.au";
  }
  // Delete terriable styling
  if (m.itemProperties?.defaultStyle?.color) {
    delete m.itemProperties.defaultStyle.color;
  }
  if (Array.isArray(m.members)) {
    m.members.forEach((m2) => {
      if (m2.itemProperties?.defaultStyle?.color) {
        delete m2.itemProperties.defaultStyle.color;
      }
    });
  }
  return m;
});

const BioenergyQldMeatProcessing = findInMembers(RenewableEnergy.members, [
  "Bioenergy",
  "Queensland",
  "Food Processing",
  "Meat Processing",
]);

BioenergyQldMeatProcessing.itemProperties.defaultColumn = {
  replaceWithNullValues: ["Unknown"],
};

const BioenergyNationalCatchment = findInMembers(RenewableEnergy.members, [
  "Bioenergy",
  "National",
  "Catchment Scale Land Use"
]);

BioenergyNationalCatchment.url = "https://data.gov.au"

// Energy group
const Energy = {
  type: "group",
  name: "Energy",
  description:
    "The **Electricity Infrastructure**, **Renewable Energy** and **Research** data groups seen in this Energy section of the catalogue have been migrated from the former **Australian Renewable Energy Mapping Infrastructure (AREMI)** site to its new home here on National Map Beta platform. Should  you encounter discrepancies with the former AREMI functionality or content, please send us feedback at [info@terria.io](mailto:info@terria.io). The migration will be finalised once all the issues have been addressed.",
  members: [
    ElectricityInfrastructure,
    RenewableEnergy,
    cloneFromCatalogPath(aremi20210921v8, ["Research"]),
    ElectricVehicle,
    cloneFromCatalogPath(natmap20210921v8, [
      "National Datasets",
      "Framework",
      "Electricity Transmission Lines",
    ]),
    cloneFromCatalogPath(natmap20210921v8, [
      "National Datasets",
      "Framework",
      "Electricity Transmission Substations",
    ]),
  ],
};

// Filter out duplicates as they are already in group "Electricity Infrastructure" -> "Transmission".
Energy.members = Energy.members.filter(
  (m) =>
    m.name !== "Electricity Transmission Lines" &&
    m.name !== "Electricity Transmission Substations"
);

Energy.members.map((m) => {
  if (m.name === "Electricity Infrastructure") {
    m.members.map((m) => {
      if (m.name === "Generation") {
        m.members.map((m) => {
          if (m.name === "All Power Stations") {
            m.name = "Power Stations";
            m.url =
              "https://services.ga.gov.au/gis/rest/services/Foundation_Electricity_Infrastructure/MapServer";
            m.layers = "0";
          }
        });
      } else if (m.name === "Transmission") {
        m.members = m.members
          // Filter out "Distance to Transmission Lines" and "Distance to Transmission Substations"
          .filter(
            (m) =>
              m.name !== "Distance to Transmission Lines" &&
              m.name !== "Distance to Transmission Substations"
          )
          .map((m) => {
            if (m.name === "Substations") {
              m.name = "Transmission Substations";
              m.url =
                "https://services.ga.gov.au/gis/rest/services/Foundation_Electricity_Infrastructure/MapServer";
              m.dataUrls[0].url = 
                "https://services.ga.gov.au/gis/services/Foundation_Electricity_Infrastructure/MapServer/WFSServer?service=WFS&request=GetFeature&typeName=Foundation_Electricity_Infrastructure:Transmission_Substations&srsName=EPSG%3A4326&maxFeatures=10000";
              m.layers = "1";
            } else if (m.name === "Transmission Lines") {
              m.name = "Electricity Transmission Lines";
              m.url =
                "https://services.ga.gov.au/gis/rest/services/Foundation_Electricity_Infrastructure/MapServer";
              m.dataUrls[0].url = 
                "https://services.ga.gov.au/gis/services/Foundation_Electricity_Infrastructure/MapServer/WFSServer?service=WFS&request=GetFeature&typeName=Foundation_Electricity_Infrastructure:Electricity_Transmission_Lines&srsName=EPSG%3A4326&maxFeatures=10000";
              m.layers = "2";
            }
            return m;
          });
      }
    });
  }
});

// Environment group
const Environment = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Environment",
]);
// TODO: State of the Environment 2016 group should be isPromoted, but v8 doesn't support it yet

// Move initalMessage from group to members
const soe2016 = findInMembers(Environment.members, [
  "State of the Environment 2016",
]);

const replaceMembersInitialMessage = (members) => {
  members.forEach((m) => {
    if (m.members) {
      replaceMembersInitialMessage(m.members);
    } else {
      m.initialMessage = soe2016.initialMessage;
    }
  });
};

replaceMembersInitialMessage(soe2016.members);

delete soe2016.initialMessage;

// Habitation group
const Habitation = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Habitation",
]);
// combine Cemetery Points and Areas into one layer
const Cemeteries = findInMembers(Habitation.members, ["Cemetery Points"]);
Cemeteries.name = "Cemeteries";
Cemeteries.layers = "Cemetery_Areas,Cemetery_Points"; // fix bad MapServer requiring numerical layer name
Habitation.members = Habitation.members.filter(
  (m) => m.name !== "Cemetery Areas"
);

findInMembers(Habitation.members, ["Australia Post Locations"]).url =
  "https://tiles.terria.io/static/auspost-locations.csv";

// Health group
const Health = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Health",
]);
Health.members = Health.members.filter(
  (m) =>
    m.name !== "Victorian Local Government Area Stage 4 Lockdown 2 August 2020"
);

// Update URL
Health.members.map(m => {
  if (m.name === "Medicare Offices") {
    m.name = "Location of Services Australia Offices",
      m.datasetId = "70c2b2fe-2a32-450e-98dc-453fe4a02aae",
      m.resourceId = "5a45d7b2-8579-425b-bb46-53a0e0bfa053",
      m.shareKeys = [
        "Root Group/National Datasets/Health/Location of Services Australia Offices"
      ]
  }
})

// Infrastructure group
const Infrastructure = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Infrastructure",
]);
Infrastructure.members.push();
Infrastructure.members = Infrastructure.members.filter(
  (m) => m.name !== "Vertical Obstructions"
);

const oilAndGasPipelines = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Utility",
  "Oil and Gas Pipelines",
]);

Infrastructure.members.push(oilAndGasPipelines);

// Land Cover and Land Use
const LandCover = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Land Cover and Land Use",
]);
LandCover.members = LandCover.members.filter(
  (m) => m.name !== "Terrain" && m.name !== "Mining"
);
LandCover.members.map((landCoverMember) => {
  if (landCoverMember.name === "Land Use and Cover") {
    landCoverMember.members = landCoverMember.members.filter(
      (m) =>
        m.name !== "Land Use and Cover in South Australia" &&
        m.name !== "Catchment Scale Land Use 2018 [18 class classification]" &&
        m.name !== "Catchment Scale Land Use 2018 [Agricultural industries]" &&
        m.name !== "Catchment Scale Land Use 2018 [Agriculture]" &&
        m.name !== "Catchment Scale Land Use 2018 [Primary classification]" &&
        m.name !== "Catchment Scale Land Use 2018 [Secondary classification]" &&
        m.name !== "Australia’s Indigenous Forest Estate (2018)"
    );

    // Update URL
    landCoverMember.members.map(m => {
      if (m.name === "Forests of Australia (2018)") {
        m.type = "esri-mapServer",
          m.url = "http://www.asris.csiro.au/arcgis/rest/services/abares/forests_of_australia_2018/MapServer",
          m.layers = "0"
      }
    })

    landCoverMember.members.push(catchmentGroup);
  }
});

// Marine and Oceans
const MarineOceans = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Marine and Oceans",
]);
// add the shareKey of the removed NIDEM layer from Elevation
const NIDEM = findInMembers(MarineOceans.members, [
  "Coastal",
  "Intertidal elevation model",
  "NIDEM - Intertidal elevation model",
]);
NIDEM["shareKeys"] = [
  "Root Group/National Data Sets/Elevation/Intertidal/Intertidal elevation model/NIDEM - Intertidal elevation model",
];
MarineOceans.members.push(
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Elevation",
    "Reefs and Shoals",
  ]),
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Elevation",
    "Offshore Rocks and Wrecks",
  ]),
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Framework",
    "Ocean and Sea Names",
  ]),
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Framework",
    "Marine Parks",
  ])
);

// Boundaries
const Boundaries = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "National Boundaries",
]);
Boundaries.name = "Boundaries";
Boundaries.members = [
  {
    name: "Statistical boundaries",
    type: "group",
    members: cloneFromCatalogPath(natmap20210921v8, [
      "National Datasets",
      "Statistical Boundaries",
    ]).members,
  },
  {
    name: "Jurisdictional boundaries",
    type: "group",
    members: [
      findInMembers(Boundaries.members, ["Local Government Areas (2011)"]),
      findInMembers(Boundaries.members, ["Local Government Areas (2019)"]),
      findInMembers(Boundaries.members, ["State Suburbs"]),
      findInMembers(Boundaries.members, ["States & Territories"]),
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Australian Mainland",
      ]),
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "State Borders",
      ]),
    ],
  },
  {
    name: "Electoral boundaries",
    type: "group",
    members: [
      findInMembers(Boundaries.members, [
        "Commonwealth Electoral Divisions (2019)",
      ]),
      findInMembers(Boundaries.members, [
        "Commonwealth Electoral Divisions (2016)",
      ]),
      findInMembers(Boundaries.members, [
        "Commonwealth Electoral Divisions (2011)",
      ]),
      findInMembers(Boundaries.members, ["State Electoral Divisions (2018)"]),
    ],
  },
  {
    name: "Maritime boundaries",
    type: "group",
    members: [
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Coastline - Islands",
      ]),
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Marine Parks",
      ]),
    ],
  },
  {
    name: "Native title boundaries",
    type: "group",
    members: [
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Indigenous Reserves",
      ]),
    ],
  },
  {
    name: "Other areas",
    type: "group",
    members: [
      findInMembers(Boundaries.members, ["Postal Areas (2011)"]),
      findInMembers(Boundaries.members, ["Postal Areas (2016)"]),
      findInMembers(Boundaries.members, ["Australian Drainage Divisions"]),
      findInMembers(Boundaries.members, [
        "Natural Resource Management Regions",
      ]),
      findInMembers(Boundaries.members, ["Tourism Regions"]),
      findInMembers(Boundaries.members, ["ASGS Remoteness Area (2016)"]),
      findInMembers(Boundaries.members, ["ASGS Remoteness Area (2011)"]),
      findInMembers(Boundaries.members, ["CDP Regions (2017)"]),
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Large Area Features",
      ]),
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Northern Australia Infrastructure Facility Boundary",
      ]),
      cloneFromCatalogPath(natmap20210921v8, [
        "National Datasets",
        "Framework",
        "Prohibited Areas",
      ]),
    ],
  },
  LandParcelAndProperty,
];

// Satellite Images
// This is a terria-reference type that will load the group
// from the catalog pointed by url at runtime.
const SatelliteImages = {
  id: "6ATFM7CB",
  type: "terria-reference",
  url:
    "https://raw.githubusercontent.com/GeoscienceAustralia/dea-config/master/dev/terria/dea-maps-v8.json",
  name: "Satellite Images",
  isGroup: true,
  cacheDuration: "1h"
};

// Social and Economic
const SocialEconomic = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Social and Economic",
]);

// Remove groups with old SDMX
SocialEconomic.members = SocialEconomic.members.filter(
  (member) =>
    ![
      "Births and Deaths",
      "Census",
      "Labour Force",
      "Marriage Law Postal Survey",
      "Migration",
      "Projections",
      "Socio-Economic Indices",
      "Housing"
    ].includes(member.name)
);

SocialEconomic.members.push(absSdmx);

// Remove old SDMX items
SocialEconomic.members.map((socialEconomicMember) => {
  if (socialEconomicMember.name === "Population Estimates") {
    socialEconomicMember.members = socialEconomicMember.members.filter(
      (m) =>
        ![
          "Annual Estimated Resident Population",
          "Annual Estimated Resident Population by Age by Sex",
          "Annual Estimated Resident Population by Country of Birth by Age",
        ].includes(m.name)
    );

    socialEconomicMember.members.map((populationEstimatesMember) => {
      if (populationEstimatesMember.name === "Residential Population Density") {
        populationEstimatesMember.type = "esri-mapServer";
        populationEstimatesMember.url =
          "http://services.ga.gov.au/gis/rest/services/NEXIS_Residential_Dwelling_Density/MapServer";
        populationEstimatesMember.name = "Residential Dwelling Density";

        // Fix incorrect extents provided by the source.
        populationEstimatesMember.rectangle = {
          east: 158,
          north: -8,
          south: -45,
          west: 109,
        };

        populationEstimatesMember.featureInfoTemplate = {
          template:
            "{{Pixel Value}} dwellings – {{#terria.partialByName}}{{feature.data.layerId}}{{/terria.partialByName}} Grid.",
          partials: {
            0: "100m",
            1: "500m",
            2: "1km",
            3: "2km",
          },
        };

        // Fix incorrect legends created by terriajs.
        populationEstimatesMember.legends = [
          {
            title: "2km Grid:",
            items: [
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigtf7CPfTAknRgYGBhp7edTAUQNHDRw1ELuBsCKITMCIbiBFpsEAANAcBK6KG1h6AAAAAElFTkSuQmCC",
                title: "1 - 600",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigvvF5NvpmIvIwMDA429PGrgqIGjBo4aiN1AWBFEJmBEN5Ai02AAAO0FBQLK2PVsAAAAAElFTkSuQmCC",
                title: "601 - 1,200",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigtXpZ8l26SwmcYMDAw09vKogaMGjho4aiB2A2FFEJmAEd1ARkpMgwEAFJ8FdXH+mOYAAAAASUVORK5CYII=",
                title: "1,201 - 2,200",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigsLXDvJNmnC7nIGBgYae3nUwFEDRw0cNRC7gbAiiEzAiG4gIyWmwQAAS5UGFdAYh78AAAAASUVORK5CYII=",
                title: "2,201 - 3,500",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigu9GYrJNmkrQy8DAwONvTxq4KiBowaOGojdQFgRRCZgRDeQkRLTYAAAzEoElV78ljkAAAAASUVORK5CYII=",
                title: "3,501 - 20,000",
              },
            ],
          },
          {
            title: "1km Grid:",
            items: [
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigtf7CPfTAknRgYGBhp7edTAUQNHDRw1ELuBsCKITMCIbiBFpsEAANAcBK6KG1h6AAAAAElFTkSuQmCC",
                title: "1 - 400",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigvvF5NvpmIvIwMDA429PGrgqIGjBo4aiN1AWBFEJmBEN5Ai02AAAO0FBQLK2PVsAAAAAElFTkSuQmCC",
                title: "401 - 800",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigtXpZ8l26SwmcYMDAw09vKogaMGjho4aiB2A2FFEJmAEd1ARkpMgwEAFJ8FdXH+mOYAAAAASUVORK5CYII=",
                title: "801 - 1,200",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigsLXDvJNmnC7nIGBgYae3nUwFEDRw0cNRC7gbAiiEzAiG4gIyWmwQAAS5UGFdAYh78AAAAASUVORK5CYII=",
                title: "1,201 - 1,700",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigu9GYrJNmkrQy8DAwONvTxq4KiBowaOGojdQFgRRCZgRDeQkRLTYAAAzEoElV78ljkAAAAASUVORK5CYII=",
                title: "1,701 - 8,000",
              },
            ],
          },
          {
            title: "500m Grid:",
            items: [
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigtf7CPfTAknRgYGBhp7edTAUQNHDRw1ELuBsCKITMCIbiBFpsEAANAcBK6KG1h6AAAAAElFTkSuQmCC",
                title: "1 - 200",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigvvF5NvpmIvIwMDA429PGrgqIGjBo4aiN1AWBFEJmBEN5Ai02AAAO0FBQLK2PVsAAAAAElFTkSuQmCC",
                title: "201 - 450",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigtXpZ8l26SwmcYMDAw09vKogaMGjho4aiB2A2FFEJmAEd1ARkpMgwEAFJ8FdXH+mOYAAAAASUVORK5CYII=",
                title: "451 - 650",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigsLXDvJNmnC7nIGBgYae3nUwFEDRw0cNRC7gbAiiEzAiG4gIyWmwQAAS5UGFdAYh78AAAAASUVORK5CYII=",
                title: "651 - 900",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigu9GYrJNmkrQy8DAwONvTxq4KiBowaOGojdQFgRRCZgRDeQkRLTYAAAzEoElV78ljkAAAAASUVORK5CYII=",
                title: "901 - 3,000",
              },
            ],
          },
          {
            title: "100m Grid:",
            items: [
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigtf7CPfTAknRgYGBhp7edTAUQNHDRw1ELuBsCKITMCIbiBFpsEAANAcBK6KG1h6AAAAAElFTkSuQmCC",
                title: "1 - 5",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGlgf+pYB4jigvvF5NvpmIvIwMDA429PGrgqIGjBo4aiN1AWBFEJmBEN5Ai02AAAO0FBQLK2PVsAAAAAElFTkSuQmCC",
                title: "6 - 20",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigtXpZ8l26SwmcYMDAw09vKogaMGjho4aiB2A2FFEJmAEd1ARkpMgwEAFJ8FdXH+mOYAAAAASUVORK5CYII=",
                title: "21 - 30",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigsLXDvJNmnC7nIGBgYae3nUwFEDRw0cNRC7gbAiiEzAiG4gIyWmwQAAS5UGFdAYh78AAAAASUVORK5CYII=",
                title: "31 - 100",
              },
              {
                imageUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAD1JREFUOI1jYaAyYKGlgf+pYB4jigu9GYrJNmkrQy8DAwONvTxq4KiBowaOGojdQFgRRCZgRDeQkRLTYAAAzEoElV78ljkAAAAASUVORK5CYII=",
                title: "101 - 600",
              },
            ],
          },
        ];
      }
    });
  } else if (socialEconomicMember.name === "Finance, Business and Trade") {
    // Remove old SDMX item
    socialEconomicMember.members = socialEconomicMember.members.filter(
      (m) => m.name !== "Building Approvals"
    );
    socialEconomicMember.members.map((m) => {
      if (m.name === "Industrial Building Exposure") {
        const index = socialEconomicMember.members.indexOf(m);
        if (index > -1) {
          socialEconomicMember.members.splice(index, 1);
        }
      }
    });
    const aei = {
      type: "wms-group",
      name: "Australian Exposure Information",
      id:
        "Root Group/National Data Sets/Social and Economic/Australian Exposure Information",
      url: " https://services-em.ga.gov.au/geoserver/exposure/ows",
      shareKeys: [
        "Root Group/National Datasets/Social and Economic/Finance, Business and Trade/Australian Exposure Information",
      ],
    };

    socialEconomicMember.members.push(aei);
  }
});

// Transport
const Transport = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Transport",
]);

// Update to Foundation Rail Infrastructure
Transport.members.map((m) => {
  if (m.name === "Rail") {
    m.members.map((m) => {
      if (m.name === "Railway Stations") {
        m.url =
          "https://services.ga.gov.au/gis/rest/services/Foundation_Rail_Infrastructure/MapServer";
        m.layers = "0";
      } else if (m.name === "Railways") {
        m.name = "Railway Lines";
        m.url =
          "https://services.ga.gov.au/gis/rest/services/Foundation_Rail_Infrastructure/MapServer";
        m.layers = "1";
      }
    });
  }
});

// Remove old "Key Freight Routes" group.
Transport.members = Transport.members.filter(
  (m) => m.name !== "Key Freight Routes"
);

// Create a new keyFreightRouts group.
const keyFreightRouts = {
  type: "esri-mapServer-group",
  name: "Key Freight Routes",
  url:
    "https://spatial.infrastructure.gov.au/server/rest/services/KeyFreightRoutes/Key_Freight_Routes/MapServer",
  id: "2d8b5d7f-3abc-44d7-bea1-c1161b571072",

  shareKeys: ["Root Group/National Datasets/Transport/Key Freight Routes"],
};

// Re-add keyFreightRouts group.
Transport.members.push(keyFreightRouts);

// Vegetation
const Vegetation = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Vegetation",
]);

// Water
const Water = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
  "Water",
]);

const Surface = findInMembers(Water.members, ["Surface Water"]);
Surface.members.push(
  cloneFromCatalogPath(natmap20210921v8, [
    "National Datasets",
    "Framework",
    "Water Supply Reserves",
  ])
);

// Set WaterStations data to correct custodian
Surface.members.map((m) => {
  if (m.name === "Water Stations Data") {
    m.dataCustodian = "Bureau of Meteorology";
  }
});

// assemble the National Datasets group
const NationalDatasets = cloneFromCatalogPath(natmap20210921v8, [
  "National Datasets",
]);
NationalDatasets.members = recursivelySortMembersByName([
  Agriculture,
  Communications,
  Elevation,
  Energy,
  Environment,
  Habitation,
  Health,
  Infrastructure,
  LandCover,
  MarineOceans,
  Boundaries,
  SatelliteImages,
  SocialEconomic,
  Transport,
  Vegetation,
  Water,
]);
// Restore Network Opportunities Maps layer order
findInMembers(NationalDatasets.members, [
  "Energy",
  "Electricity Infrastructure",
  "Network Opportunities",
]).members = preserveOrderNOM;

// Create Resources group
const resources = {
  type: "group",
  name: "Resources",
  id: "df11d3d1-0e32-4fb5-982f-bdb725406e44",
  members: [],
  shareKeys: ["Root Group/National Datasets/Resources"],
};

NationalDatasets.members.push(resources);
NationalDatasets.members = recursivelySortMembersByName(
  NationalDatasets.members
);

gaNewLayers["catalog"].map((m) => {
  const path = m.catalogPath;
  const group = findInMembers(NationalDatasets.members, path);
  if (group) {
    delete m.catalogPath;
    group.members.push(m);
    group.members = recursivelySortMembersByName(group.members);
  } else {
    console.warn(`${path} does not exist in NationalDatasets`);
  }
});

// Australian Capital Territory Government
// const ACT = {
//   name: "Australian Capital Territory Government",
//   url: "https://www.data.act.gov.au",
//   type: "socrata-group",
//   shareKeys: ["Root Group/Australian Capital Territory Government"],
//   facetGroups: ["categories"],
// };

const replaceBadUrls = (member) => {
  if (Array.isArray(member.members)) {
    member.members.forEach(replaceBadUrls)
  }
  if (typeof member.url === 'string' && member.url.includes("www.data.gov.au")) {
    member.url = member.url.replace("www.data.gov.au", "data.gov.au")
    member.url = member.url.replace("http://data.gov.au", "https://data.gov.au")
  }
}

[
  NationalDatasets,
  DGA,
  // ACT, Disable ACT Socrata as it has major issues
  NSW,
  NT,
  QLD,
  SA,
  TAS,
  VIC,
  WA,
].forEach(replaceBadUrls)

const AnalysisTools = {
  name: "Analysis Tools",
  type: "group",
  members: [
    {
      id: "ydyr",
      name: "Your Data Your Regions (Beta)",
      description:
        "YourDataYour Regions (YDYR) is an API for the conversion of data between different Australian geographic boundaries: a process often referred to as geographic correspondence. \n\nData is often captured for specific purposes, using particular geographies or administrative boundaries, The regions and geographies used invariably change over time or vary according to the purpose of the analysis. This creates the need for data to be converted between regions to enable its re-use beyond the original purpose, adding to it value. \n\nYDYR can help users maximise the use of new and existing data by making it available for analysis, integration and display across a range of geographic regions. \n\nDeveloped by CSIRO's Data61 in partnership with the Australian Bureau of Statistics (ABS), YDYR modernises the ABS geographic correspondence workflow through the incorporation of machine learning techniques which model the relationship between users' own data and various data collected and maintained by the ABS. \nThis is a beta version of the tool limited to a small number of users for evaluation process. Update to a production version of the tool will depend on user feedback and assessment of the results.\n\n### User Guide\n**Users should note that the use of different algorithms may produce different results. All outputs from YDYR are modelled outcomes that should be used and interpreted with caution. The results are not representative of official statistics from the ABS or CSIRO's Data61.** \n\nThe tool is currently under evaluation and users need to register their interest in testing it by emailing info@terria.io.\nIt can be tested on both the [ydyr.info ](https://ydyr.info/ )website and NationalMap, providing users two options for running the re-aggregation process. You will be prompted to enter username and password to run the analysis (at the last step). \n\n### Getting started to test YDYR on NationalMap\nThe YDYR correspondence process includes 4 simple steps: \n\n1\\. **Specify the data source** - example, in the catalogue search and select a [Statistical Area 2](https://www.abs.gov.au/ausstats/abs@.nsf/lookup/by%20subject/1270.0.55.001~july%202016~main%20features~statistical%20area%20level%202%20(sa2)~10014) (SA2+) based dataset.\n\nOr use your own data (by adding it to the workbench).\n\n><img alt='image' src='images/ydyr-add-data.jpg' style='width: 100%;'>\n\nThe data should contain at least two columns:\n- a geography column containing unique codes (e.g. SA2)\n- a data column containing the values to be converted. For example counts of business by SA2 \n\nOnce the data has been added to the map, the YDYR analytics interface will automatically populate the Region Column and Data Column fields. \n\n><img alt='image' src='images/ydyr-parameters-guide.jpg' style='width: 100%;'>\n\n\n**2. Specify the target geography**\nUnder the Output Geography heading, select the drop down box and specify the geography which you would like to convert (for example Local Government Areas 2016). \n\n\n**3. Specify Algorithms**\nSelect one of the 2 predicting models available for converting data between the input and output geography:\n- **Negative Binomial** - This uses a discrete probability distribution. It models the number of successes in a sequence of independent and identically distributed Bernoulli trials before a specified (non-random) number of failures occurs. This approach potentially provides a better quality result because it may have a stronger relationship with the source data a user wants to convert. Due to the complexity of this approach and interpretation confidence interval, this should be used by advanced users only. \n- **Population Weighted** - This uses population data modelled to address locations to convert data between two sets of geographies. Population based correspondences are typically used to transform social datasets and they're standard correspondence approach used by the ABS. They make the assumption that the distribution of any input dataset is related to the distribution of population. \n\n**4 Run the analysis**\nYou'll be prompted to enter access credentials.\nExecute the tool. This will convert the source data file from the selected input to output geography. \nThe NationalMap workbench (left panel) will be populated with a description of the re-aggregation and a new layer, displaying the output geography and a drop down section to filter the Displaying variable (e.g. Population weighted). \n\n\n---------\n\n\n### YDYR Parameters\n\nPlease fill in the following fields, and press \"Run Analysis\" to execute the tool.",
      type: "ydyr",
      parameters: {
        apiUrl: "https://ydyr.info/api/v1/",
        "Negative Binomial": true,
        "Population Weighted": false,
        "Poisson Linear": false,
        "Ridge Regressor": false,
        "Output Geography": "ABS - 2016 Statistical Areas Level 4",
      },
    },
  ],
};

const govOpenData = [
  {
    "name": "Data.gov.au",
    "id": "6TbYz2Jj",
    "shareKeys": [
      "Root Group/Data.gov.au"
    ],
    "path": [
      "6TbYz2Jj"
    ],
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/data-gov-au/dev.json",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "id": "5UEEtwte",
    "name": "New South Wales Government",
    "shareKeys": [
      "Root Group/New South Wales Government"
    ],
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/nsw/dev.json",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "name": "Northern Territory Government",
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/nt/dev.json",
    "id": "A3fz19Mn",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "id": "DCie2ghD",
    "name": "Queensland Government",
    "shareKeys": [
      "Root Group/Queensland Government"
    ],
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/qld/dev.json",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "name": "South Australia Government",
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/sa/dev.json",
    "id": "i8H83Dhj",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "id": "PdL1jdCG",
    "name": "Tasmanian Government",
    "shareKeys": [
      "Root Group/Tasmanian Government"
    ],
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/tas/dev.json",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "name": "Victoria Government",
    "id": "E2nsA20d",
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/vic/dev.json",
    "type": "terria-reference",
    "isGroup": true
  },
  {
    "name": "Western Australia Government",
    "url": "https://terria-catalogs-public.storage.googleapis.com/common/aus-gov-open-data/wa/dev.json",
    "id": "Ne92VxU7",
    "type": "terria-reference",
    "isGroup": true
  }
]

// assemble the catalogue
const complete = _.cloneDeep(natmap20210921v8);
complete.catalog = [
  NationalDatasets,
  ...govOpenData,
  AnalysisTools,
];


complete.baseMaps = {
  enabledBaseMaps: [
    "basemap-australian-topography",
    "basemap-bing-aerial",
    "basemap-bing-aerial-with-labels",
    "basemap-positron",
    "basemap-darkmatter",
    "basemap-voyager",
    "basemap-greyscale",
  ],
  defaultBaseMapId: "basemap-bing-aerial-with-labels",
  previewBaseMapId: "basemap-positron",
  items: [
    {
      item: {
        id: "basemap-australian-topography",
        type: "esri-mapServer",
        name: "National Base Map",
        url:
          "https://services.ga.gov.au/gis/rest/services/NationalBaseMap/MapServer",
        opacity: 1,
      },
      image: "images/basemaps/australian-topo.png",
    },
    {
      item: {
        id: "basemap-voyager",
        type: "open-street-map",
        name: "Voyager",
        url: "https://global.ssl.fastly.net/rastertiles/voyager/",
        attribution: "© OpenStreetMap contributors ODbL, © CartoDB CC-BY 3.0",
        opacity: 1.0,
        subdomains: [
          "cartodb-basemaps-a",
          "cartodb-basemaps-b",
          "cartodb-basemaps-c",
          "cartodb-basemaps-d",
        ],
      },
      image:
        "https://terria-catalogs-public.storage.googleapis.com/misc/basemaps/icons/voyager-aus.png",
    },
    {
      item: {
        id: "basemap-greyscale",
        type: "esri-mapServer",
        name: "Grey Scale",
        url:
          "https://services.ga.gov.au/gis/rest/services/NationalBaseMap_GreyScale/MapServer",
        opacity: 1,
      },
      image:
        "https://terria-catalogs-public.storage.googleapis.com/nationalmap/images/base-maps/australia-grey-scale.png",
    },
  ],
};

module.exports = complete;
