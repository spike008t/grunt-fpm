'use strict'

fs = require 'fs'
spawn = require('child_process').spawn

class fpm
  constructor: () ->
    @debug = false
    @source = null
    @type = null
    @prefix = null
    @description = null
    @name = null
    @version = null
    @scripts = {
      preInstall: null
      postInstall: null
    }
    @arch = 'all'
    @outputPath = "./"

  # getter & setters
  setOutputPath: (@outputPath) ->
    this

  getOutputPath: ->
    @outputPath

  setArch: (@arch) ->
    this

  getArch: ->
    @arch

  unsetDebug: ->
    @debug = false
    this

  setDebug: ->
    @debug = true
    this

  isDebug: ->
    @debug

  setSource: (_source) ->
    throw "File " + script + " does not exists!" unless fs.existsSync _source
    @source = _source
    this

  getSource: ->
    @source

  setType: (_type) ->

    switch _type
      when 'rpm', 'deb'
        @type = _type
      else
        throw "Illegal argument: " + _type + " must be deb or rpm"

    this

  getType: ->
    @type

  setPrefix: (@prefix) ->
    this

  getPrefix: ->
    @prefix

  unsetPrefix: ->
    @prefix = null
    this

  setDescription: (@description) ->
    this

  getDescription: ->
    @description

  setVersion: (@version) ->
    this

  getVersion: ->
    @version

  setName: (@name) ->
    this

  getName: ->
    @name

  getPreInstall: ->
    @scripts.preInstall

  setPreInstall: (script)->

    return this unless script

    throw "File " + script + " does not exists!" unless fs.existsSync script

    @scripts.preInstall = script
    this

  getPostInstall: ->
    @scripts.postInstall

  setPostInstall: (script) ->

    return this unless script

    throw "File " + script + " does not exists!" unless fs.existsSync script

    @scripts.postInstall = script
    this

  # methods

  generateDefaultsArgs: (args)->
    args = args || []
    args.push '--debug' if @debug
    args.push '-s', 'dir'
    args.push '-t', @type
    args.push '-n', @name
    args.push '-a', @arch
    args.push '-v', @version
    args.push '-p', @outputPath
    args.push '--description', @description if @description
    args.push '--before-install', @scripts.preInstall if @scripts.preInstall
    args.push '--after-install', @scripts.postInstall if @scripts.postInstall
    args.push '--prefix', @prefix if @prefix
    args

  generateArgsRpm: (args)->
    args = args || []
    args.push '--rpm-os', 'linux'
    args

  generateArgsDeb: (args)->
    args = args || []
    args


  build: (callback, loggerCallback)->
    args = @generateDefaultsArgs []

    switch @type
      when 'deb' then args = @generateArgsDeb args
      when 'rpm' then args = @generateArgsRpm args

    args.push '-C', @source
    args.push "./"

    loggerCallback null, "Execute command with theses args: " + args.join(' ')

    builder = spawn 'fpm', args

    builder.stdout.on 'data', (data) ->
      loggerCallback null, data

    builder.stderr.on 'data', (data) ->
      loggerCallback data, null

    builder.on 'close', (code) ->
      callback code

module.exports = fpm
