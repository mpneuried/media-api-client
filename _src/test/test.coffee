jQuery( ->
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaApiClient( "#standard", "#standard .results", { "content-disposition": "attachment; filename=friendly_filename.jpg", "ttl": 30 } )
	clientCount = new MediaApiClient( "#count", "#count .results" )
	clientSize = new MediaApiClient( "#smallfile", "#smallfile .results", { tags: [ "testtagA", "testtagB" ], properties: { a: 1, b: 2 }, acl: "authenticated-read", "content-disposition": "attachment; filename=friendly_filename.jpg" } )
	clientType = new MediaApiClient( "#acceptonly", "#acceptonly .results" )

	clientStd.on "finish", ->
		console.log "all finished"
		return

	clientStd.on "file.new", ( file )=>
		file.on "aborted", ->
			console.log "file aborted", @idx
			return

		if file.idx is 1

			file.on "state", ( state )->
				console.log "file state", @idx, state
				return
			
		if file.idx is 3
			file.on "progress", ->
				console.log "Abort", @idx
				#file.abort()
				clientStd.abortAll()
				return

		if file.idx is 2
			file.on "content", ( key, json )->
				json.ttl = 60 * 5
				return

		return
	
	return
)