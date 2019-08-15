var Request = require("request");
var Converter = require("./lib/conformance-to-swagger.js");

module.exports = function(options, callback) {
  callback =
    callback ||
    function(err) {
      if (err) throw err;
    };
  var headers = {};
  if (options.token) {
    headers.Authorization = "Bearer " + options.token;
  }
  Request(
    {
      rejectUnauthorized: options.reject_unauthorized,
      url: options.fhir_url + options.conformance_path,
      headers: headers,
      json: true
    },
    function(err, resp, body) {
      if (err) return callback(err);
      var swagger = Converter.convert(options.fhir_url, body);
      swagger.securityDefinitions = swagger.securityDefinitions || {};
      swagger.securityDefinitions.Bearer = { type: "bearer" };
      callback(null, swagger);
    }
  );
};
