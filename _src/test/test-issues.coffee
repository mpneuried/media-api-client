MediaApiClient = require( "./../lib/client" )
MediaApiClient.defaults( { host: "http://localhost:1337/", domain: "issues", accesskey: "ABCDEFG" } )

clientI7 = new MediaApiClient( "#i7", "#i7 .results", { quality: 20, width: 250 } )
clientI7B = new MediaApiClient( "#i7B", "#i7B .results", { quality: 20, width: 250 } )

clientI7.on "error", ( err, file )->
	console.error "ERROR", err, file
	return
	
clientI7.on "file.error", ( err, file )->
	console.error "FILE-ERROR", err, file
	return
