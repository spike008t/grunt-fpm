/*
 * grunt-fpm
 * https://github.com/spike008t/grunt-fpm
 *
 * Copyright (c) 2014 Tieu-Philippe KHIM
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    fpm: {
      default_options: {
        options: {
          debug: true,
          name: "test-package",
          output: '/tmp/',
          prefix: '/'
        },
        files: {
          '/tmp/src': ['test/fixtures/src/*'],
          '/tmp/test2/test2': ['test/fixtures/src/test2']
        },
      },
      // custom_options: {
      //   options: {
      //     separator: ': ',
      //     punctuation: ' !!!',
      //   },
      //   files: {
      //     'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
      //   },
      // },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'fpm', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
