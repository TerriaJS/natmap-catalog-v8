"use strict";

const fs = require("fs");
const path = require("path");
const root = require("./root");
import recursivelySortMembersByName from "../helpers/recursivelySortMembersByName";

function buildCatalog() {
  const NationalDatasets = root.catalog.filter(m => m.name === "National Datasets");
  const Energy = NationalDatasets[0].members.filter( m => m.name === "Energy")[0];
  Energy.members = Energy.members.filter(m => m.name !== "Electricity Transmission Lines" && m.name !== "Electricity Transmission Substations");
  
  const SatelliteImager10m = {
    "id": "IYHodsgs1",
    "type": "group",
    "name": "Satellite images 10m (Daily, expedited sentinel 2 satellite images)",
    "members": [
      {
        "type": "wms",
        "name": "Near Real-Time Surface Reflectance (Sentinel 2A)",
        "url": "https://ows.dea.ga.gov.au",
        "opacity": 1,
        "layers": "s2a_nrt_granule_nbar_t",
        "id": "SHrsryUop",
        "shareKeys": [
          "Root Group/National Datasets/Satellite Images/Satellite images 10m (Daily, expedited sentinel 2 satellite images)/Near Real-Time Surface Reflectance (Sentinel 2A)"
        ]
      },
      {
        "type": "wms",
        "name": "Near Real-Time Surface Reflectance (Sentinel 2B)",
        "url": "https://ows.dea.ga.gov.au",
        "opacity": 1,
        "layers": "s2b_nrt_granule_nbar_t",
        "id": "akldfuSDR3",
        "shareKeys": [
          "Root Group/National Datasets/Satellite Images/Satellite images 10m (Daily, expedited sentinel 2 satellite images)/Near Real-Time Surface Reflectance (Sentinel 2B)"
        ]
      },
      {
        "type": "wms",
        "name": "Near Real-Time Surface Reflectance (Sentinel 2 (A and B combined))",
        "url": "https://ows.dea.ga.gov.au",
        "opacity": 1,
        "layers": "s2_nrt_granule_nbar_t",
        "id": "ofuGAAGsgj",
        "shareKeys": [
          "Root Group/National Datasets/Satellite Images/Satellite images 10m (Daily, expedited sentinel 2 satellite images)/Near Real-Time Surface Reflectance (Sentinel 2 (A and B combined))"
        ]
      }
    ],
    "shareKeys": [
      "Root Group/National Datasets/Satellite Images/Satellite images 10m (Daily, expedited sentinel 2 satellite images)"
    ]
  };

  const SatelliteImages = NationalDatasets[0].members.filter( m => m.name === "Satellite Images")[0];
  SatelliteImages.members = recursivelySortMembersByName([...SatelliteImages.members, SatelliteImager10m]);

  const Water = NationalDatasets[0].members.filter( m => m.name === "Water")[0];
  const VictoriaGovernment = root.catalog.filter( m => m.name === "Victoria Government")[0];
  VictoriaGovernment.name = "Local government datasets";
  const VicCatalog = {
    "catalog": [
      {
        "id": "Root Group/National Data Sets",
        "type": "group",
        "name": "National datasets",
        "members": [Energy, SatelliteImages, Water]
      },
      VictoriaGovernment
    ]
  };

  fs.writeFileSync(
    path.join(__dirname, "out.json"),
    JSON.stringify(VicCatalog, null, 2)
  );
}

module.exports = buildCatalog;

if (require.main === module) {
  // Executed as a script, as opposed to through `gulp build-catalog`
  buildCatalog();
}
