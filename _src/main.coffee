class EventEmitter
	on: (name, listener) ->
		listeners = (@_eventListeners ?= {})[name] ?= []
		listeners.push listener

	off: (name, listener) ->
		if listeners = @_eventListeners?[name]
			index = listeners.indexOf listener
			listeners[index] = null if index >= 0

	emit: (name) ->
		if listeners = @_eventListeners?[name]
			args = Array.prototype.slice.call arguments, 1
			listener?.apply @, args for listener in listeners
		
	once: (name, listener) ->
		remover = =>
			@off name, listener
			@off name, remover
		@on name, listener
		@on name, remover

	addEventListener: @::on
	removeEventListener: @::off


class Base extends EventEmitter
	_error: ( cb, err )=> 
		if not ( err instanceof Error )
			_err = new Error( err )
			_err.name = err
			try
				_err.message = @ERRORS[ err ] or " - "
		else 
			_err = err

		if not cb? 
			throw _err
		else
			cb( _err )
		return

class File extends Base

	states: [ "new", "start", "signed", "upload", "progress", "done", "invalid", "error" ]

	constructor: ( @file, @idx, @client, @options )->
		super
		@state = 0
		@validation = []
		@client.emit( "file.new", @ )

		@on( "start", @start )
		@on( "signed", @_upload )

		if not @options.requestSignFn?
			@options.requestSignFn = @_defaultRequestSignature

		if not @options.keyprefix?.length
			@options.keyprefix = "clientupload"

		if not @options.autostart?
			@options.autostart = true

		@validate()

		if @options.autostart
			@emit "start"
		return

	setState: ( state )=>
		if state > @state
			@state = state
			@emit( "state", state )
		return state

	getState: =>
		return @states[ @state ]

	validate: =>
		_size = @file.size / 1024
		if @options.maxsize > 0 and @options.maxsize < _size
			@validation.push "maxsize"

		if @options.acceptRules?.length and not @testMime( @options.acceptRules )
			@validation.push "accept"

		if @validation.length
			@setState( 6 )
			@emit( "invalid", @validation )
			@client.emit( "file.invalid", @, @validation )
			return false
		return true

	testMime: ( acceptRules )=>
		for _rule in acceptRules
			if _rule( @file )
				return true
		return false

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

	start: =>
		if @state <= 0
			@setState( 1 )
			@client.emit( "file.upload", @ )
			@_sign()
		return

	_now: =>
		return Math.round( Date.now() / 1000 )

	_rgxFile2Key: /([^A-Za-z0-9])/ig
	_sign: =>
		_name = @getName()
		_content_type = @getType()
		if @state > 1
			return
		@key = @options.keyprefix + "_" + _name.replace( @_rgxFile2Key, "" ) + "_" + @_now() + "_" + @idx
		@url = @options.host + @options.domain + "/" + @key
		@json = 
			blob: true
			acl: "public-read"
			properties: 
				filename: _name

		@json.content_type = _content_type if _content_type?.length

		@options.requestSignFn.call @, @url, @key, @json, ( err, signature )=>
			if err
				@error = err
				@setState( 7 )
				@emit( "error", err )
				@client.emit( "file.error", @, err )
				return

			if @url.indexOf( "?" ) >= 0
				@url += "&"
			else
				@url += "?"
			@url += ( "signature=" + encodeURIComponent( signature ) )

			@setState( 2 )
			@emit( "signed" )
			return
		return

	_upload: =>
		console.log "_upload", @state, @idx
		if @state > 2
			return
		@setState( 3 )
		data = new FormData()
		data.append( "JSON", JSON.stringify( @json ) )
		data.append( "blob", @file )
		
		jQuery.ajax 
			url: @url
			type: "POST"
			cache: false
			data: data
			processData: false
			contentType: false
			success: ( resp )=>
				@data = resp?.rows[ 0 ]
				@progressState = 1
				@setState( 5 )
				@emit( "done", @data )
				@client.emit( "file.done", @ )
				return
			error: ( err )=>
				@setState( 7 )
				@progressState = 0
				@error = err
				@emit( "error", err )
				@client.emit( "file.error", @, err )
				return
			xhr: =>
				xhr = new window.XMLHttpRequest()
				xhr.upload?.addEventListener( "progress", @_handleProgress(), false )
				xhr.addEventListener( "progress", @_handleProgress(), false )
				return xhr
		return

	_handleProgress: =>
		return ( evnt )=>
			@progressState = evnt.loaded/evnt.total
			@setState( 4 )
			@emit( "progress", evnt )
			return

	_defaultRequestSignature: ( madiaapiurl, key, json, cb )=>
		_url = @options.host + @options.domain + "/sign/" + @options.accesskey
		_data = 
			url: madiaapiurl
			key: key
			json: JSON.stringify( json )
		_success = ( signature )=>
				console.log "RETURN", arguments
				cb( null, signature )
				return
		_error = ( err )=>
				console.log "AJAX ERROR", arguments
				cb( err )
				return 

		_req = jQuery.post( _url, _data, null, "text" )
		_req.done _success
		_req.error _error
			
		return

