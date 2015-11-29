
// Problem: My client-app for Music Turnes the World Around can't get data directly couse it will expose the Spotify API-keys
// Solution: Use Node.js to get tokens and data and expose only the JSON-feed of tracks for my client-app.

var http = require("http");
var Playlist = require("./playlist");

// 1. Create a webserver
http.createServer(function(request, response) {
  response.writeHeader(200, {'Content-Type': 'application/json'});

  Playlist.getData(function(error, result){
    response.end(JSON.stringify(result));
  });

}).listen(3000, '127.0.0.1');

// Debug info
console.log("Server running at http://127.0.0.1:3000");

// 3. Get and save the token from Spotify API-key
// 4. Get the data from Spotify.
// 5. Display the json-data when GET
