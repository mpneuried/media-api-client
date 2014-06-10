module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		cnf: grunt.file.readJSON('config.json')
		watch:
			base:
				files: ["_src/**/*.coffee", "!_src/test/**/*.coffee"]
				tasks: [ "coffee:base", "includereplace:base" ]

			css:
				files: ["_src/**/*.css"]
				tasks: [ "copy:css" ]

			stylus:
				files: ["_src/**/*.styl"]
				tasks: [ "stylus:css" ]

			test:
				files: ["_src/test/**/*.coffee"]
				tasks: [ "coffee:test", "includereplace:test" ]

			testhtml:
				files: ["_src/test/**/*.html"]
				tasks: [ "copy:testhtml", "includereplace:test" ]

		coffee:
			base:
				files:
					"build/mediaapiclient.js": ["_src/main.coffee"]

			test:
				expand: true
				cwd: '_src/test',
				src: ["**/*.coffee"]
				dest: 'test'
				ext: '.js'

		stylus:
			options:
				compress: false
			css:
				files:
					"build/mediaapiclient.css": ["_src/main.styl"]
					"build/mediaapiclient-nonbootstrap.css": ["_src/nonbootstrap.styl"]

		copy:
			testhtml:
				expand: true
				cwd: '_src',
				src: ["**/*.html"]
				dest: ''
				ext: '.html'

		uglify:
			options: 
				banner: "/*\nMedia-API Client (<%= pkg.version %>)\n*/\n"
			js:
				files:
					"build/mediaapiclient.min.js": ["build/mediaapiclient.js"]

		cssmin:
			options: 
				banner: "/*\nMedia-API Client (<%= pkg.version %>)\n*/"
			css:
				files:
					"build/mediaapiclient.min.css": ["build/mediaapiclient.css"]
					"build/mediaapiclient-nonbootstrap.min.css": ["build/mediaapiclient-nonbootstrap.css"]

		includereplace: 
			base:
				options:
					globals:
						version: "<%= pkg.version %>"

					prefix: "@@"
					suffix: ''

				files:
					"build/mediaapiclient.js": ["build/mediaapiclient.js"]

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


	# Load npm modules
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-stylus"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-contrib-cssmin"
	grunt.loadNpmTasks "grunt-include-replace"

	# just a hack until this issue has been fixed: https://github.com/yeoman/grunt-regarde/issues/3
	grunt.option('force', not grunt.option('force'))
	
	# ALIAS TASKS
	grunt.registerTask "default", "build-test"
	grunt.registerTask "minify", [ "uglify:js", "cssmin:css" ]

	# build the project
	grunt.registerTask "build", [ "coffee:base", "stylus:css", "includereplace:base", "minify" ]

	# build the project
	grunt.registerTask "build-test", [ "build", "coffee:test", "includereplace:test", "copy:testhtml" ]

	return