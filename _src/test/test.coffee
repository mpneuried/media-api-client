jQuery( ->
	MediaApiClient.defaults( { host: "@@testhost", domain: "mediaapitest", accesskey: "@@testaccesskey" } )
	
	clientStd = new MediaApiClient( "#standard", "#standard .results", { "content-disposition": "attachment; filename=friendly_filename.jpg", "ttl": 30 } )
	clientCount = new MediaApiClient( "#count", "#count .results" )
	clientSize = new MediaApiClient( "#smallfile", "#smallfile .results", { tags: [ "testtagA", "testtagB" ], properties: { a: 1, b: 2 }, acl: "authenticated-read", "content-disposition": "attachment; filename=friendly_filename.jpg" } )
	clientType = new MediaApiClient( "#acceptonly", "#acceptonly .results" )
	return
)