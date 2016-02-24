document.addEventListener 'DOMContentLoaded', ->
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaApiClient( "#standard", "#standard .results", { "content-disposition": "attachment; filename=friendly_filename.jpg", "ttl": 30 } )
	clientCount = new MediaApiClient( "#count", "#count .results" )
	clientSize = new MediaApiClient( "#smallfile", "#smallfile .results", { tags: [ "testtagA", "testtagB" ], properties: { a: 1, b: 2 }, acl: "authenticated-read", "content-disposition": "attachment; filename=friendly_filename.jpg" } )
	clientType = new MediaApiClient( "#acceptonly", "#acceptonly .results" )

	stdProg = document.getElementById( "standardProgress" )
	stdProgBar = document.getElementById( "standardProgressBar" )
	stdProgBarInfo = document.getElementById( "standardProgressInfo" )

	clientStd.on "finish", ( count )->
		console.info "all finished", count
		stdProg.style.display = "none"
		return

	clientStd.on "start", ->
		console.info "started"
		stdProg.style.display = "block"
		return

	clientStd.on "progress", ( prec, counts, filecount )->
		stdProgBar.style.width = prec + "%"
		stdProgBarInfo.innerHTML = Math.round( prec ) + "% (" + ( counts[2] + counts[3] ) + "/" + filecount + ")"
		return


	clientStd.on "error", ( err, file )->
		console.info "error", err, file
		
		return
		
	clientStd.on "file.new", ( file )->
		file.on "aborted", ->
			console.log "file aborted", @idx
			return

		if file.idx is 1

			file.on "state", ( state )->
				console.log "file state", @idx, state
				return
				
			file.on "done", ( data )->
				console.log "file done", data
				clientStd.deleteFile data.key, data.revision, ( err, result )=>
					console.log "DELTED FILE", err, result
					return
				return
			
		if file.idx is 3
			file.on "progress", ->
				console.log "Abort", @idx
				file.abort()
				#clientStd.abortAll()
				return

		if file.idx is 2
			file.on "content", ( key, json )->
				json.ttl = 60 * 5
				return

		return
	
	return
