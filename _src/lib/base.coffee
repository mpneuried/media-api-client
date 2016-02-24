class Base extends require('events')
	_error: ( cb, err, data )=>
		if not ( err instanceof Error )
			_err = new Error( err )
			_err.name = err
			try
				_err.message = @ERRORS[ err ] or " - "
		else
			_err = err

		if @listeners( "error" ).length
			@emit( "error", _err, data )
		else
			console.error( _err, data )

		if not cb?
			throw _err
		else
			cb( _err )
		return
		
module.exports = Base
