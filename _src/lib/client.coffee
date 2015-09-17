dom = require( "domel" )

utils = require( "./utils" )
Base = require( "./base" )
File = require( "./file" )
FileView = require( "./fileview" )

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
	width: null
	height: null
	accept: null
	ttl: 0
	acl: "public-read"
	properties: null
	tags: null
	"content-disposition": null
	cssdroppable: "dropable"
	csshover: "hover"
	cssprocess: "process"
	cssdisabled: "disabled"

_defauktKeys = for _k, _v of _defaults
	_k

class Client extends Base
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
		@on( "file.aborted", @fileError )
		@on( "finish", @onFinish )
		@within_enter = false


		@el = @_validateEl( drag, "drag" )
		@sel = @el.d.find( "input#{ options.inputclass or "" }[type='file']", true )
		if not @sel?
			@_error( null, "missing-select-el" )
			return

		@formname = @sel.getAttribute( "name" )

		if elresults?
			@res = @_validateEl( elresults, "result" )


		_htmlData = @el.d.data()
		@options = utils.assign( {}, _defaults, _htmlData, options or {} )

		if not @options.host?.length
			@_error( null, "missing-host" )
			return

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
			@sel.setAttribute( "multiple", "multiple" )

		if @options.maxsize?
			_mxsz = parseInt( @options.maxsize, 10 )
			if isNaN( _mxsz )
				@options.maxsize = _defaults.maxsize
			else
				@options.maxsize = _mxsz

		if @options.requestSignFn? and typeof @options.requestSignFn isnt "function"
			@_error( null, "invalid-requestSignfn" )
			return

		if @options.ttl? and not utils.isInt( @options.ttl )
			@_error( null, "invalid-ttl" )
			return
		else if @options.ttl?
			@options.ttl = parseInt( @options.ttl, 10 )
			if isNaN( @options.ttl )
				@_error( null, "invalid-ttl" )
				return

		if @options.tags? and utils.isArray( @options.tags )
			for _tag in @options.tags when not utils.isString( _tag )
				@_error( null, "invalid-tags" )
				return
		else if @options.tags?
			@_error( null, "invalid-tags" )
			return

		if @options.properties? and not utils.isObject( @options.properties )
			@_error( null, "invalid-properties" )
			return

		if @options[ "content-disposition" ]? and not utils.isString( @options[ "content-disposition" ] )
			@_error( null, "invalid-content-disposition" )
			return

		if @options.acl? and not utils.isString( @options.acl ) and @options.acl not in [ "public-read", "authenticated-read" ]
			@_error( null, "invalid-acl" )
			return

		_inpAccept = @sel.getAttribute( "accept" )
		if @options.accept? or _inpAccept?
			_html = _inpAccept?.split( "," ) or []
			_opt = @options.accept?.split( "," ) or []
			if _html?.length
				@options.accept = _html
			else if _opt?.length
				@sel.setAttribute( "accept", @options.accept )
			@options.acceptRules = @generateAcceptRules( @options.accept )

		@initialize()
		@idx_started = 0
		@idx_finished = 0

		@el.d.data( "mediaapiclient", @ )
		return

	generateAcceptRules: ( accept )->
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
			@sel.d.on( "change", @onSelect )
			@useFileAPI = true
			@initFileAPI()
		else
			# TODO implement IE9 Fallback		
		return

	initFileAPI: =>
		xhr = new XMLHttpRequest()
		
		if xhr?.upload
			@el.ondragover = @onHover
			@el.ondragleave = @onLeave
			@el.ondrop = @onSelect
			
			@el.d.addClass( @options.cssdroppable )
		else
		return

	onSelect: ( evnt )=>
		evnt.preventDefault()
		if not @enabled
			return
		if @options.maxcount <= 0 or @idx_started < @options.maxcount
			@el.d.removeClass( @options.csshover )
			@el.d.addClass( @options.cssprocess )

			files = evnt.target?.files or evnt.originalEvent?.target?.files or evnt.dataTransfer?.files or evnt.originalEvent?.dataTransfer?.files
			@upload( files )
		else
			@el.d.removeClass( @options.csshover )
			@disable()
		return

	onHover: ( evnt )=>
		evnt.preventDefault()
		if not @enabled
			return
		@within_enter = true
		setTimeout( ( => @within_enter = false ), 0)
		@el.d.addClass( @options.csshover )
		return

	onOver: ( evnt )=>
		evnt.preventDefault()
		if not @enabled
			return
		return

	onLeave: ( evnt )=>
		if not @enabled
			return
		if not @within_enter
			@el.d.removeClass( @options.csshover )
		return

	upload: ( files )=>
		if @useFileAPI
			for file, idx in files when @enabled
				if @options.maxcount <= 0 or @idx_started < @options.maxcount
					@idx_started++
					new File( file, @idx_started, @, @options )
				else
					@disable()
		return

	abortAll: =>
		@emit "abortAll"
		return

	disable: =>
		@sel.setAttribute( "disabled", "disabled" )
		@el.d.addClass( @options.cssdisabled )
		@enabled = false
		return

	enable: =>
		@sel.removeAttribute( "disabled" )
		@el.d.removeClass( @options.cssdisabled )
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
		if @res?
			_fileview = new FileView( file, @, @options )
			@res.d.append( _fileview.render() )
		return

	onFinish: =>
		@el.d.removeClass( @options.cssprocess )
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
				_el = dom( el, null, true )
			when "object"
				if el instanceof HTMLElement
					_el = dom.domel( el )

		if not _el?
			@_error( null, "invalid-#{type}-el" )
			return

		return _el

	

	ERRORS:
		"missing-select-el": "Missing select element. Please define a valid element as a Selector, DOM-node"
		"invalid-select-el": "Invalid select element. Please define a valid element as a Selector, DOM-node"
		"missing-drag-el": "Missing drag element. Please define a valid element as a Selector, DOM-node"
		"invalid-drag-el": "Invalid drag element. Please define a valid element as a Selector, DOM-node"
		"missing-host": "Missing host. You have to defien a host as url starting with `http://` or `https://`."
		"invalid-host": "Invalid host. You have to defien a host as url starting with `http://` or `https://`."
		"missing-domain": "Missing domain. You have to define a domain."
		"missing-accesskey": "Missing accesskey. You have to define a accesskey."
		"missing-keyprefix": "Missing keyprefix. You have to define a keyprefix."
		"invalid-ttl": "for the option `ttl` only a positiv number is allowed"
		"invalid-tags": "for the option `tags` only an array of strings is allowed"
		"invalid-properties": "for the option `properties` only an object is allowed"
		"invalid-content-disposition": "for the option `content-disposition` only an string like: `attachment; filename=friendly_filename.pdf` is allowed"
		"invalid-acl": "the option acl only accepts the string `public-read` or `authenticated-read`"

Client.defaults = ( options )->
	for _k, _v of options when _k in _defauktKeys
		_defaults[ _k ] = _v
	return _defaults
	
module.exports = Client
