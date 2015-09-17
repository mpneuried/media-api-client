require [ "../dist/mediaapiclient" ], ( MediaApiClient )->
	
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaApiClient( "#standard", "#standard .results" )
	clientCount = new MediaApiClient( "#count", "#count .results")
	clientSize = new MediaApiClient( "#smallfile", "#smallfile .results" )
	clientType = new MediaApiClient( "#acceptonly", "#acceptonly .results" )
	return
