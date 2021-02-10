"use strict";
const _ = require("lodash");
const cloneFromCatalogPath = require("../helpers/cloneFromCatalogPath");
const findInMembers = require("../helpers/findInMembers");
const recursivelySortMembersByName = require("../helpers/recursivelySortMembersByName");
const natmap20200903v8 = require("./in/natmap-2020-09-03-v8.json");
const aremi20200922v8 = require("./in/aremi-2020-09-22-v8-with-mods.json");
const aremiEvTraffic = require("./in/manual-v8-catalogs/aremi-traffic-v8.json");
const gaNewLayers = require("./in/manual-v8-catalogs/ga-new-layers-v8.json");

// remove "Land Use" subgroup from Agriculture
const Agriculture = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Agriculture",
]);
Agriculture.members = Agriculture.members.filter(
  (m) => m.name !== "Land Use and Cover in South Australia"
).map(m => {
  if (m.name === "Agricultural Exposure"){
    m.url = "https://services.ga.gov.au/gis/rest/services/Australian_Exposure_Information/MapServer";
  }
  return m;
});

// remove ABC Photo Stories from Communications
const Communications = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Communications",
]);
const TelecomsInNewDev = findInMembers(Communications.members, [
  "Telecommunications in New Developments",
]);
TelecomsInNewDev.resourceId = "647f6ef4-61fe-45c1-a857-0c789cc4062e"; // update CKAN resource id to one that works
Communications.members = Communications.members
  .filter((m) => m.name !== "ABC Photo Stories (2009-2014)")
  .filter((m) => m.name !== "ABC Photo Stories by date");

// Elevation
// move Terrain subgroup from Land Cover
const Terrain = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Land Cover and Land Use",
  "Terrain",
]);
Terrain.members.push(
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Elevation",
    "Contours",
  ]),
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Elevation",
    "Cuttings",
  ]),
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Elevation",
    "Embankments",
  ])
);
const Elevation = cloneFromCatalogPath(natmap20200903v8, [
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

const ElectricVehicle = cloneFromCatalogPath(aremi20200922v8, [
  "Electric Vehicle",
]);

ElectricVehicle.members.push(...aremiEvTraffic);

// Energy group
const Energy = {
  type: "group",
  name: "Energy",
  description:
    "The **Electricity Infrastructure** and **Renewable Energy** data groups seen in this Energy section of the catalogue have been migrated from the former **Australian Renewable Energy Mapping Infrastructure (AREMI)** site to its new home here on National Map Beta platform. Should  you encounter discrepancies with the former AREMI functionality or content, please send us feedback at [info@terria.io](mailto:info@terria.io). The migration will be finalised once all the issues have been addressed.",
  members: [
    cloneFromCatalogPath(aremi20200922v8, ["Electricity Infrastructure"]),
    cloneFromCatalogPath(aremi20200922v8, ["Renewable Energy"]),
    ElectricVehicle,
    cloneFromCatalogPath(natmap20200903v8, [
      "National Datasets",
      "Framework",
      "Electricity Transmission Lines",
    ]),
    cloneFromCatalogPath(natmap20200903v8, [
      "National Datasets",
      "Framework",
      "Electricity Transmission Substations",
    ]),
    cloneFromCatalogPath(natmap20200903v8, [
      "National Datasets",
      "Utility",
      "Oil and Gas Pipelines",
    ]),
  ],
};

// Environment group
const Environment = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Environment",
]);
// TODO: State of the Environment 2016 group should be isPromoted, but v8 doesn't support it yet

// Habitation group
const Habitation = cloneFromCatalogPath(natmap20200903v8, [
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

// Health group
const Health = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Health",
]);
Health.members = Health.members.filter(
  (m) =>
    m.name !== "Victorian Local Government Area Stage 4 Lockdown 2 August 2020"
);

// Infrastructure group
const Infrastructure = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Infrastructure",
]);
Infrastructure.members.push();
Infrastructure.members = Infrastructure.members.filter(
  (m) => m.name !== "Vertical Obstructions"
);

// Land Cover and Land Use
const LandCover = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Land Cover and Land Use",
]);
LandCover.members = LandCover.members.filter((m) => m.name !== "Terrain");

// Marine and Oceans
const MarineOceans = cloneFromCatalogPath(natmap20200903v8, [
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
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Elevation",
    "Reefs and Shoals",
  ]),
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Elevation",
    "Offshore Rocks and Wrecks",
  ]),
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Framework",
    "Ocean and Sea Names",
  ]),
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Framework",
    "Marine Parks",
  ])
);

