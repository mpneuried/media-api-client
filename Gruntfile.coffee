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

			test:
				files: ["_src/test/**/*.coffee"]
				tasks: [ "coffee:test", "includereplace:test" ]

			testhtml:
				files: ["_src/test/**/*.html"]
				tasks: [ "copy:testhtml" ]

		coffee:
			base:
				expand: true
				cwd: '_src',
				src: ["**/*.coffee", "!test/**/*.coffee"]
				dest: 'build'
				ext: '.js'

			test:
				expand: true
				cwd: '_src/test',
				src: ["**/*.coffee"]
				dest: 'test'
				ext: '.js'

		copy:
			testhtml:
				expand: true
				cwd: '_src',
				src: ["**/*.html"]
				dest: ''
				ext: '.html'

			css:
				expand: true
				cwd: '_src',
				src: ["**/*.css"]
				dest: 'build'
				ext: '.css'

		includereplace: 
			base:
				options:
					globals:
						version: "<%= pkg.version %>"

					prefix: "@@"
					suffix: ''

				files:
					"build/main.js": ["build/main.js"]

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


	# Load npm modules
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-include-replace"

	# just a hack until this issue has been fixed: https://github.com/yeoman/grunt-regarde/issues/3
	grunt.option('force', not grunt.option('force'))
	
	# ALIAS TASKS
	grunt.registerTask "default", "build-test"
	#grunt.registerTask "test", [ "mochacli:main" ]

	# build the project
	grunt.registerTask "build", [ "coffee:base", "copy:css",  "includereplace:base" ]

	# build the project
	grunt.registerTask "build-test", [ "build", "coffee:test", "includereplace:test", "copy:testhtml" ]

	return