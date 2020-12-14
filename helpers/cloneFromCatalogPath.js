"use strict";
const _ = require('lodash');

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

function findInMembers(members, path) {
  const first = path[0];
  const rest = path.slice(1);

  for (let i = 0; i < members.length; ++i) {
    const item = members[i];
    if (item.name === first) {
      if (rest.length === 0) {
        return item;
      } else {
        const match = findInMembers(item.members, rest);
        if (match) {
          return match;
        }
      }
    }
  }
  return undefined;
}

module.exports = cloneFromCatalogPath;
