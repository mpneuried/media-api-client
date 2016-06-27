express = require( "express" )
cors = require('cors')

app = express()
app.use(cors())

PORT = 1337

app.post "/:domain/sign/*", (req, res)->
	console.log "SIGN `#{req.params.domain}` with 403"
	res.sendStatus( 403 )
	return
	
app.listen PORT, ->
	console.log "started test server on #{PORT}"
	return
