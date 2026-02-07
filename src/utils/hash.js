const crypto = require("crypto");

function hashObject(content) {
  return crypto
    .createHash("sha1")
    .update(content)
    .digest("hex");
}

module.exports = { hashObject };
