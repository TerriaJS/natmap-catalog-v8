"use strict";
const sortItemsByName = require('../helpers/sortItemsByName');

function recursivelySortMembersByName(members) {
  for (let i = 0; i < members.length; ++i) {
    const m = members[i];
    if (m.members != null) {
      recursivelySortMembersByName(m.members);
    }
  }
  return sortItemsByName(members);
}

module.exports = recursivelySortMembersByName;
