function sortItemsByName(items) {
  return items.sort((a, b) => (a.name >= b.name ? 1 : -1));
}

module.exports = sortItemsByName;
