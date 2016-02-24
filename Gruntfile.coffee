module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		cnf: grunt.file.readJSON('config.json')
		banner: """
/*
 * Media-API-Client <%= pkg.version %> ( <%= grunt.template.today( 'yyyy-mm-dd' )%> )
 * https://github.com/mpneuried/media-api-client/tree/<%= pkg.version %>
 *
 * Released under the MIT license
 * https://github.com/mpneuried/media-api-client/blob/master/LICENSE
*/

"""
		watch:
			css:
				files: ["_src/**/*.css"]
				tasks: [ "copy:css" ]

			stylus:
				files: ["_src/**/*.styl"]
				tasks: [ "stylus:css" ]
			
			coffee:
				files: ["_src/lib/**/*.coffee"]
				tasks: [ "coffee:basecommonjs" ]

			test:
				files: ["_src/test/**/*.coffee", "!_src/test/**/*commonjs.coffee"]
				tasks: [ "coffee:test", "includereplace:test" ]

			testhtml:
				files: ["_src/test/**/*.html"]
				tasks: [ "copy:testhtml", "includereplace:test" ]

		coffee:
			test:
				expand: true
				cwd: '_src/test',
				src: ["**/*.coffee"]
				dest: 'test'
				ext: '.js'
			basecommonjs:
				options: 
					banner: "<%= banner %>"
				expand: true
				cwd: '_src/lib',
				src: ["**/*.coffee"]
				dest: 'lib'
				ext: '.js'
		
		concurrent:
			watch:
				tasks: [ "browserify:dev", "watch" ]
				options:
					logConcurrentOutput: true
		
		browserify:
			base:
				options:
					banner: "<%= banner %>"
					transform: ["coffeeify"]
					plugin: [
						[ "browserify-derequire" ]
					]
					browserifyOptions:
						extensions: ".coffee"
						standalone: "MediaApiClient"
				files:
					'dist/mediaapiclient.js': "_src/lib/main.coffee"
								
			commonjs_test:
				options:
					banner: "<%= banner %>"
					transform: ["coffeeify"]
					plugin: [
						[ "browserify-derequire" ]
					]
					browserifyOptions:
						extensions: ".coffee"
				files:
					'test/test-commonjs.js': "_src/test/test-commonjs.coffee"

			basedebug:
				options:
					banner: "<%= banner %>"
					transform: ["coffeeify"]
					plugin: [
						[ "browserify-derequire" ]
					]
					browserifyOptions:
						debug: true
						extensions: ".coffee"
						standalone: "MediaApiClient"
				files:
					'dist/mediaapiclient.debug.js': "_src/lib/main.coffee"
			
			dev:
				options:
					watch: true
					keepAlive: true
					transform: ["coffeeify"]
					plugin: [
						[ "browserify-derequire" ]
					]
					browserifyOptions:
						debug: true
						extensions: ".coffee"
						standalone: "MediaApiClient"
				files:
					'dist/mediaapiclient.debug.js': "_src/lib/main.coffee"

		stylus:
			options:
				compress: false
				banner: "<%= banner %>"
			css:
				files:
					"dist/mediaapiclient.css": ["_src/main.styl"]
					"dist/mediaapiclient-nonbootstrap.css": ["_src/nonbootstrap.styl"]

		copy:
			testhtml:
				expand: true
				cwd: '_src',
				src: ["**/*.html"]
				dest: ''
				ext: '.html'

		uglify:
			options:
				banner: "<%= banner %>"
			js:
				files:
					"dist/mediaapiclient.min.js": ["dist/mediaapiclient.js"]

		cssmin:
			options:
				banner: "<%= banner %>"
			css:
				files:
					"dist/mediaapiclient.min.css": ["dist/mediaapiclient.css"]
					"dist/mediaapiclient-nonbootstrap.min.css": ["dist/mediaapiclient-nonbootstrap.css"]
		
		clean:
			release:
				src: [ "lib", "test", "dist" ]
		
		compress:
			release:
				options:
					archive: "_releases/<%= pkg.name %>_<%= pkg.version %>.zip"
				files: [
						{ src: [ "README.md", "dist/**" ], dest: "./" }
				]
		
		includereplace:
			base:
				options:
					globals:
						version: "<%= pkg.version %>"

					prefix: "@@"
					suffix: ''

				files:
					"dist/mediaapiclient.js": ["dist/mediaapiclient.js"]

			test:
				options:
					globals:
						testaccesskey: "<%= cnf.test.accessKeyId %>"
						testhost: "<%= cnf.test.host %>"

					prefix: "@@"
					suffix: ''

				files:
					"test/test.js": ["test/test.js"]
					"test/test.html": ["test/test.html"]
					"test/test-require.js": ["test/test-require.js"]
					"test/test-require.html": ["test/test-require.html"]
					"test/test-commonjs.js": ["test/test-commonjs.js"]
					"test/test-commonjs.html": ["test/test-commonjs.html"]

	# Load npm modules
	grunt.loadNpmTasks "grunt-contrib-clean"
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-stylus"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-contrib-cssmin"
	grunt.loadNpmTasks "grunt-include-replace"
	grunt.loadNpmTasks "grunt-contrib-compress"
	grunt.loadNpmTasks "grunt-concurrent"
	grunt.loadNpmTasks "grunt-browserify"

	# just a hack until this issue has been fixed: https://github.com/yeoman/grunt-regarde/issues/3
	grunt.option('force', not grunt.option('force'))
	
	
	# ALIAS TASKS
	grunt.registerTask "watcher", [ "concurrent:watch" ]
	grunt.registerTask "default", "build-test"
	grunt.registerTask "minify", [ "uglify:js", "cssmin:css" ]

	# build the project
	grunt.registerTask "build", [ "browserify:base", "coffee:basecommonjs", "stylus:css", "includereplace:base", "minify" ]

	# build the project
	grunt.registerTask "build-test", [ "build", "coffee:test", "browserify:basedebug", "browserify:commonjs_test", "includereplace:test", "copy:testhtml" ]
	grunt.registerTask "release", [ "clean:release", "build", "compress:release" ]

	return
