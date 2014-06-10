require.config
	paths:
		jquery: "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery"
		bootstrap: "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"
	shim:
		bootstrap:
			deps: [ "jquery" ]
			exports: "Bootstrap"


require [ "jquery", "bootstrap", "../build/mediaapiclient" ], ( jQuery, Bootstrap, MediaAPICli )=>
	
	MediaAPICli.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaAPICli( "#standard" )
	clientCount = new MediaAPICli( "#count" )
	clientSize = new MediaAPICli( "#smallfile" )
	clientType = new MediaAPICli( "#acceptonly" )
	return