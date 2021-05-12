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

  // Filter out some datasets because they require access credentials and we don't have permission yet.
  Energy.members.map(m => {
    if (m.name === "Electricity Infrastructure"){
      m.members.map(m => {
        if (m.name === "Transmission"){
          m.members = m.members.filter(m => m.name !== "Western Australia");
        }
      });
    }
    
    if (m.name === "Electric Vehicle"){
      m.members = m.members.filter(m => m.name !== "Average Daily Traffic Volume" && m.name !== "Average Hourly Weekday Traffic Volume");
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

  const SatelliteImages = NationalDatasets[0].members.filter(m => m.name === "Satellite Images")[0];
  SatelliteImages.members = recursivelySortMembersByName([...SatelliteImages.members, SatelliteImager10m]);

  const Water = NationalDatasets[0].members.filter(m => m.name === "Water")[0];

  const Environment = NationalDatasets[0].members.filter(m => m.name === "Environment")[0];
  Environment.members = Environment.members.filter(m => m.name === "EPBC Referrals" || m.name === "Conservation Management Zones" || m.name === "Australian World Heritage Areas" || m.name == "State of the Environment 2016");
  Environment.members.map( m => {
    if (m.name === "State of the Environment 2016"){
      m.members = m.members.filter(m => m.name === "Biodiversity Map" || m.name === "Coasts Map");
    }
  });

  const Agriculture = NationalDatasets[0].members.filter(m => m.name === "Agriculture")[0];
  Agriculture.members = Agriculture.members.filter(m => m.name === "Forests of Australia (2018)");

  const Habitation = NationalDatasets[0].members.filter(m => m.name === "Habitation")[0];
  Habitation.members.map(m => {
    if (m.name === "Australia Post Locations"){
      m.url = "https://tiles.terria.io/static/auspost-locations.csv";
    }
  })

  const LandCover = NationalDatasets[0].members.filter(m => m.name === "Land Cover and Land Use")[0];
  LandCover.members = LandCover.members.filter(m => m.name === "Land Use and Cover");

  const MarineOceans = NationalDatasets[0].members.filter(m => m.name === "Marine and Oceans")[0];
  MarineOceans.members = MarineOceans.members.filter(m => m.name === "Coastal" || m.name === "Marine Parks" || m.name === "Reefs and Shoals");
  MarineOceans.members.map( m => {
    if (m.name === "Coastal"){
      m.members = m.members.filter(m => m.name === "High tide satellite image" || m.name === "Low tide satellite image");
      m.members.map( m => m.members = m.members.filter(m => m.name === "Imagery"));
    }
  });

  const Health = NationalDatasets[0].members.filter(m => m.name === "Health")[0];

  const SocialEconomic = NationalDatasets[0].members.filter(m => m.name === "Social and Economic")[0];
  SocialEconomic.members = SocialEconomic.members.filter(m => m.name === "Population Estimates");

  const Boundaries = NationalDatasets[0].members.filter(m => m.name === "Boundaries")[0];

  const Communications = NationalDatasets[0].members.filter(m => m.name === "Communications")[0];
  Communications.members.map(m => {
    if (m.name === "Radio Licenses - ACMA"){
      m.url = m.url.replace("http://", "https://");
    }
  })

  const Elevation = NationalDatasets[0].members.filter(m => m.name === "Elevation")[0];
  Elevation.members = Elevation.members.filter(m => m.name === "Spot Elevations" || m.name === "Horizontal Control Points" || m.name === "LiDAR 5m DEM");

  const Infrastructure = NationalDatasets[0].members.filter(m => m.name === "Infrastructure")[0];

  const Transport = NationalDatasets[0].members.filter(m => m.name === "Transport")[0];
  Transport.members = Transport.members.filter(m => m.name === "Airfields" || m.name === "Key Freight Routes");

  const VictoriaGovernment = root.catalog.filter(m => m.name === "Victoria Government")[0];
  const VictoriaLocalGovernment = VictoriaGovernment.members.filter(m => m.name === "Local government data")[0];
  VictoriaLocalGovernment.name = "Local government datasets";

  const VicCatalog = {
    "catalog": [
      {
        "id": "Root Group/National Data Sets",
        "type": "group",
        "name": "National datasets",
        "members": [Agriculture, Boundaries, Communications, Elevation, Energy, Environment, Habitation, Health, Infrastructure, LandCover, MarineOceans, SatelliteImages, SocialEconomic, Transport, Water]
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
