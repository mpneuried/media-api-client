MediaApiClient = require( "media-api-client" )
MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )

clientStd = new MediaApiClient( "#standard", "#standard .results", { quality: 20, width: 250 } )
clientCount = new MediaApiClient( "#count", "#count .results", { quality: 100, width: 250 })
clientSize = new MediaApiClient( "#smallfile", "#smallfile .results" )
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
	console.error "error", err, file
	return