var br = require("./pt/common.json");
var es = require("./es/common.json");
var en = require("./en/common.json");

const i18n = {
  translations: {
    br,
    es,
    en,
  },
  defaultLang: "br",
  useBrowserDefault: true,
};

module.exports = i18n;
