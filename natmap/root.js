"use strict";
const _ = require('lodash');
const getFromCatalogPath = require('../helpers/getFromCatalogPath');
const natmap20200903v8 = require('./in/natmap-2020-09-03-v8.json');

const Agriculture = _.cloneDeep(getFromCatalogPath(natmap20200903v8, ["National Datasets", "Agriculture"]));
Agriculture.members = Agriculture.members.filter(m => m.name !== "Land Use and Cover in South Australia");

const Communications = _.cloneDeep(getFromCatalogPath(natmap20200903v8, ["National Datasets", "Communications"]));
Communications.members = Communications.members
                            .filter(m => m.name !== "ABC Photo Stories (2009-2014)")
                            .filter(m => m.name !== "ABC Photo Stories by date");

module.exports = {
  catalog: [
    {
      name: "National Datasets",
      type: "group",
      members: [
        {
          name: "Agriculture",
          id: "6EKwTvLj",
          type: "group",
          members: Agriculture.members
        },
        {
          name: "Communications",
          id: "EjSkCmuD",
          type: "group",
          members: Communications.members
        }
      ]
    }
  ],
  workbench: [],
  corsDomains: [
    "corsproxy.com",
    "programs.communications.gov.au",
    "mapsengine.google.com",
    "s3-ap-southeast-2.amazonaws.com",
    "data.melbourne.vic.gov.au",
    "data.act.gov.au",
    "dea.ga.gov.au",
    "gsky.nci.org.au",
    "discover.data.vic.gov.au",
    "data.gov.au"
  ],
  homeCamera: {
    north: -8,
    east: 158,
    south: -45,
    west: 109
  }
}
