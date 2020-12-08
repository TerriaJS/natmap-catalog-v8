"use strict";

const fs = require("fs");
const path = require("path");
const root = require("./root");

function buildCatalog() {
  fs.writeFileSync(
    path.join(__dirname, "out.json"),
    JSON.stringify(root, null, 2)
  );
}

module.exports = buildCatalog;

if (require.main === module) {
  // Executed as a script, as opposed to through `gulp build-catalog`
  buildCatalog();
}
