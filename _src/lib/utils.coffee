isObject = ( vr )->
	return ( vr isnt null and typeof vr is 'object' )

isArray = ( vr )->
	return Object.prototype.toString.call( vr ) is '[object Array]'

isString = ( vr )->
	return typeof vr is 'string' or vr instanceof String

_intRegex = /^\d+$/
isInt = ( vr )->
	return _intRegex.test( vr )

assign = ( tgrt, srcs... )->
	for src in srcs
		if isObject( src )
			for _k, _v of src
				tgrt[ _k ] = _v
	return tgrt
	
module.exports =
	isArray: isArray
	isObject: isObject
	isString: isString
	isInt: isInt
	assign: assign