// Boundaries
const Boundaries = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "National Boundaries",
]);
Boundaries.name = "Boundaries";
Boundaries.members = [
  {
    name: "Statistical boundaries",
    type: "group",
    members: cloneFromCatalogPath(natmap20200903v8, [
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
      cloneFromCatalogPath(natmap20200903v8, [
        "National Datasets",
        "Framework",
        "Australian Mainland",
      ]),
      cloneFromCatalogPath(natmap20200903v8, [
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
      cloneFromCatalogPath(natmap20200903v8, [
        "National Datasets",
        "Framework",
        "Coastline - Islands",
      ]),
      cloneFromCatalogPath(natmap20200903v8, [
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
      cloneFromCatalogPath(natmap20200903v8, [
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
      cloneFromCatalogPath(natmap20200903v8, [
        "National Datasets",
        "Framework",
        "Large Area Features",
      ]),
      cloneFromCatalogPath(natmap20200903v8, [
        "National Datasets",
        "Framework",
        "Northern Australia Infrastructure Facility Boundary",
      ]),
      cloneFromCatalogPath(natmap20200903v8, [
        "National Datasets",
        "Framework",
        "Prohibited Areas",
      ]),
    ],
  },
];

// Satellite Images
const SatelliteImages = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Satellite Images",
]);

// Social and Economic
const SocialEconomic = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Social and Economic",
]);

SocialEconomic.members.push({
  type: "sdmx-group",
  name: "ABS",
  id: "DPYjz1cT",
  url: "https://api.data.abs.gov.au",
  conceptOverrides: [
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).REGION_TYPE",
      type: "region-type",
      selectedId: "SA2",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).REGION",
      type: "region",
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
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_GEOGRAPHY(1.0.0).IND_REGION",
      type: "region",
      regionType: "IREG",
    },
    {
      id:
        "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ABS:CS_C16_COMMON(1.0.0).STATE",
      disable: true,
      allowUndefined: true,
    },
  ],
});

// Transport
const Transport = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Transport",
]);

// Vegetation
const Vegetation = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Vegetation",
]);

// Water
const Water = cloneFromCatalogPath(natmap20200903v8, [
  "National Datasets",
  "Water",
]);
const Surface = findInMembers(Water.members, ["Surface Water"]);
Surface.members.push(
  cloneFromCatalogPath(natmap20200903v8, [
    "National Datasets",
    "Framework",
    "Water Supply Reserves",
  ])
);

// assemble the National Datasets group
const NationalDatasets = cloneFromCatalogPath(natmap20200903v8, [
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

gaNewLayers["catalog"].map(m => {
  const path = m.catalogPath;
  const group = findInMembers(NationalDatasets.members, path);
  delete m.catalogPath;
  group.members.push(m);
})

// Data.gov.au
const DGA = cloneFromCatalogPath(natmap20200903v8, ["Data.gov.au"]);

// New South Wales Government
const NSW = cloneFromCatalogPath(natmap20200903v8, [
  "New South Wales Government",
]);
const NSWLGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "New South Wales",
]);
NSWLGA.name = "Local government data";
NSW.members = [
  NSWLGA,
  {
    name: "State data",
    type: "group",
    members: recursivelySortMembersByName(NSW.members),
  },
];

// Northern Territory Government
const NT_old = cloneFromCatalogPath(natmap20200903v8, [
  "Northern Territory Government",
]);
NT_old.name = "State data";
const NTLGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "Northern Territory",
]);
NTLGA.name = "Local government data";
const NT = {
  name: "Northern Territory Government",
  type: "group",
  members: [NTLGA, NT_old],
};

// Queensland Government
const QLD = cloneFromCatalogPath(natmap20200903v8, ["Queensland Government"]);
const QLDLGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "Queensland",
]);
QLDLGA.name = "Local government data";
QLD.members = [
  QLDLGA,
  {
    name: "State data",
    type: "group",
    members: recursivelySortMembersByName(QLD.members),
  },
];

// South Australian Government
const SA_old = cloneFromCatalogPath(natmap20200903v8, [
  "South Australian Government (BETA)",
]);
SA_old.name = "State data";
const SALGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "South Australia",
]);
SALGA.name = "Local government data";
const SA = {
  name: "South Australia Government",
  type: "group",
  members: [SALGA, SA_old],
};

// Tasmanian Government
const TAS = cloneFromCatalogPath(natmap20200903v8, ["Tasmanian Government"]);
const TASLGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "Tasmania",
]);
TASLGA.name = "Local government data";
TAS.members = [
  TASLGA,
  {
    name: "State data",
    type: "group",
    members: recursivelySortMembersByName(TAS.members),
  },
];

// Victorian Government
const VIC_old = cloneFromCatalogPath(natmap20200903v8, [
  "Victorian Government",
]);
VIC_old.name = "State data";
const VICLGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "Victoria",
]);
VICLGA.name = "Local government data";
const VIC = {
  name: "Victoria Government",
  type: "group",
  members: [VICLGA, VIC_old],
};

// Western Australian Government
const WA_old = cloneFromCatalogPath(natmap20200903v8, [
  "Western Australian Government",
]);
WA_old.name = "State data";
const WALGA = cloneFromCatalogPath(natmap20200903v8, [
  "Local Government",
  "Western Australia",
]);
WALGA.name = "Local government data";
const WA = {
  name: "Western Australia Government",
  type: "group",
  members: [WALGA, WA_old],
};

// Australian Capital Territory Government
const ACT = {
  name: "Australian Capital Territory Government",
  type: "group",
  members: [],
};

// assemble the catalogue
const complete = _.cloneDeep(natmap20200903v8);
complete.catalog = [NationalDatasets, DGA, ACT, NSW, NT, QLD, SA, TAS, VIC, WA];

module.exports = complete;
