document.addEventListener 'DOMContentLoaded', ->
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )

	clientI7 = new MediaApiClient( "#i7", "#i7 .results", { quality: 20, width: 250, host: "http://localhost:1337/" } )

	stdProg = document.getElementById( "standardProgress" )
	stdProgBar = document.getElementById( "standardProgressBar" )
	stdProgBarInfo = document.getElementById( "standardProgressInfo" )

	clientI7.on "error", ( err, file )->
		console.error "ERROR", err, file
		return
		
	clientI7.on "file.error", ( err, file )->
		console.error "FILE-ERROR", err, file
		return
	
	return
