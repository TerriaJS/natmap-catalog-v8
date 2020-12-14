"use strict";

/*
  members: array of catalog group members
  path: array of path name elements to be navigated in order, top down.
*/
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

module.exports = findInMembers;
