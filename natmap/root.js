"use strict";
const _ = require('lodash');
const cloneFromCatalogPath = require('../helpers/cloneFromCatalogPath');
const findInMembers = require('../helpers/findInMembers');
const sortItemsByName = require('../helpers/sortItemsByName');
const natmap20200903v8 = require('./in/natmap-2020-09-03-v8.json');


// remove "Land Use" subgroup from Agriculture
const Agriculture = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Agriculture"]);
Agriculture.members = sortItemsByName(Agriculture.members
                        .filter(m => m.name !== "Land Use and Cover in South Australia"));


// remove ABC Photo Stories from Communications
const Communications = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Communications"]);
Communications.members = sortItemsByName(Communications.members
                              .filter(m => m.name !== "ABC Photo Stories (2009-2014)")
                              .filter(m => m.name !== "ABC Photo Stories by date"));
// TODO: "Telecommunications in New Developments" is broken - not specifying a CKAN layer correctly?


// Elevation
// move Terrain subgroup from Land Cover
const Terrain = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Land Cover and Land Use", "Terrain"]);
const Contours = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Contours"]);
Contours.layers = "14,13"; // fix bad MapServer requiring numerical layer name
Terrain.members.push(Contours);
Terrain.members.push(cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Cuttings"]));
Terrain.members.push(cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Embankments"]));
findInMembers(Terrain.members, ["Caves"]).layers = "0"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Cliffs"]).layers = "7"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Craters"]).layers = "15"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Cuttings"]).layers = "8"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Distorted Surfaces"]).layers = "17"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Embankments"]).layers = "9"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Outcrops"]).layers = "18"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Pinnacles"]).layers = "1"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Sandridges"]).layers = "11,10"; // fix bad MapServer requiring numerical layer name
findInMembers(Terrain.members, ["Sands"]).layers = "16"; // fix bad MapServer requiring numerical layer name
Terrain.members = sortItemsByName(Terrain.members);
const Elevation = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation"]);
Elevation.members.push(Terrain);
findInMembers(Elevation.members, ["Horizontal Control Points"]).layers = "5,6"; // fix bad MapServer requiring numerical layer name
findInMembers(Elevation.members, ["Spot Elevations"]).layers = "2,4,3"; // fix bad MapServer requiring numerical layer name
Elevation.members = sortItemsByName(Elevation.members
                      .filter(m => m.name !== "Intertidal")
                      .filter(m => m.name !== "Aspect")
                      .filter(m => m.name !== "Land slope in percent")
                      .filter(m => m.name !== "Offshore Rocks and Wrecks")
                      .filter(m => m.name !== "Reefs and Shoals")
                      .filter(m => m.name !== "Contours")
                      .filter(m => m.name !== "Cuttings")
                      .filter(m => m.name !== "Embankments"));


// Energy group
const Energy = {
  type: "group",
  name: "Energy",
  members: sortItemsByName([
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Electricity Transmission Lines"]),
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Electricity Transmission Substations"]),
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Utility", "Oil and Gas Pipelines"])
  ])
}
// fix bad MapServer requiring numerical layer name
findInMembers(Energy.members, ["Oil and Gas Pipelines"]).layers = "4";


// Environment group
const Environment = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Environment"]);
// TODO: State of the Environment 2016 group should be isPromoted, but v8 doesn't support it yet
Environment.members = sortItemsByName(Environment.members);


// Habitation group
const Habitation = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Habitation"]);
// combine Cemetery Points and Areas into one layer
const Cemeteries = findInMembers(Habitation.members, ["Cemetery Points"]);
Cemeteries.name = "Cemeteries";
Cemeteries.layers = "2,9"; // fix bad MapServer requiring numerical layer name
findInMembers(Habitation.members, ["Homesteads"]).layers = "24,23"; // fix bad MapServer requiring numerical layer name
findInMembers(Habitation.members, ["Populated Places"]).layers = "8,7,6,5,4"; // fix bad MapServer requiring numerical layer name
findInMembers(Habitation.members, ["Recreation Areas"]).layers = "8"; // fix bad MapServer requiring numerical layer name
findInMembers(Habitation.members, ["Urban Landscapes"]).layers = "10"; // fix bad MapServer requiring numerical layer name
Habitation.members = sortItemsByName(Habitation.members
                        .filter(m => m.name !== "Cemetery Areas"));

// Boundaries
// Framework - Australian mainland   moves to Boundaries
// Framework - Coastlines - islands  moves to Boundaries
// Framework - Large area features   moves to Boundaries
// Framework - Northern Australia Infrastructure facility  moves to Boundaries
// Framework - State borders move to Boundaries
// Framework - Prohibited areas (defence related, but with more information than Defence Prohibited Areas)
//        move to Boundaries or remove completely the datasets



// Water - Surface
// Framework - Water supply reserves move to Water - Surface


// Utilities
// Framework - Onshore gas pipelines, onshore oil pipelines  move to utilities


// Marine & Oceans
// TODO: can we keep the shareKey of the deleted NIDEM and add it to another occurrence of the layer?
// yes we can, add this to `shareKeys`:
// "Root Group/National Data Sets/Elevation/Intertidal/Intertidal elevation model/NIDEM - Intertidal elevation model"
// const nidemId = getFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation",
//                   "Intertidal", "Intertidal elevation model", "NIDEM - Intertidal elevation model"])
//                   .id;
// TODO: add Offshore Rocks and Reefs from Elevation
// Framework - Ocean and sea names moves to Marine & Oceans


// TODO: remove Terrain subgroup from Land Cover group

// assemble the National Datasets group
const NationalDatasets = cloneFromCatalogPath(natmap20200903v8, ["National Datasets"]);
NationalDatasets.members = sortItemsByName([
    Agriculture,
    Communications,
    Elevation,
    Energy,
    Environment,
    Habitation
]);

// put the National Datasets into the catalog
const complete = _.cloneDeep(natmap20200903v8);
complete.catalog = [NationalDatasets];

module.exports = complete;
