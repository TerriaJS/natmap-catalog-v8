function findMembersMatchingName(members, name, recursive) {
  name = name.toLowerCase();

  const result = [];

  members.forEach((member) => {
    if (member.name.toLowerCase().indexOf(name) >= 0) {
      result.push(member);
    }

    if (recursive && member.members) {
      const subMembers = findMembersMatchingName(
        member.members,
        name,
        recursive
      );
      if (subMembers.length > 0) {
        result.push(...subMembers);
      }
    }
  });

  return result;
}

module.exports = findMembersMatchingName;
