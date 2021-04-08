"use strict";

const fs = require("fs");
const path = require("path");
const root = require("./root");
const recursivelySortMembersByName  = require( "../helpers/recursivelySortMembersByName");
const findInMembers = require("../helpers/findInMembers")

function buildCatalog() {
  const NationalDatasets = root.catalog.filter(m => m.name === "National Datasets");
  const Energy = NationalDatasets[0].members.filter( m => m.name === "Energy")[0];

  // Filter out duplicates as they are already in group "Transmission".
  Energy.members = Energy.members.filter(m =>  m.name !== "Electricity Transmission Lines" && m.name !== "Electricity Transmission Substations");

  Energy.members.map(m => {
    if (m.name === "Electricity Infrastructure"){
      m.members.map(m => {
        if (m.name === "Transmission"){
          // Filter out group "Western Australia" because it requires access credentials and we don't have permission yet.
          m.members = m.members.filter(m => m.name !== "Western Australia");
        }
      })
    }
    
    if (m.name === "Electric Vehicle"){
      // Filter out the datasets that require access credentials and we don't have permission yet.
      m.members = m.members.filter(m => m.name !== "Average Daily Traffic Volume" && m.name !== "Average Hourly Weekday Traffic Volume");

      m.members.map(m => {
        if (m.name === "Places of Interest"){
          // Filter out the dataset that requires access credentials and we don't have permission yet.
          m.members = m.members.filter(m => m.name !== "Petrol Stations")
        }
      })
    }

  });

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
  const VictoriaLocalGovernment = VictoriaGovernment.members.filter( m => m.name === "Local government data")[0];
  VictoriaLocalGovernment.name = "Local government datasets";
  const VicCatalog = {
    "catalog": [
      {
        "id": "Root Group/National Data Sets",
        "type": "group",
        "name": "National datasets",
        "members": [Energy, SatelliteImages, Water]
      },
      VictoriaLocalGovernment
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
