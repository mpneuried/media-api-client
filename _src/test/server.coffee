path = require( "path" )
crypto = require( "crypto" )

express = require( "express" )
cors = require('cors')
bodyParser = require('body-parser')

_p = __filename.split( "/" )
idx = _p.indexOf( "media-api-client" )
config = require( _p[..idx].join( "/" ) + "/config.json" )

app = express()
app.use( cors() )
app.use( bodyParser.json() )

PORT = process.env.PORT or config.test.port or 1337

generateSignature = ( url, stringifiedJSON )->
	if stringifiedJSON?.length >= 0
		stringToHash = url + stringifiedJSON
	else
		stringToHash = url

	shasum = crypto.createHmac( "sha1", config.test.secret )
	shasum.update( stringToHash )

	return shasum.digest('base64')

app.post "/:domain/sign*", (req, res)->
	if req.params.domain is config.test.domain
		sign = generateSignature( req.body.url, JSON.stringify( req.body.json ) )
		console.log "SIGNED `#{req.params.domain}`"
		res.status(200).send( sign )
		return
		
	console.log "SIGN `#{req.params.domain}` with 403"
	res.sendStatus( 403 )
	return
	
app.listen PORT, ->
	console.log "started test server on #{PORT}"
	return
