/*
 * grunt-fpm
 * https://github.com/spike008t/grunt-fpm
 *
 * Copyright (c) 2014 Tieu-Philippe KHIM
 * Licensed under the MIT license.
 */

'use strict';

/*
files: path // array of path

prefix: string(path)
description: string
licence: path
url: string
type: {rpm, deb...}
version: string
os: linux
arch: all
preinstallScript: path
postinstallScript: path

options: {
  debug:
}

*/

module.exports = function(grunt) {

  var path = require('path');
  var tmp = require('tmp');
  var spawn = require('child_process').spawn;
  var FPM = require('../lib/fpm');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('fpm', 'Let\'s you package your app with fpm', function() {

    // async stuff
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      debug: false,
      prefix: null,
      licence: null,
      url: null,
      type: "rpm",
      version: "1.0.0",
      os: "linux",
      arch: "all",
      beforeInstall: null,
      afterInstall: null,
      name: 'fpm'
    });

    var _this = this;

    grunt.log.writeln("Create tmp dir");

    tmp.dir({ prefix: 'fpm_', unsafeCleanup: true }, function (err, _prefixPath, cleanupCallback) {

      if (err) {
        grunt.log.error("Error: " + err);
        throw err; //todo: Handle error
      }

      grunt.log.writeln("tmpdir created at " + _prefixPath);

      // Iterate over all specified file groups.
      _this.files.forEach(function(f) {

        grunt.log.writeln('f:' + JSON.stringify(f));

        // filter on existing file
        var src = f.src.filter(function(obj) {

          if (grunt.util.kindOf(obj) === 'object') {


            grunt.log.warn('obj is object type');


            if ('src' in obj) {
              if (!grunt.file.exists(obj.src)) {
                grunt.log.warn('Source file "' + obj + '" not found.');
                return false;
              } else {
                return true;
              }
            }
          }


          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(obj)) {
            grunt.log.warn('Source file "' + obj + '" not found.');
            return false;
          } else {
            return true;
          }
        });

        var outputPath = path.join(_prefixPath, f.dest);

        if (grunt.util.kindOf(src) === 'array') {
          grunt.log.writeln("Copy Array " + src + " -> " + outputPath);

          src.map(function (filepath) {
            grunt.file.copy(filepath, outputPath);
          });

        } else {
          grunt.log.writeln("Copy string" + src + " -> " + outputPath);
          grunt.file.copy(src, outputPath);
        }

      }); // end foreach files

      // Print a success message.
      grunt.log.writeln('All created.');


      var builder = new FPM();

      builder.setType(options.type);
      builder.setDebug(options.debug);
      builder.setVersion(options.version);
      builder.setPrefix(options.prefix);
      builder.setName(options.name);
      builder.setSource(_prefixPath);
      builder.setArch(options.arch);

      var loggerCallback = function(stderr, stdout) {
        if (stderr) {
          grunt.log.writeln('STDERR: ' + stderr);
        }

        if (stdout) {
          grunt.log.writeln('STDOUT: ' + stdout);
        }
      };

      var onEnd = function(code) {
        grunt.log.writeln('End process with code: ' + code);
        cleanupCallback();
        done();
      };

      builder.build(onEnd, loggerCallback);


/*

      // generate command line
      var args = [];

      if (options.debug) {
        args.push("--debug");
      }

      args.push("--rpm-os", options.os);

      args.push("-s", "dir");

      args.push("-t", options.type);

      args.push("-n", options.name);

      args.push("-v", options.version);

      if (options.prefix) {
        args.push("--prefix", options.prefix);
      }

      args.push(_prefixPath);

      grunt.log.writeln("Execute command : fpm " + args.join(" "));


      var fpmBuilder = spawn('fpm', args);

      fpmBuilder.stdout.on('data', function(data) {
        grunt.log.writeln('STDOUT: ' + data);
      });

      fpmBuilder.stderr.on('data', function(data) {
        grunt.log.warn("STDERR: " + data);
      });

      fpmBuilder.on('close', function(code) {
        console.log("End process with code: " + code);
        cleanupCallback();
        done();
      });

*/


    });

  }); // end grunt.registerMultiTask

};
