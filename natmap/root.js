"use strict";
const getFromCatalogPath = require('../helpers/getFromCatalogPath');
const natmap20200903v8 = require('./in/natmap-2020-09-03-v8.json');

// Grab just National Datasets
const catalog = [getFromCatalogPath(natmap20200903v8, ["National Datasets"])];

module.exports = Object.assign({}, natmap20200903v8, { catalog: catalog });

