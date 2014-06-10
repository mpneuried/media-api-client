jQuery( ->
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaApiClient( "#standard" )
	clientCount = new MediaApiClient( "#count" )
	clientSize = new MediaApiClient( "#smallfile" )
	clientType = new MediaApiClient( "#acceptonly" )
	return
)