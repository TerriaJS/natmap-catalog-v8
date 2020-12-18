"use strict";

const fs = require("fs");
const path = require("path");

const readMd = (page) =>
  fs.readFileSync(path.join(__dirname, `${page}.md`), { encoding: "utf-8" });

const aboutPageAspect = {
  pages: {
    home: {
      content: readMd("about"),
    },
    privacy: {
      content: readMd("privacy"),
    },
  },
};

fs.writeFileSync(path.join(__dirname, 'terria-saas-about-pages.json'), JSON.stringify(aboutPageAspect, null, 2));

