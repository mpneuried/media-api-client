require.config
	paths:
		jquery: "../bower_components/jquery/dist/jquery"
		bootstrap: "http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"
	shim:
		bootstrap:
			deps: [ "jquery" ]
			exports: "Bootstrap"


require [ "jquery", "bootstrap", "../build/main" ], ( jQuery, Bootstrap, MediaAPICli )=>
	
	MediaAPICli.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaAPICli( "#standard" )
	clientCount = new MediaAPICli( "#count" )
	clientSize = new MediaAPICli( "#smallfile" )
	clientType = new MediaAPICli( "#acceptonly" )
	return