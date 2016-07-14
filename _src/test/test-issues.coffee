xhr = require( "xhr" )
MediaApiClient = require( "./../lib/client" )

clientI7 = new MediaApiClient( "#i7", "#i7 .results", { quality: 20, width: 250, domain: "issues", accesskey: "ABCDEFG", host: "http://localhost:@@testport/" } )
clientI7B = new MediaApiClient( "#i7B", "#i7B .results", { quality: 20, width: 250, domain: "issues", accesskey: "ABCDEFG", host: "http://localhost:@@testport/" } )

clientI7.on "error", ( err, file )->
	console.error "ERROR", err, file
	return
	
clientI7.on "file.error", ( err, file )->
	console.error "FILE-ERROR", err, file
	return
	
myRequestSignFn = ( domain, accesskey, madiaapiurl, key, json, cb )=>
	
	_url = "http://localhost:@@testport/#{domain}/sign"
	
	_xhr = new window.XMLHttpRequest()
	
	data =
		url: madiaapiurl
		key: key
	if json?
		data.json =json
		
	xhr( {
		xhr: _xhr
		method: "POST"
		url: _url
		body: JSON.stringify( data )
		headers:
			"Content-Type": "application/json"
	}, ( err, resp, signature )=>
		if err
			cb( err )
			return
		if resp.statusCode < 200 or resp.statusCode >= 300
			@_error( cb, "sign-failed", { key: key, domain: domain, statusCode: resp.statusCode })
			return
		
		cb( null, signature )
		return
	)
	return

clientI8 = new MediaApiClient( "#i8", "#i8 .results", { accept: "application/pdf,image/*",  domain: "@@testdomain", accesskey: "@@testaccesskey", host: "@@testhost", requestSignFn: myRequestSignFn } )
clientI8.on "error", ( err, file )->
	console.error "ERROR", err, file
	return
	
clientI8.on "file.error", ( err, file )->
	console.error "FILE-ERROR", err, file
	return

clientI8 = new MediaApiClient( "#i8b", "#i8b .results", { accept: "image/png,image/jpeg".split( "," ),  domain: "@@testdomain", accesskey: "@@testaccesskey", host: "@@testhost", requestSignFn: myRequestSignFn } )
clientI8.on "error", ( err, file )->
	console.error "ERROR", err, file
	return
	
clientI8.on "file.error", ( err, file )->
	console.error "FILE-ERROR", err, file
	return
