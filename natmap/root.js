"use strict";
const _ = require('lodash');
const cloneFromCatalogPath = require('../helpers/cloneFromCatalogPath');
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


const Elevation = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation"]);
// remove Intertidial/NIDEM layer
// move Terrain subgroup from Land Cover
const Terrain = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Land Cover and Land Use", "Terrain"]);
Terrain.members.push(cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Contours"]));
Terrain.members.push(cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Cuttings"]));
Terrain.members.push(cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation", "Embankments"]));
Terrain.members = sortItemsByName(Terrain.members);
Elevation.members.push(Terrain);
// remove Intertidal, also Aspect & Slope as they are already in Terrain subgroup
Elevation.members = sortItemsByName(Elevation.members
                      .filter(m => m.name !== "Intertidal")
                      .filter(m => m.name !== "Aspect")
                      .filter(m => m.name !== "Land slope in percent")
                      .filter(m => m.name !== "Offshore Rocks and Wrecks")
                      .filter(m => m.name !== "Reefs and Shoals"));


const OilAndGasLayer = cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Utility", "Oil and Gas Pipelines"]);
OilAndGasLayer.layers = "4"; // fix weirdness with different styling from the Esri MapServer
const Energy = {
  type: "group",
  name: "Energy",
  members: sortItemsByName([
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Electricity Transmission Lines"]),
    cloneFromCatalogPath(natmap20200903v8, ["National Datasets", "Framework", "Electricity Transmission Substations"]),
    OilAndGasLayer
  ])
}
// TODO: did not find "Environment/Energy supply & generation" as specified in spreadsheet?




// Marine & Oceans
// TODO: can we keep the shareKey of the deleted NIDEM and add it to another occurrence of the layer?
// yes we can, add this to `shareKeys`:
// "Root Group/National Data Sets/Elevation/Intertidal/Intertidal elevation model/NIDEM - Intertidal elevation model"
// const nidemId = getFromCatalogPath(natmap20200903v8, ["National Datasets", "Elevation",
//                   "Intertidal", "Intertidal elevation model", "NIDEM - Intertidal elevation model"])
//                   .id;
// TODO: add Offshore Rocks and Reefs from Elevation


// TODO: remove Terrain subgroup from Land Cover group

// assemble the National Datasets group
const NationalDatasets = cloneFromCatalogPath(natmap20200903v8, ["National Datasets"]);
NationalDatasets.members = sortItemsByName([
    Agriculture,
    Communications,
    Elevation,
    Energy
]);

// put the National Datasets into the catalog
const complete = _.cloneDeep(natmap20200903v8);
complete.catalog = [NationalDatasets];

module.exports = complete;
