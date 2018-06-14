var express = require('express');
var router = express.Router();

var users = [{  
  id: 1,
  name: "John",
  email: "john@mail.com",
  password: "john123"
}, {
  id: 2,
  name: "Sarah",
  email: "sarah@mail.com",
  password: "sarah123"
}];

module.exports = users;  

module.exports = router;
console.log("S")
// require("jsdom").env("", function(err, window) {
//   if (err) {
//       console.error(err);
//       return;
//   }

//   var $ = require("jquery")(window);
// });

// $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=20S0uNzagsg&key=AIzaSyBq7gHR0NBxJeAmUXWx0zlfmdUY0Z1O6k8&part=snippet&callback=?',function(req, res){
// console.log("sas")
// if (typeof(req.items[0]) != "undefined") {

//       console.log('video exists ' + req.items[0].snippet.title);
//      } else {
//       console.log('video not exists');
//    }   
//   });

// var request = require('request');

// var url = "https://www.googleapis.com/youtube/v3/videos?id=20S0uNzagsg&key=AIzaSyBq7gHR0NBxJeAmUXWx0zlfmdUY0Z1O6k8&part=snippet"
// request(url, function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
  
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   var data = JSON.parse(body)
//  // Print the HTML for the Google homepage.
//   metavid = {

//     "title" : data["items"][0]["snippet"]["localized"]["title"],
//     "image" : data["items"][0]["snippet"]["thumbnails"]["high"]["url"],
//     "date-a" : data["items"][0]["snippet"]["publishedAt"],
//     "author" : data["items"][0]["snippet"]["channelTitle"],
//     "url" : data["items"][0]["id"]

// }
// console.log(metavid)
// });