###
class FileFallback extends File

	validate: =>
		return true

	getName: =>
		return @file.val()

	getType: =>
		return null

	_upload: =>
		console.log "_upload fallback", @state, @idx
		if @state > 2
			return
		@setState( 3 )
		data = new FormData()
		data.append( "JSON", JSON.stringify( @json ) )
		data.append( "blob", @file )
		
		jQuery.ajax 
			url: @url
			type: "POST"
			cache: false
			data: data
			processData: false
			contentType: false
			success: ( resp )=>
				@data = resp?.rows[ 0 ]
				@progressState = 1
				@setState( 5 )
				@emit( "done", @data )
				@client.emit( "file.done", @ )
				return
			error: ( err )=>
				@setState( 7 )
				@progressState = 0
				@error = err
				@emit( "error", err )
				@client.emit( "file.error", @, err )
				return
			xhr: =>
				xhr = new window.XMLHttpRequest()
				xhr.upload?.addEventListener( "progress", @_handleProgress(), false )
				xhr.addEventListener( "progress", @_handleProgress(), false )
				return xhr
		return
###

class FileView extends Base
	constructor: ( @fileObj, @client, @options )->
		super

		if @client.resultTemplateFn? and typeof @options.resultTemplateFn isnt "function"
			@template = @client.resultTemplateFn
		else
			@template = @_defaultTemplate

		@fileObj.on( "progress", @update() )
		@fileObj.on( "done", @update() )
		@fileObj.on( "error", @update() )
		@fileObj.on( "invalid", @update() )
		return

	render: =>
		@$el = jQuery( "<div class=\"col-sm-6 col-md-4 file\"></div>" ).html( @template( @templateData() ) )
		return @$el

	update: =>
		return ( evnt )=>
			@$el.html( @template( @templateData() ) )
			return 

	templateData: =>
		_ret = 
			name: @client.formname
			filename: @fileObj.getName()
			idx: @fileObj.idx
			state: @fileObj.getState()
			progress: @fileObj.getProgress()
			result: @fileObj.getResult()
			options: @fileObj.options
			invalid_reason: @fileObj.validation
			error: @fileObj.error

	_defaultTemplate: ( data )=>
		_html = """
	<div class="thumbnail state-#{ data.state }">
		<b>#{ data.filename}</b>
		"""
		switch data.state
			when "progress"
				_html += """
				<div class="progress">
					<div class="progress-bar" role="progressbar" aria-valuenow="#{data.progress}" aria-valuemin="0" aria-valuemax="100" style="width: #{data.progress}%;">
						<span>#{data.progress}%</span>
					</div>
				</div>
				"""
			when "done"
				_html += """
				<div class="result">
					<a href="#{data.result.url}" target="_new">Fertig! ( #{data.result.key} )</a>
				"""
				for _k, _v of data.result
					_html += """
						<input type="hidden" name="#{data.name}_#{ data.idx }_#{_k}" value="#{_v}">
					"""
				_html += """
				</div>
				"""
			when "invalid"
				_html += """
				<div class="result">
					<b>Invalid</b>
				"""
				for _reason in data.invalid_reason
				 	switch _reason
				 		when "maxsize"
				 			_html += "<div class=\"alert alert-error\">File too big. Only files until #{data.options.maxsize}kb are allowed.</div>"
				 		when "accept"
				 			_html += "<div class=\"alert alert-error\">Wrong type. Only files of type #{data.options.accept.join( ", " )} are allowed.</div>"

				 _html += """
				</div>
				"""
			when "error"
				_html += "<div class=\"alert alert-error\">An Error occured.</div>"

		_html += """
	</div>
		"""
		return _html

