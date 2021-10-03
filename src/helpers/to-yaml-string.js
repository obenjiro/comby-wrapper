const YAML = require('yaml');

function toYamlString(obj) {
    const doc = new YAML.Document();
    doc.contents = obj;
    return doc.toString();
}

module.exports = {
    toYamlString,
}