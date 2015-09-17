_intRegex = /^\d+$/

module.exports =
	isArray: ( vr )->
		return Object.prototype.toString.call( vr ) is '[object Array]'

	isObject: ( vr )->
		return vr isnt null and typeof vr is 'object'

	isString: ( vr )->
		return typeof vr is 'string' or vr instanceof String

	isInt: ( vr )->
		return _intRegex.test( vr )
