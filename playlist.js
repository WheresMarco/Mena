var config = require('./config');
var https = require("https");
var querystring = require('querystring');
var async = require("async");

// Function for getting Spotify API-token
function getToken(callback) {
  // TODO Check if token is in localstorage and display it. If not get a new one and display that

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
      'Authorization': "Basic " + config.clientSecret,
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

      // TODO Save the token

      // Report success with a token
      callback(null, token.access_token);
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

// Main function that gets the data
function getData(callback) {
  async.waterfall([
    function(callback) {
      // Get token
      getToken(callback);
    },
    function(token, callback) {
      // TODO Split into own function

      // Get data
      var options = {
        hostname: "api.spotify.com",
        path: "/v1/users/" + config.playlistUser + "/playlists/" + config.playlistID + "/tracks",
        headers: {
          'Authorization': "Bearer " + token
        }
      }

      // Do the request
      var request = https.request(options, function(response) {
        var body = "";

        // Get some chunks
        response.on("data", function(chunk) {
          body += chunk;
        });

        // When done chunking parse the data
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
    // Callback the data
    callback(null, result);
  });
}

module.exports.getData = getData;
