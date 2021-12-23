"use strict";
const _ = require("lodash");
const findInMembers = require("../helpers/findInMembers");

/*
  json: Complete catalog file.
  path: array of path name elements to be navigated in order, top down.
*/
function cloneFromCatalogPath(json, path) {
  const catalog = json.catalog;
  if (!catalog) {
    throw new Error("No catalog found");
  }

  const item = findInMembers(catalog, path);
  if (!item) {
    throw new Error("Could not find catalog item for path: " + path.join(","));
  }
  return _.cloneDeep(item);
}

module.exports = cloneFromCatalogPath;
