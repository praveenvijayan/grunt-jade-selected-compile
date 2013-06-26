/*
 * grunt-jade-selected-compile
 * https://github.com/praveen/grunt-jade-selected-compile
 *
 * Copyright (c) 2013 praveenvijayan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var fs = require('fs')
  , jadeHelpers = require('./lib/helpers').init(grunt)
  , path = require('path')
  , mt 
  , diff
  , currentTime
  , cache={};

  function cacheKey (file) {
    return file;
  }

  function fileObj (file) {  
    return  {
        fname:file,
        mdate:fs.statSync(file).mtime.getTime()
    }
  }

  grunt.registerMultiTask('csjade', 'Compiling selected jade files upon saving.', function() {

    /**
     * Default options that are expected inside the jade task
     *
     * @static
     * @type Object
     */
    var defaults = {
      /**
       * Passed to jade.compile to determine if jade is returing HTML or JS
       *
       * @static
       * @memberOf defaults
       * @type Boolean
       */
      client: true,
      runtime: true,
      compileDebug: false,
      extension: null,
      wrap: null,
      locals: null,
      basePath: null
    };

    var wrappers = {
      amd: {
        wrap: true,
        amd: true,
        node: false,
        dependencies: 'runtime'
      },
      global: {
        wrap: true,
        amd: false,
        node: false,
        dependencies: null
      },
      node: {
        wrap: true,
        amd: false,
        node: true,
        dependencies: 'runtime'
      },
      none: {
        wrap: false,
        amd: false,
        node: false,
        dependencies: null
      }
    };

    // Merge task-specific and/or target-specific options with these defaults.
    var helpers = require('grunt-lib-contrib').init(grunt)
    // Options object for jade
    , options = this.options(defaults)
    , partialObj = {}
    , _ = grunt.util._
    , fcon='';
    // Wrapper options for templates (Default to global since that is jade's client defaults)
    var wrapperKey = _.isString(options.wrap) ? options.wrap : 'global';
    var wrapper;
    if(_.isObject(options.wrap)){
      wrapper = options.wrap;
    } else {
      wrapper = this.data.wrapper || {};
    }
    wrapper = _.extend(wrappers[wrapperKey], wrapper);

    var outputExtension = (options.extension !== null)? options.extension
                                                      : (options.client? '.js' : '.html');

    var dest = path.normalize(options.dest + '/');

        // Make the dest dir if it doesn't exist
        grunt.file.mkdir(dest);

         
    var cb = this.async();

    grunt.verbose.writeflags(options, 'Options');

    var files = grunt.file.expand(this.filesSrc),
        currentFiles=[], max, partialMap={}, partialArry = [], allFiles=[], filteredPartials=[], dirName='';
    
    var compileChangedFile = function (file) {
      if(partialMap[file]){
          compileJade(file);
      }else{
          files.forEach(function(f,i){
            if(_.indexOf(partialMap[f], file)>0){
              compileJade(f);
            }
          })
      }
    }  
    
    files.forEach(function(f,i){
      // console.log(files);
      fcon = grunt.util.normalizelf(grunt.file.read(f));
      dirName = path.dirname(f)+path.sep;
      filteredPartials = _.map(fcon.match(/include.*/g), function(val){
          return dirName + val.replace('include ','').replace(/\t/g,'').replace(/^\s+|\s+$/,'')+'.jade';
      });
      // console.log(filteredPartials);
      partialMap[f] = filteredPartials;
      partialArry = partialArry.concat(filteredPartials)
    });

    allFiles = _.uniq(partialArry.concat(files));

    allFiles.forEach(function(f){
        var key = cacheKey(f);
        if (typeof cache[key] !== 'undefined'){
          if(cache[key].mdate !== fs.statSync(f).mtime.getTime()){
              compileChangedFile(f)
          }
        }else{
          if(_.indexOf(files, f)>0){
              compileJade(f);
            }
        }
        cache[key] = fileObj(f);
    });

    function compileJade (filepath) {
          console.log(filepath);
          var fileExtname = path.extname(filepath);
          var src = grunt.file.read(filepath);
          var outputFilename = path.basename(filepath, fileExtname);
          var outputDirectory = options.basePath ? path.dirname(path.relative(options.basePath, filepath)) + '/' : '';
          var outputFilepath = dest + outputDirectory + outputFilename + outputExtension;
          var compiled = jadeHelpers.compile(src, options, wrapper, outputFilename, filepath);
          grunt.file.write(outputFilepath, compiled, cb);

        if(options.client && options.runtime){
          jadeHelpers.runtime(dest, wrapper);
        }
    }
  });

};