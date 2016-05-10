var express = require('express');
var app = express();
var client = require('mongodb').MongoClient
var uri = process.env.CLICKMYPRO_DB_URI || 'mongodb://@127.0.0.1:27017/clickmypro'

//standard collection find and return function

var findAndReturn = function (req, res, coll, filter) {
   client.connect(uri, function (error,db){
      if (error) return console.error(error)
      var collection = db.collection(coll)
      var origin = (req.headers.origin || '*')
      collection.find(filter).toArray(function (error, results){
         if (error) return console.error(error)
         var body = JSON.stringify(results)
         res.writeHead(200, {
            'Access-Control-Allow-Origin': origin,
            'Content-Type': 'text/plain',
            'Content-Length': body.length
         })
         console.dir(results)
         res.end(body)
      })
   })
}

//get all professional for a given profession
app.get('/professionals/byProfession/:professionName', function (req,res){
   filter = {profession:req.params.professionName}
   findAndReturn(req, res, 'professionals', filter)
})
//get all professions for a given parent
app.get('/professions/byParent/:parentName', function (req,res){
   filter={parents:req.params.parentName}
   findAndReturn(req,res,'professions', filter)
})
//get all professions
app.get('/professions', function (req, res) {
   client.connect (uri, function (error, db) {
      if (error) return console.error(error)
      var collection = db.collection('professions')
      var origin = (req.headers.origin || '*')
      collection.find().toArray(function (error, results){
         if (error) return console.error(error)
	 var body = JSON.stringify(results)
	 res.writeHead(200, {
	    'Access-Control-Allow-Origin': origin,
	    'Content-Type': 'text/plain',
  	    'Content-Length': body.length
	 })
	 console.log('LIST OF PROFESSIONS:')
         console.dir(results)
         res.end(body)
      })
   })
   console.log("Got a GET request for the homepage");
})


// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
