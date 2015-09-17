dom = require( "domel" )

class FileView extends require("./base")
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
		@el = dom.create( "div", { class:"file col-sm-6 col-md-4" } )
		@el.innerHTML = @template( @fileObj.getData() )
		return @el

	update: =>
		return ( evnt )=>
			@el.innerHTML = @template( @fileObj.getData() )
			return

	_defaultTemplate: ( data )->
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

			when "aborted"
				_html += "<div class=\"alert alert-error\">Upload aborted.</div>"

		_html += """
	</div>
		"""
		return _html
		
module.exports = FileView
