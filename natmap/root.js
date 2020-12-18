"use strict";
const _ = require('lodash');
const cloneFromCatalogPath = require('../helpers/cloneFromCatalogPath');
const findInMembers = require('../helpers/findInMembers');
const recursivelySortMembersByName = require('../helpers/recursivelySortMembersByName');
const natmap20200903v8 = require('./in/natmap-2020-09-03-v8.json');


// remove "Land Use" subgroup from Agriculture
const Agriculture = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Agriculture"]);
Agriculture.members = Agriculture.members
                        .filter(m => m.name !== "Land Use and Cover in South Australia");


// remove ABC Photo Stories from Communications
const Communications = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Communications"]);
const TelecomsInNewDev = findInMembers(Communications.members, ["Telecommunications in New Developments"]);
TelecomsInNewDev.resourceId = "647f6ef4-61fe-45c1-a857-0c789cc4062e"; // update CKAN resource id to one that works
Communications.members = Communications.members
                              .filter(m => m.name !== "ABC Photo Stories (2009-2014)")
                              .filter(m => m.name !== "ABC Photo Stories by date");


// Elevation
// move Terrain subgroup from Land Cover
const Terrain = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Land Cover and Land Use", "Terrain"]);
Terrain.members.push(
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Contours"]),
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Cuttings"]),
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Embankments"]));
const Elevation = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation"]);
Elevation.members.push(Terrain);
Elevation.members = Elevation.members
                      .filter(m => m.name !== "Intertidal")
                      .filter(m => m.name !== "Aspect")
                      .filter(m => m.name !== "Land slope in percent")
                      .filter(m => m.name !== "Offshore Rocks and Wrecks")
                      .filter(m => m.name !== "Reefs and Shoals")
                      .filter(m => m.name !== "Contours")
                      .filter(m => m.name !== "Cuttings")
                      .filter(m => m.name !== "Embankments");


// Energy group
const Energy = {
  type: "group",
  name: "Energy",
  members: [
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Electricity Transmission Lines"]),
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Electricity Transmission Substations"]),
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Utility", "Oil and Gas Pipelines"])
  ]
}


// Environment group
const Environment = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Environment"]);
// TODO: State of the Environment 2016 group should be isPromoted, but v8 doesn't support it yet


// Habitation group
const Habitation = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Habitation"]);
// combine Cemetery Points and Areas into one layer
const Cemeteries = findInMembers(Habitation.members, ["Cemetery Points"]);
Cemeteries.name = "Cemeteries";
Cemeteries.layers = "Cemetery_Areas,Cemetery_Points"; // fix bad MapServer requiring numerical layer name
Habitation.members = Habitation.members
                        .filter(m => m.name !== "Cemetery Areas");


// Health group
const Health = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Health"]);
Health.members = Health.members
                    .filter(m => m.name !== "Victorian Local Government Area Stage 4 Lockdown 2 August 2020");


// Infrastructure group
const Infrastructure = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Infrastructure"]);
Infrastructure.members = Infrastructure.members
                            .filter(m => m.name !== "Vertical Obstructions");


// Land Cover and Land Use
const LandCover = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Land Cover and Land Use"]);
LandCover.members = LandCover.members
                            .filter(m => m.name !== "Terrain");


// Marine and Oceans
const MarineOceans = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Marine and Oceans"]);
// add the shareKey of the removed NIDEM layer from Elevation
const NIDEM = findInMembers(MarineOceans.members, ["Coastal", "Intertidal elevation model", "NIDEM - Intertidal elevation model"]);
NIDEM["shareKeys"] = ["Root Group/National Data Sets/Elevation/Intertidal/Intertidal elevation model/NIDEM - Intertidal elevation model"];
MarineOceans.members.push(
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Reefs and Shoals"]),
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Offshore Rocks and Wrecks"]),
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Ocean and Sea Names"]),
  cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Marine Parks"]));


// Boundaries
const Boundaries = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "National Boundaries"]);
Boundaries.name = "Boundaries";
Boundaries.members = [
  {
    name: "Statistical boundaries",
    type: "group",
    members: cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Statistical Boundaries"]).members
  },
  {
    name: "Jurisdictional boundaries",
    type: "group",
    members: [
      findInMembers(Boundaries.members, ["Local Government Areas (2011)"]),
      findInMembers(Boundaries.members, ["Local Government Areas (2019)"]),
      findInMembers(Boundaries.members, ["State Suburbs"]),
      findInMembers(Boundaries.members, ["States & Territories"]),
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Australian Mainland"]),
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "State Borders"])
    ]
  },
  {
    name: "Electoral boundaries",
    type: "group",
    members: [
      findInMembers(Boundaries.members, ["Commonwealth Electoral Divisions (2019)"]),
      findInMembers(Boundaries.members, ["Commonwealth Electoral Divisions (2016)"]),
      findInMembers(Boundaries.members, ["Commonwealth Electoral Divisions (2011)"]),
      findInMembers(Boundaries.members, ["State Electoral Divisions (2018)"])
    ]
  },
  {
    name: "Maritime boundaries",
    type: "group",
    members: [
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Coastline - Islands"]),
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Marine Parks"])
    ]
  },
  {
    name: "Native title boundaries",
    type: "group",
    members: [
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Indigenous Reserves"])
    ]
  },
  {
    name: "Other areas ",
    type: "group",
    members: [
      findInMembers(Boundaries.members, ["Postal Areas (2011)"]),
      findInMembers(Boundaries.members, ["Postal Areas (2016)"]),
      findInMembers(Boundaries.members, ["Australian Drainage Divisions"]),
      findInMembers(Boundaries.members, ["Natural Resource Management Regions"]),
      findInMembers(Boundaries.members, ["Tourism Regions"]),
      findInMembers(Boundaries.members, ["ASGS Remoteness Area (2016)"]),
      findInMembers(Boundaries.members, ["ASGS Remoteness Area (2011)"]),
      findInMembers(Boundaries.members, ["CDP Regions (2017)"]),
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Large Area Features"]),
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Northern Australia Infrastructure Facility Boundary"]),
      cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Prohibited Areas"])
    ]
  }
]





// Water - Surface
// Framework - Water supply reserves move to Water - Surface


// Utilities
// Framework - Onshore gas pipelines, onshore oil pipelines  move to utilities




// assemble the National Datasets group
const NationalDatasets = cloneFromCatalogPath(natmap20200903v8, ["National Datasets"]);
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
    Boundaries
]);

// put the National Datasets into the catalog
const complete = _.cloneDeep(natmap20200903v8);
complete.catalog = [NationalDatasets];

module.exports = complete;