_defaults = 
	host: null
	domain: null
	accesskey: null
	keyprefix: "clientupload"
	autostart: true
	requestSignFn: null
	resultTemplateFn: null
	maxsize: 0
	maxcount: 0
	accept: null

_defauktKeys = for _k, _v of _defaults
	_k


class MediaApiClient extends Base
	version: "@@version"

	_rgxHost: /https?:\/\/[^\/$\s]+/i

	constructor: ( drag, elresults, options = {} )->
		super
		@enabled = true
		@useFileAPI = false
		
		@on( "file.new", @fileNew )

		@on( "file.done", @fileDone )
		@on( "file.error", @fileError )
		@on( "file.invalid", @fileError )
		@on( "finish", @onFinish )
		@within_enter = false


		@$el = @_validateEl( drag, "drag" )
		@$sel = @$el.find( "input#{ options.inputclass or "" }[type='file']" )
		if not @$sel.length
			@_error( null, "missing-select-el" )
			return

		@formname = @$sel.attr( "name" )

		if elresults?
			@$res = @_validateEl( elresults, "result" )


		_htmlData = @$el.data()
		@options = jQuery.extend( {}, _defaults, _htmlData, options or {} )

		if not @options.host?.length
			@_error( null, "missing-host" )
			retur
		if not @_rgxHost.test( @options.host )
			@_error( null, "invalid-host" )
			return
		if not @options.domain?.length
			@_error( null, "missing-domain" )
			return
		if not @options.accesskey?.length
			@_error( null, "missing-accesskey" )
			return
		if @options.maxcount?
			_mxcnt = parseInt( @options.maxcount, 10 )
			if isNaN( _mxcnt )
				@options.maxcount = _defaults.maxcount
			else
				@options.maxcount = _mxcnt

		if @options.maxcount isnt 1
			@$sel.attr( "multiple", "multiple" )

		if @options.maxsize?
			_mxsz = parseInt( @options.maxsize, 10 )
			if isNaN( _mxsz )
				@options.maxsize = _defaults.maxsize
			else
				@options.maxsize = _mxsz
		if @options.requestSignFn? and typeof @options.requestSignFn isnt "function"
			@_error( null, "invalid-requestSignfn" )
			return

		_inpAccept = @$sel.attr( "accept" )
		if @options.accept? or _inpAccept?
			_html = _inpAccept?.split( "," ) or []
			_opt = @options.accept?.split( "," ) or []
			if _html?.length
				@options.accept = _html
			else if _opt?.length
				@$sel.attr( "accept", @options.accept )
			@options.acceptRules = @generateAcceptRules( @options.accept )

		@initialize()
		@idx_started = 0
		@idx_finished = 0

		@$el.data( "mediaapiclient", @ )
		return 

	generateAcceptRules: ( accept )=>
		_rules = []

		for _rule in accept
			if _rule.indexOf( "/" ) >= 0
				_rules.push ( ->
					_regex = new RegExp( "#{_rule.replace( "*", "\\w+" )}$", "i" )
					return ( file )->  
						return _regex.test( file.type )
					)()
			else if _rule.indexOf( "." ) >= 0
				_rules.push ( ->
					_regex = new RegExp( "#{_rule.replace( ".", "\\." )}$", "i" )
					return ( file )->  
						return _regex.test( file.name )
					)()
			else if _rule is "*"
				_rules.push (( file )-> true )
		return _rules

	initialize: =>
		if window.File and window.FileList and window.FileReader
			@$sel.on( "change", @onSelect() )
			@useFileAPI = true
			@initFileAPI()
					
		#@$el.on "submit", @onSubmit
		return 

	initFileAPI: =>
		xhr = new XMLHttpRequest()
		if xhr?.upload
			@$el.on( "dragover", @onHover() )
			@$el.on( "dragover", @onOver() )
			@$el.on( "dragleave", @onLeave() )
			@$el.on( "drop", @onSelect() )
			@$el.addClass( "droppable" )
		else
		return

	onSelect: =>
		return ( evnt )=>
			evnt.preventDefault()
			if not @enabled
				return
			if @options.maxcount <= 0 or @idx_started < @options.maxcount
				@$el.removeClass( "hover" ).addClass( "process" )

				files = evnt.target?.files or evnt.originalEvent?.target?.files or evnt.dataTransfer?.files or evnt.originalEvent?.dataTransfer?.files
				@upload( files )
			else
				@$el.removeClass( "hover" )
				@disable()
			return

	onHover: =>
		return ( evnt )=>
			evnt.preventDefault()
			if not @enabled
				return
			@within_enter = true
			setTimeout( ( => @within_enter = false ), 0)
			@$el.addClass( "hover" )
			return

	onOver: =>
		return ( evnt )=>
			evnt.preventDefault()
			if not @enabled
				return
			return

	onLeave: =>
		return ( evnt )=>
			if not @enabled
				return
			if not @within_enter
				@$el.removeClass( "hover" )
			return

	upload: ( files )=>
		if @useFileAPI
			for file, idx in files when @enabled
				if @options.maxcount <= 0 or @idx_started < @options.maxcount
					@idx_started++
					new MediaApiClient.File( file, @idx_started, @, @options )
				else
					@disable()
		return

	disable: =>
		@$sel.attr( "disabled", "disabled" )
		@$el.addClass( "disabled" )
		@enabled = false
		return

	enable: =>
		@$sel.removeAttr( "disabled" )
		@$el.removeClass( "disabled" )
		@enabled = true
		return			

	fileDone: ( file )=>
		@idx_finished++
		@_checkFinish()
		return

	fileError: ( file, err )=>
		console.error "FILE-ERROR", file, err
		@idx_finished++
		@_checkFinish()
		return

	fileNew: ( file )=>
		console.log "fileNew", @formname, file, file.constructor.name
		if @$res?
			_fileview = new MediaApiClient.FileView( file, @, @options )
			@$res.append( _fileview.render() )	
		return

	onFinish: =>
		@$el.removeClass( "process" )
		return

	_checkFinish: =>
		if @idx_finished >= @idx_started
			@emit( "finish" )
			if @options.maxcount > 0 and @idx_started >= @options.maxcount
				@disable()
		return

	_validateEl: ( el, type )=>
		if not el?
			@_error( null, "missing-#{type}-el" )
			return

		switch typeof el
			when "string"
				_el = jQuery( el )
			when "object"
				if el instanceof jQuery
					_el = jQuery( el )
				if el instanceof HTMLElement
					_el = jQuery( el )

		if not _el?.length
			@_error( null, "invalid-#{type}-el" )
			return

		return _el

	

	ERRORS: 
		"missing-select-el": "Missing select element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object"
		"invalid-select-el": "Invalid select element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object"
		"missing-drag-el": "Missing drag element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object"
		"invalid-drag-el": "Invalid drag element. Please define a valid element as a jQuery Selector, DOM-node oder jQuery object"
		"missing-host": "Missing host. You have to defien a host as url starting with `http://` or `https://`."
		"invalid-host": "Invalid host. You have to defien a host as url starting with `http://` or `https://`."
		"missing-domain": "Missing domain. You have to define a domain."
		"missing-accesskey": "Missing accesskey. You have to define a accesskey."
		"missing-keyprefix": "Missing keyprefix. You have to define a keyprefix."

MediaApiClient.Base = Base
MediaApiClient.File = File
MediaApiClient.FileView = FileView

MediaApiClient.defaults = ( options )->
	for _k, _v of options when _k in _defauktKeys
		_defaults[ _k ] = _v
	return _defaults

if define?
	define [ "jquery", "bootstrap", "../bower_components/jssha/src/sha1.js" ], ( jQuery, Bootstrap, Sha1 )=>
		return MediaApiClient
else
	window.MediaApiClient = MediaApiClient
