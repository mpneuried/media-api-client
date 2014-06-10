require.config
	paths:
		jquery: "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery"
		bootstrap: "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"
	shim:
		bootstrap:
			deps: [ "jquery" ]
			exports: "Bootstrap"


require [ "jquery", "bootstrap", "../build/mediaapiclient" ], ( jQuery, Bootstrap, MediaApiClient )=>
	
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaApiClient( "#standard", "#standard .results" )
	clientCount = new MediaApiClient( "#count", "#count .results")
	clientSize = new MediaApiClient( "#smallfile", "#smallfile .results" )
	clientType = new MediaApiClient( "#acceptonly", "#acceptonly .results" )
	return