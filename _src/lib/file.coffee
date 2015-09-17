xhr = require( "xhr" )

class File extends require("./base")

	states: [ "new", "start", "signed", "upload", "progress", "done", "invalid", "error", "aborted" ]

	constructor: ( @file, @idx, @client, @options )->
		super
		@state = 0
		@validation = []

		@key = @options.keyprefix + "_" + @getName().replace( @_rgxFile2Key, "" ) + "_" + @_now() + "_" + @idx

		@client.emit( "file.new", @ )
		@client.on "abortAll", @abort

		@on( "start", @start )
		@on( "signed", @_upload )

		if not @options.requestSignFn?
			@options.requestSignFn = @_defaultRequestSignature

		if not @options.keyprefix?.length
			@options.keyprefix = "clientupload"

		if not @options.autostart?
			@options.autostart = true

		@_validate()

		if @options.autostart
			@emit "start"
		return

	start: =>
		if @state <= 0
			@_setState( 1 )
			@client.emit( "file.upload", @ )
			@_sign()
		return @
	
	abort: =>
		if @state <= 4
			@_setState( 8 )
			@requestUpload?.abort()
			@emit "aborted"
			@client.emit( "file.aborted", @ )
		return @
	
	getState: =>
		return @states[ @state ]

	getResult: =>
		if @state is 5 and @data?
			return { url: @data.url, hash: @data.filehash, key: @data.key, type: @data.content_type }
		return null

	getProgress: ( asFactor = false )=>
		if @state < 4
			_fac = 0
		else if @state > 4
			_fac = 1
		else
			_fac = @progressState

		if asFactor
			return _fac
		else
			return Math.round( _fac * 100 )

	getName: =>
		return @file.name

	getType: =>
		return @file.type

	getData: =>
		_ret =
			name: @client.formname
			filename: @getName()
			idx: @idx
			state: @getState()
			progress: @getProgress()
			result: @getResult()
			options: @options
			invalid_reason: @validation
			error: @error
		return _ret

	_setState: ( state )=>
		if state > @state
			@state = state
			@emit( "state", @getState() )
		return state

	_validate: =>
		_size = @file.size / 1024
		if @options.maxsize > 0 and @options.maxsize < _size
			@validation.push "maxsize"

		if @options.acceptRules?.length and not @_testMime( @options.acceptRules )
			@validation.push "accept"

		if @validation.length
			@_setState( 6 )
			@emit( "invalid", @validation )
			@client.emit( "file.invalid", @, @validation )
			return false
		return true

	_testMime: ( acceptRules )=>
		for _rule in acceptRules
			if _rule( @file )
				return true
		return false

	_now: ->
		return Math.round( Date.now() / 1000 )

	_rgxFile2Key: /([^A-Za-z0-9])/ig
	_sign: =>
		_name = @getName()
		_content_type = @getType()
		if @state > 1
			return
		@url = @options.host + @options.domain + "/" + @key
		@json =
			blob: true
			acl: @options.acl
			ttl: @options.ttl
			properties:
				filename: _name

		@json.width = @options.width if @options.width?
		@json.height = @options.height if @options.height?

		@json.tags = @options.tags if @options.tags?
		@json.properties = @options.properties if @options.properties?
		@json[ "content-disposition" ] = @options[ "content-disposition" ] if @options[ "content-disposition" ]?

		@json.content_type = _content_type if _content_type?.length

		@emit( "content", @key, @json )
		@client.emit( "file.content", @, @key, @json )

		@options.requestSignFn.call @, @options.domain, @options.accesskey, @url, @key, @json, ( err, signature )=>
			if err
				@error = err
				@_setState( 7 )
				@emit( "error", err )
				@client.emit( "file.error", @, err )
				return

			if @url.indexOf( "?" ) >= 0
				@url += "&"
			else
				@url += "?"
			@url += ( "signature=" + encodeURIComponent( signature ) )

			@_setState( 2 )
			@emit( "signed" )
			return
		return

	_upload: =>
		if @state > 2
			return
		@_setState( 3 )
		data = new FormData()
		data.append( "JSON", JSON.stringify( @json ) )
		data.append( "blob", @file )
		
		_xhr = new window.XMLHttpRequest()
		_xhr.upload?.addEventListener( "progress", @_handleProgress(), false )
		_xhr.addEventListener( "progress", @_handleProgress(), false )
		_xhr._isfile = true
		
		@requestUpload = xhr( {
			xhr: _xhr
			url: @url
			method: "POST"
			data: data
		}, ( err, resp, body )=>
			#console.log "requestUpload", err, resp, body
			if err
				@_setState( 7 )
				@progressState = 0
				@error = err
				@emit( "error", err )
				@client.emit( "file.error", @, err )
				return
				
			_data = JSON.parse( body )
			if resp.statusCode >= 300
				@_setState( 7 )
				@progressState = 0
				@error = _data
				@emit( "error", _data )
				@client.emit( "file.error", @, _data )
				return
			
			@data = _data?.rows[ 0 ]
			@progressState = 1
			@_setState( 5 )
			@emit( "done", @data )
			@client.emit( "file.done", @ )
			return
		)
		return

	_handleProgress: =>
		return ( evnt )=>
			if not evnt.target.method?
				@progressState = evnt.loaded/evnt.total
				@_setState( 4 )
				@emit( "progress", @getProgress(), evnt )
				return
			return

	_defaultRequestSignature: ( domain, accesskey, madiaapiurl, key, json, cb )=>
		_url = @options.host + domain + "/sign/" + accesskey
		
		_xhr = new window.XMLHttpRequest()
		
		data = new FormData()
		data.append( "url", madiaapiurl )
		data.append( "key", key )
		data.append( "json", JSON.stringify( json ) )
		xhr( {
			xhr: _xhr
			method: "POST"
			url: _url
			body: data
		}, ( err, resp, signature )->
			if err
				console.error "get sign error", err
				cb( err )
				return
			cb( null, signature )
			return
		)
		return
		
module.exports = File
