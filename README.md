# grunt jade selected compile

> Compiles jade files up on saving. It won't compile all jade files. If you have too many files it saves lot of time. This plugin is same as grunt-jade-selected-compile but you don't have to specify each and every file in Grunt.js. 

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jade-selected-compile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jade-selected-compile');
```

## The "csjade" task

### Overview
In your project's Gruntfile, add a section named `cs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cs: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

## Defaults

```javascript
options: {
  client: true,
  runtime: true,
  compileDebug: false,
  locals: {},
  extension: null,
  basePath: null
}

wrapper: {
  wrap: true,
  amd: false,
  dependencies: ''
}
```

### Usage Examples

#### Example config

```javascript
grunt.initConfig({
  csjade: {
        html: {
            src: ['<%= yeoman.app %>/template/*.jade'],
            options: {
                dest: '<%= yeoman.app %>',
                client: false,
                pretty: true
            }
        }
    }
});

grunt.loadNpmTasks('grunt-jade-selected-compile');

grunt.registerTask('default', ['jshint', 'csjade']);
```
#####Use it with watch tasks
```watch: {
            coffee: {
                files: ['<%= yeoman.app %>/js/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            jade: {
                files: ['<%= yeoman.app %>/template/**/*.jade'],
                tasks: ['jade']
            },
            cs: {
                files: ['<%= yeoman.app %>/css/{,*/}*.{scss,sass}'],
                tasks: ['cs']
            }
        }
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
