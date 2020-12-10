"use strict";
const _ = require('lodash');
const getFromCatalogPath = require('../helpers/getFromCatalogPath');
const natmap20200903v8 = require('./in/natmap-2020-09-03-v8.json');

// remove "Land Use" subgroup from Agriculture
const Agriculture = _.cloneDeep(getFromCatalogPath(natmap20200903v8, ["National Datasets", "Agriculture"]));
Agriculture.members = Agriculture.members.filter(m => m.name !== "Land Use and Cover in South Australia");

// remove ABC Photo Stories from Communications
const Communications = _.cloneDeep(getFromCatalogPath(natmap20200903v8, ["National Datasets", "Communications"]));
Communications.members = Communications.members
                            .filter(m => m.name !== "ABC Photo Stories (2009-2014)")
                            .filter(m => m.name !== "ABC Photo Stories by date");

// assemble the National Datasets group
const NationalDatasets = _.cloneDeep(getFromCatalogPath(natmap20200903v8, ["National Datasets"]));
NationalDatasets.members = [
    Agriculture,
    Communications
]

// put the National Datasets into the catalog
const complete = _.cloneDeep(natmap20200903v8);
complete.catalog = [NationalDatasets];

module.exports = complete;
