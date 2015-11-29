var http = require("http");
var Playlist = require("./playlist");

// Create the webserver
http.createServer(function(request, response) {
  response.writeHeader(200, {'Content-Type': 'application/json'});

  // Call the getData-function that does everything
  Playlist.getData(function(error, result){
    response.end(JSON.stringify(result));
  });

}).listen(3000, '127.0.0.1');

// Console info
console.log("Server running at http://127.0.0.1:3000");
