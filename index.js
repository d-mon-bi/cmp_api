var http = require ('http')
var util = require ('util')
var querystring = require ('querystring')
var client = require ('mongodb').MongoClient

var uri = process.env.MONGOLAB_URI || 'mongodb://@127.0.0.1:27017/clickmypro'

client.connect(uri, function (error, db) {
  if (error) return console.error(error)
  var collection = db.collection('professionals')
  var app = http.createServer(function (request, response){
    var origin = (request.headers.origin || '*')
    if (request.method == 'OPTIONS'){
      response.writeHead('204', 'No Content', {
        'Access-Control-Allow-Origin':origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type, accept',
	'Access-Control-Max-Age': 10,
	'Content-Length': 0
      })
      response.end()
    } else if (request.method === 'GET' && (request.url === '/doctors' || request.url === '/doctors/')){
      collection.find().toArray(function (error, results){
        if (error) return console.error(error)
        var body = JSON.stringify(results)
        response.writeHead(200, {
          'Access-Control-Allow-Origin': origin,
  	  'Content-Type':'text/plain',
	  'Content-Length': body.length
        })
        console.log('LIST OF OBJECTS:')
        console.dir(results)
        response.end(body)
      })
    } else if (request.method === 'GET' && (request.url === '/professions' || request.url === '/professions/')){
      collection.find().toArray(function (error, results){
	if (error) return console.error(error)
      })
    }
    
    })
  var port = process.env.PORT || 3000
  app.listen(port)
})
