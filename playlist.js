var https = require("https");
var querystring = require('querystring');
var async = require("async");

// TODO Store in a config-file
var clientSecret = "";
var playlistUser = "evil";
var playlistID = "27xfuWd9P7XaTNxLriKY6S";

// Function for getting Spotify API-token
function getToken(callback) {
  // Check if token is in localstorage and display it
  // If not get a new one and display that

  // Prepare the postdata
  var data = querystring.stringify({
    grant_type: "client_credentials"
  });

  // Set up some options like headers and stuff
  var options = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      'Authorization': "Basic " + clientSecret,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  // Do the actual request
  var request = https.request(options, function(response) {
    var body = "";

    // Feed in the data chunks to a body veriable
    response.on('data', function (chunk) {
      body += chunk;
    });

    // Done with the chunking? Then let's do some magic
    response.on("end", function() {
      var token = JSON.parse(body);

      // Report success with a token
      callback(null, token.access_token);
      // TODO Save the token
    });
  });

  // Post the data and and the stream
  request.write(data);
  request.end();

  // Did something go wrong? Let's print it out
  request.on("error", function(error) {
    console.dir(error);
  });
}

function getData(callback) {
  // Get token

  async.waterfall([
    function(callback) {
      getToken(callback);
    },
    function(token, callback) {
      // Get data

      var options = {
        hostname: "api.spotify.com",
        path: "/v1/users/" + playlistUser + "/playlists/" + playlistID + "/tracks",
        headers: {
          'Authorization': "Bearer " + token
        }
      }

      var request = https.request(options, function(response) {
        var body = "";

        response.on("data", function(chunk) {
          body += chunk;
        });

        response.on("end", function() {
          var playlist = JSON.parse(body);
          callback(null, playlist);
        })
      });

      request.end();

      request.on("error", function(error) {
        console.log(error);
      });
    }
  ], function(error, result) {
    // Output data
    callback(null, result);
  });
}

module.exports.getData = getData;
